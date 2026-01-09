import { supabase } from './supabase';
import type { RaceResult, AggregatedStats, TrackType } from '@/types';

// =============================================================================
// FETCH DRIVERS FROM DATABASE
// =============================================================================

export async function getDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }

  return data;
}

// =============================================================================
// FETCH RACES FROM DATABASE
// =============================================================================

export async function getRaces() {
  const { data, error } = await supabase
    .from('races')
    .select(`
      *,
      track:tracks(*)
    `)
    .order('scheduled_date');

  if (error) {
    console.error('Error fetching races:', error);
    return [];
  }

  return data;
}

// =============================================================================
// FETCH UPCOMING RACE
// =============================================================================

export async function getUpcomingRace() {
  const { data, error } = await supabase
    .from('races')
    .select(`
      *,
      track:tracks(*)
    `)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching upcoming race:', error);
    return null;
  }

  return data;
}

// =============================================================================
// FETCH ODDS FOR A RACE
// =============================================================================

export async function getOddsForRace(raceId: string) {
  const { data, error } = await supabase
    .from('current_odds')
    .select(`
      *,
      driver:drivers(*)
    `)
    .eq('race_id', raceId);

  if (error) {
    console.error('Error fetching odds:', error);
    return [];
  }

  return data;
}

// =============================================================================
// FETCH ALL CURRENT ODDS WITH DRIVER INFO
// =============================================================================

export async function getCurrentOddsWithDrivers(raceId: string) {
  // First get all drivers
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true);

  if (driversError) {
    console.error('Error fetching drivers:', driversError);
    return [];
  }

  // Then get odds for this race
  const { data: odds, error: oddsError } = await supabase
    .from('odds')
    .select('*')
    .eq('race_id', raceId)
    .order('created_at', { ascending: false });

  if (oddsError) {
    console.error('Error fetching odds:', oddsError);
    // Continue with empty odds array rather than undefined
  }

  // Build the odds snapshot for each driver
  return drivers.map(driver => {
    const driverOdds: Record<string, number> = {};
    let bestOdds = Number.NEGATIVE_INFINITY;
    let bestBook: string | null = null;

    // Find odds for this driver
    if (odds) {
      const seenBooks = new Set<string>();
      for (let i = 0; i < odds.length; i++) {
        const odd = odds[i];
        if (odd.driver_id === driver.id && !seenBooks.has(odd.sportsbook)) {
          seenBooks.add(odd.sportsbook);
          driverOdds[odd.sportsbook] = odd.odds;
          // For American odds, higher numeric value = better for bettor
          // (both +500 > +200 and -110 > -200 work correctly)
          if (odd.odds > bestOdds) {
            bestOdds = odd.odds;
            bestBook = odd.sportsbook;
          }
        }
      }
    }

    return {
      driverId: driver.id,
      driverName: driver.name,
      driverNumber: driver.number,
      team: driver.team,
      manufacturer: driver.manufacturer,
      odds: driverOdds,
      // Use 0 as sentinel for "no odds available"
      bestOdds: bestOdds === Number.NEGATIVE_INFINITY ? 0 : bestOdds,
      bestBook: (bestBook || 'draftkings') as 'draftkings' | 'fanduel' | 'betmgm' | 'caesars' | 'betrivers' | 'pointsbet',
    };
  });
}

// =============================================================================
// FETCH DRIVER RACE RESULTS
// =============================================================================

export async function getDriverResults(driverId: string): Promise<RaceResult[]> {
  // Fetch all results for this driver (no year filtering)
  // Using a high limit to ensure we get all historical data
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      race:races(
        id,
        name,
        scheduled_date,
        track:tracks(
          id,
          name,
          type
        )
      )
    `)
    .eq('driver_id', driverId)
    .order('race(scheduled_date)', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Error fetching driver results:', error);
    return [];
  }

  if (!data) return [];

  // Transform to RaceResult format
  return data.map((result: any) => ({
    id: result.id,
    driverId: result.driver_id,
    raceId: result.race_id,
    raceName: result.race?.name || 'Unknown Race',
    trackId: result.race?.track?.id || '',
    trackName: result.race?.track?.name || 'Unknown Track',
    trackType: (result.race?.track?.type || 'intermediate') as TrackType,
    date: new Date(result.race?.scheduled_date || Date.now()),
    year: new Date(result.race?.scheduled_date || Date.now()).getFullYear(),
    startPos: result.start_pos,
    finishPos: result.finish_pos,
    lapsLed: result.laps_led || 0,
    lapsCompleted: result.laps_completed || 0,
    driverRating: result.driver_rating || 0,
    status: result.status || 'running',
  }));
}

// =============================================================================
// FETCH AVAILABLE TRACKS
// =============================================================================

export async function getTracks() {
  const { data, error } = await supabase
    .from('tracks')
    .select('id, name, type')
    .order('name');

  if (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }

  return data || [];
}

// =============================================================================
// FETCH AVAILABLE YEARS FROM RESULTS
// =============================================================================

export async function getResultYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from('races')
    .select('scheduled_date')
    .order('scheduled_date', { ascending: false });

  if (error) {
    console.error('Error fetching years:', error);
    return [2025, 2024];
  }

  if (!data) return [2025, 2024];

  const years = new Set<number>();
  for (const race of data) {
    if (race.scheduled_date) {
      years.add(new Date(race.scheduled_date).getFullYear());
    }
  }

  return Array.from(years).sort((a, b) => b - a);
}

// =============================================================================
// CALCULATE AGGREGATED STATS
// =============================================================================

export function calculateAggregatedStats(results: RaceResult[]): AggregatedStats {
  if (results.length === 0) {
    return {
      avgFinish: 0,
      avgStart: 0,
      avgRating: 0,
      avgLapsLed: 0,
      winPct: 0,
      top5Pct: 0,
      top10Pct: 0,
      races: 0,
    };
  }

  const races = results.length;
  const wins = results.filter(r => r.finishPos === 1).length;
  const top5 = results.filter(r => r.finishPos <= 5).length;
  const top10 = results.filter(r => r.finishPos <= 10).length;

  const avgFinish = results.reduce((sum, r) => sum + r.finishPos, 0) / races;
  const avgStart = results.reduce((sum, r) => sum + r.startPos, 0) / races;
  const avgRating = results.reduce((sum, r) => sum + r.driverRating, 0) / races;
  const avgLapsLed = results.reduce((sum, r) => sum + r.lapsLed, 0) / races;

  return {
    avgFinish: Math.round(avgFinish * 10) / 10,
    avgStart: Math.round(avgStart * 10) / 10,
    avgRating: Math.round(avgRating * 10) / 10,
    avgLapsLed: Math.round(avgLapsLed * 10) / 10,
    winPct: Math.round((wins / races) * 1000) / 10,
    top5Pct: Math.round((top5 / races) * 1000) / 10,
    top10Pct: Math.round((top10 / races) * 1000) / 10,
    races,
  };
}

// =============================================================================
// FETCH ALL RESULTS FOR STATS PAGE
// =============================================================================

export async function getAllResults(): Promise<RaceResult[]> {
  // Fetch all results for all drivers
  // Using a high limit to ensure we get all historical data across all drivers
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      race:races(
        id,
        name,
        scheduled_date,
        track:tracks(
          id,
          name,
          type
        )
      )
    `)
    .order('race(scheduled_date)', { ascending: false })
    .limit(10000);

  if (error) {
    console.error('Error fetching all results:', error);
    return [];
  }

  if (!data) return [];

  // Transform to RaceResult format
  return data.map((result: any) => ({
    id: result.id,
    driverId: result.driver_id,
    raceId: result.race_id,
    raceName: result.race?.name || 'Unknown Race',
    trackId: result.race?.track?.id || '',
    trackName: result.race?.track?.name || 'Unknown Track',
    trackType: (result.race?.track?.type || 'intermediate') as TrackType,
    date: new Date(result.race?.scheduled_date || Date.now()),
    year: new Date(result.race?.scheduled_date || Date.now()).getFullYear(),
    startPos: result.start_pos,
    finishPos: result.finish_pos,
    lapsLed: result.laps_led || 0,
    lapsCompleted: result.laps_completed || 0,
    driverRating: result.driver_rating || 0,
    status: result.status || 'running',
  }));
}

// =============================================================================
// GET UPCOMING RACE TRACK INFO
// =============================================================================

export async function getUpcomingRaceTrack(): Promise<{ trackId: string; trackType: TrackType; trackName: string } | null> {
  const { data, error } = await supabase
    .from('races')
    .select(`
      track:tracks(
        id,
        name,
        type
      )
    `)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date')
    .limit(1)
    .single();

  if (error || !data?.track) {
    return { trackId: 'daytona', trackType: 'superspeedway', trackName: 'Daytona International Speedway' };
  }

  // Handle track as potentially an array or single object
  const track = Array.isArray(data.track) ? data.track[0] : data.track;

  if (!track) {
    return { trackId: 'daytona', trackType: 'superspeedway', trackName: 'Daytona International Speedway' };
  }

  return {
    trackId: track.id,
    trackType: track.type as TrackType,
    trackName: track.name,
  };
}