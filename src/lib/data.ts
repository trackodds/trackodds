import { supabase } from './supabase';

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