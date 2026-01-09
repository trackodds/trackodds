import { supabase } from './supabase';
import { TrackType, TrackTypeStats, DriverProfile, DriverStats } from '@/types';

// =============================================================================
// FETCH DRIVER RACE RESULTS
// =============================================================================

/**
 * Fetch all race results for a driver
 * Assumes table: race_results or results
 * Fields: driver_id, race_id, start_position, finish_position,
 *         avg_running_position, fast_laps, laps_led, driver_rating, laps_completed
 */
export async function getDriverRaceResults(driverId: string) {
  const { data, error } = await supabase
    .from('race_results') // Update this table name if different
    .select(`
      *,
      race:races(
        id,
        name,
        scheduled_date,
        track:tracks(
          id,
          name,
          type,
          length
        )
      )
    `)
    .eq('driver_id', driverId)
    .gte('race.scheduled_date', '2023-01-01') // Last 3 seasons
    .order('race.scheduled_date', { ascending: false });

  if (error) {
    console.error('Error fetching driver race results:', error);
    return [];
  }

  return data;
}

// =============================================================================
// COMPUTE TRACK-TYPE STATS
// =============================================================================

/**
 * Calculate aggregated stats by track type from race results
 */
export function computeTrackTypeStats(
  raceResults: any[],
  trackType: TrackType
): TrackTypeStats {
  // Filter results by track type
  const filteredResults = raceResults.filter(
    (result) => result.race?.track?.type === trackType
  );

  if (filteredResults.length === 0) {
    return {
      trackType,
      races: 0,
      avgFinish: 0,
      avgStart: 0,
      top5: 0,
      top10: 0,
      wins: 0,
      lapsLed: 0,
      driverRating: 0,
      dnfRate: 0,
    };
  }

  const totalRaces = filteredResults.length;
  const totalFinish = filteredResults.reduce((sum, r) => sum + (r.finish_position || 0), 0);
  const totalStart = filteredResults.reduce((sum, r) => sum + (r.start_position || 0), 0);
  const totalLapsLed = filteredResults.reduce((sum, r) => sum + (r.laps_led || 0), 0);
  const totalRating = filteredResults.reduce((sum, r) => sum + (r.driver_rating || 0), 0);

  const top5 = filteredResults.filter((r) => r.finish_position <= 5).length;
  const top10 = filteredResults.filter((r) => r.finish_position <= 10).length;
  const wins = filteredResults.filter((r) => r.finish_position === 1).length;
  const dnfs = filteredResults.filter((r) => r.finish_position > 35 || r.status === 'DNF').length;

  return {
    trackType,
    races: totalRaces,
    avgFinish: totalRaces > 0 ? totalFinish / totalRaces : 0,
    avgStart: totalRaces > 0 ? totalStart / totalRaces : 0,
    top5,
    top10,
    wins,
    lapsLed: totalLapsLed,
    driverRating: totalRaces > 0 ? totalRating / totalRaces : 0,
    dnfRate: totalRaces > 0 ? (dnfs / totalRaces) * 100 : 0,
  };
}

// =============================================================================
// COMPUTE OVERALL STATS
// =============================================================================

/**
 * Calculate overall career stats from race results
 */
export function computeOverallStats(raceResults: any[], driverId: string): DriverStats {
  if (raceResults.length === 0) {
    return {
      driverId,
      races: 0,
      wins: 0,
      top5: 0,
      top10: 0,
      avgFinish: 0,
      avgStart: 0,
      lapsLed: 0,
      driverRating: 0,
      lapsCompleted: 0,
      dnfs: 0,
    };
  }

  const totalRaces = raceResults.length;
  const totalFinish = raceResults.reduce((sum, r) => sum + (r.finish_position || 0), 0);
  const totalStart = raceResults.reduce((sum, r) => sum + (r.start_position || 0), 0);
  const totalLapsLed = raceResults.reduce((sum, r) => sum + (r.laps_led || 0), 0);
  const totalRating = raceResults.reduce((sum, r) => sum + (r.driver_rating || 0), 0);
  const totalLapsCompleted = raceResults.reduce((sum, r) => sum + (r.laps_completed || 0), 0);

  return {
    driverId,
    races: totalRaces,
    wins: raceResults.filter((r) => r.finish_position === 1).length,
    top5: raceResults.filter((r) => r.finish_position <= 5).length,
    top10: raceResults.filter((r) => r.finish_position <= 10).length,
    avgFinish: totalFinish / totalRaces,
    avgStart: totalStart / totalRaces,
    lapsLed: totalLapsLed,
    driverRating: totalRating / totalRaces,
    lapsCompleted: totalLapsCompleted,
    dnfs: raceResults.filter((r) => r.finish_position > 35 || r.status === 'DNF').length,
  };
}

// =============================================================================
// COMPUTE AT-TRACK STATS
// =============================================================================

/**
 * Calculate stats at a specific track
 */
export function computeAtTrackStats(
  raceResults: any[],
  trackId: string,
  driverId: string
): DriverStats | undefined {
  const trackResults = raceResults.filter((r) => r.race?.track?.id === trackId);

  if (trackResults.length === 0) {
    return undefined;
  }

  return computeOverallStats(trackResults, driverId);
}

// =============================================================================
// GET DRIVER PROFILE
// =============================================================================

/**
 * Fetch complete driver profile with computed stats
 */
export async function getDriverProfile(
  driverSlug: string,
  currentRaceId: string = 'daytona-500-2026'
): Promise<DriverProfile | null> {
  // Get driver by slug (convert slug back to name for lookup)
  const driverName = driverSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const { data: driver, error: driverError } = await supabase
    .from('drivers')
    .select('*')
    .ilike('name', driverName)
    .single();

  if (driverError || !driver) {
    console.error('Error fetching driver:', driverError);
    return null;
  }

  // Get driver's current odds for the race
  const { data: oddsData } = await supabase
    .from('odds')
    .select('odds, sportsbook')
    .eq('driver_id', driver.id)
    .eq('race_id', currentRaceId)
    .order('created_at', { ascending: false })
    .limit(1);

  const currentOdds = oddsData?.[0]?.odds || 0;

  // Get race results
  const raceResults = await getDriverRaceResults(driver.id);

  // Compute overall stats
  const overallStats = computeOverallStats(raceResults, driver.id);

  // Compute stats by track type
  const trackTypes: TrackType[] = ['superspeedway', 'intermediate', 'short', 'road'];
  const byTrackType = trackTypes.map((type) => computeTrackTypeStats(raceResults, type));

  // Get current track (Daytona)
  const atCurrentTrack = computeAtTrackStats(raceResults, 'daytona', driver.id);

  // Get recent form (last 5 races)
  const recentRaces = raceResults.slice(0, 5);
  const lastRace = raceResults[0];
  const last5Avg =
    recentRaces.length > 0
      ? recentRaces.reduce((sum, r) => sum + (r.finish_position || 0), 0) / recentRaces.length
      : 0;

  // Get current rank (would need to compute from all drivers' odds)
  const currentRank = 0; // TODO: Compute from odds comparison

  return {
    id: driver.id,
    name: driver.name,
    firstName: driver.name.split(' ')[0],
    lastName: driver.name.split(' ').slice(1).join(' '),
    number: driver.number,
    team: driver.team,
    manufacturer: driver.manufacturer,
    isActive: driver.is_active,
    currentOdds,
    currentRank,
    startingPosition: undefined, // TODO: Get from qualifying results
    stats: {
      overall: overallStats,
      byTrackType,
      atCurrentTrack,
    },
    recentForm: {
      lastRace: {
        finish: lastRace?.finish_position || 0,
        laps: lastRace?.laps_completed || 0,
        track: lastRace?.race?.track?.name || '',
      },
      last5Avg,
    },
    practiceResults: [], // TODO: Add practice results
    qualifyingResult: undefined, // TODO: Add qualifying result
  };
}
