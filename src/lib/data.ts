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

export async function getDriverResults(driverId: string, driverName?: string): Promise<RaceResult[]> {
  // Fetch all results for this driver (no year filtering)
  // Using a high limit to ensure we get all historical data
  // Using explicit foreign key notation to ensure proper joins
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      race:races!race_id(
        id,
        name,
        scheduled_date,
        track_id,
        track:tracks!track_id(
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

  // If no results by ID and we have a driver name, try matching by name
  // This handles cases where driver_id is inconsistent in the results table
  if ((!data || data.length === 0) && driverName) {
    // Normalize name for fuzzy matching (remove periods, handle Jr/Sr variations)
    const normalizedName = driverName.replace(/\./g, '').toLowerCase();

    const { data: nameData, error: nameError } = await supabase
      .from('results')
      .select(`
        *,
        driver:drivers!driver_id(name),
        race:races!race_id(
          id,
          name,
          scheduled_date,
          track_id,
          track:tracks!track_id(
            id,
            name,
            type
          )
        )
      `)
      .order('race(scheduled_date)', { ascending: false })
      .limit(500);

    if (!nameError && nameData) {
      // Filter by fuzzy name match
      const matchedResults = nameData.filter((r: any) => {
        const resultDriverName = r.driver?.name?.replace(/\./g, '').toLowerCase() || '';
        return resultDriverName.includes(normalizedName) || normalizedName.includes(resultDriverName);
      });

      if (matchedResults.length > 0) {
        return transformResults(matchedResults);
      }
    }
  }

  if (!data) return [];

  return transformResults(data);
}

// Known track classifications by name (fallback when type field is missing/wrong)
// Includes common aliases and alternate names
const TRACK_TYPE_BY_NAME: Record<string, TrackType> = {
  // Superspeedways
  'daytona': 'superspeedway',
  'talladega': 'superspeedway',
  // Short tracks (< 1 mile)
  'bristol': 'short',
  'martinsville': 'short',
  'richmond': 'short',
  'north wilkesboro': 'short',
  'new hampshire': 'short',
  'loudon': 'short', // New Hampshire alias
  'nhms': 'short', // New Hampshire abbreviation
  'phoenix': 'short',
  'ism raceway': 'short', // Old Phoenix name
  'pir': 'short', // Phoenix abbreviation
  'iowa': 'short',
  'dover': 'short', // Dover is 1 mile, often classified as short
  'monster mile': 'short', // Dover nickname
  // Road courses
  'sonoma': 'road',
  'sears point': 'road', // Old Sonoma name
  'watkins glen': 'road',
  'the glen': 'road', // Watkins Glen nickname
  'road america': 'road',
  'elkhart': 'road', // Road America location
  'cota': 'road',
  'circuit of the americas': 'road',
  'austin': 'road', // COTA location
  'chicago street': 'road',
  'grant park': 'road', // Chicago street course
  'indianapolis road': 'road',
  'indy road': 'road',
  'portland': 'road',
  // Intermediates (explicit)
  'atlanta': 'intermediate',
  'charlotte': 'intermediate',
  'coca-cola': 'intermediate', // Charlotte race name
  'las vegas': 'intermediate',
  'lvms': 'intermediate',
  'texas': 'intermediate',
  'tms': 'intermediate',
  'kansas': 'intermediate',
  'michigan': 'intermediate',
  'homestead': 'intermediate',
  'homestead-miami': 'intermediate',
  'darlington': 'intermediate',
  'nashville': 'intermediate',
  'nashville superspeedway': 'intermediate',
  'pocono': 'intermediate',
  'gateway': 'intermediate',
  'world wide technology': 'intermediate', // Gateway full name
  'wwtr': 'intermediate', // Gateway abbreviation
  'auto club': 'intermediate', // Fontana
  'fontana': 'intermediate',
  'california': 'intermediate',
  'indianapolis motor': 'intermediate', // Indy oval
  'brickyard': 'intermediate', // Indy nickname
};

// Helper to normalize track type from database values to TrackType
function normalizeTrackType(dbType: string | null | undefined, trackName?: string): TrackType {
  // First try to match by type field
  if (dbType) {
    const normalized = dbType.toLowerCase().trim();

    if (normalized.includes('superspeedway') || normalized.includes('super speedway')) {
      return 'superspeedway';
    }
    if (normalized.includes('intermediate')) {
      return 'intermediate';
    }
    if (normalized.includes('short') || normalized === 'short track') {
      return 'short';
    }
    if (normalized.includes('road') || normalized.includes('street')) {
      return 'road';
    }
    if (normalized.includes('dirt')) {
      return 'dirt';
    }
    // Type field exists but didn't match any pattern - fall through to name check
  }

  // Fallback: try to determine type from track name (always check, not just when dbType is empty)
  if (trackName) {
    const normalizedName = trackName.toLowerCase();
    for (const [key, type] of Object.entries(TRACK_TYPE_BY_NAME)) {
      if (normalizedName.includes(key)) {
        return type;
      }
    }
  }

  // Default fallback
  return 'intermediate';
}

// Helper to transform Supabase results to RaceResult format
function transformResults(data: any[]): RaceResult[] {
  return data.map((result: any) => {
    // Handle Supabase nested relations - may come back as array or object
    const race = Array.isArray(result.race) ? result.race[0] : result.race;
    const track = race?.track ? (Array.isArray(race.track) ? race.track[0] : race.track) : null;

    const trackName = track?.name || 'Unknown Track';
    const trackType = track?.type || null;

    return {
      id: result.id,
      driverId: result.driver_id,
      raceId: result.race_id,
      raceName: race?.name || 'Unknown Race',
      trackId: track?.id || '',
      trackName,
      trackType: normalizeTrackType(trackType, trackName),
      date: new Date(race?.scheduled_date || Date.now()),
      year: new Date(race?.scheduled_date || Date.now()).getFullYear(),
      startPos: result.start_pos,
      finishPos: result.finish_pos,
      lapsLed: result.laps_led || 0,
      lapsCompleted: result.laps_completed || 0,
      driverRating: result.driver_rating || 0,
      status: result.status || 'running',
    };
  });
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

  // Normalize track types to match our TrackType values (using name as fallback)
  return (data || []).map(track => ({
    ...track,
    type: normalizeTrackType(track.type, track.name),
  }));
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
  // Using explicit foreign key notation to ensure proper joins
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      race:races!race_id(
        id,
        name,
        scheduled_date,
        track_id,
        track:tracks!track_id(
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

  return transformResults(data);
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