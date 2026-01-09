// =============================================================================
// TRACKODDS.IO - UTILITY FUNCTIONS
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// -----------------------------------------------------------------------------
// TAILWIND UTILITY
// -----------------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------------------------------
// ODDS FORMATTING
// -----------------------------------------------------------------------------

/**
 * Format American odds with + or - prefix
 * @param odds - American odds number
 * @returns Formatted string like "+450" or "-110"
 */
export function formatOdds(odds: number): string {
  if (odds > 0) {
    return `+${odds}`;
  }
  return odds.toString();
}

/**
 * Convert American odds to implied probability
 * @param odds - American odds number
 * @returns Probability as decimal (0-1)
 */
export function oddsToImpliedProbability(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

/**
 * Format implied probability as percentage
 * @param odds - American odds number
 * @returns Formatted string like "18.2%"
 */
export function formatImpliedProbability(odds: number): string {
  const prob = oddsToImpliedProbability(odds);
  return `${(prob * 100).toFixed(1)}%`;
}

/**
 * Calculate potential payout for a given bet
 * @param odds - American odds
 * @param stake - Bet amount
 * @returns Potential profit (not including stake)
 */
export function calculatePayout(odds: number, stake: number): number {
  if (odds > 0) {
    return (odds / 100) * stake;
  } else {
    return (100 / Math.abs(odds)) * stake;
  }
}

/**
 * Format payout as currency
 * @param amount - Dollar amount
 * @returns Formatted string like "$450.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// -----------------------------------------------------------------------------
// ODDS COMPARISON
// -----------------------------------------------------------------------------

/**
 * Find the best odds from a set of odds across books
 * @param odds - Object with sportsbook keys and odds values
 * @returns Best odds value, or NaN if no valid odds exist
 */
export function findBestOdds(odds: Record<string, number | undefined>): number {
  const validOdds = Object.values(odds).filter((o): o is number => o !== undefined);

  // Return NaN if no valid odds exist to prevent -Infinity
  if (validOdds.length === 0) {
    return NaN;
  }

  return Math.max(...validOdds);
}

/**
 * Check if odds are the best available
 * @param odds - Odds to check
 * @param bestOdds - Best available odds
 * @returns Boolean
 */
export function isBestOdds(odds: number, bestOdds: number): boolean {
  return odds === bestOdds;
}

/**
 * Calculate edge percentage vs implied probability
 * @param yourOdds - The odds you're getting
 * @param trueProb - True probability estimate (0-1)
 * @returns Edge as percentage
 */
export function calculateEdge(yourOdds: number, trueProb: number): number {
  const impliedProb = oddsToImpliedProbability(yourOdds);
  return ((trueProb - impliedProb) / impliedProb) * 100;
}

// -----------------------------------------------------------------------------
// DATE/TIME FORMATTING
// -----------------------------------------------------------------------------

/**
 * Format race date
 * @param date - Date object
 * @returns Formatted string like "Sunday, Feb 16"
 */
export function formatRaceDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format race time
 * @param date - Date object
 * @returns Formatted string like "2:30 PM ET"
 */
export function formatRaceTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

/**
 * Get countdown to race
 * @param raceDate - Race start date
 * @returns Object with days, hours, minutes
 */
export function getCountdown(raceDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  isLive: boolean;
  isPast: boolean;
} {
  const now = new Date();
  const diff = raceDate.getTime() - now.getTime();
  
  if (diff < 0) {
    // Race has started or passed
    const hoursSinceStart = Math.abs(diff) / (1000 * 60 * 60);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isLive: hoursSinceStart < 4, // Assume race is ~4 hours
      isPast: hoursSinceStart >= 4,
    };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isLive: false, isPast: false };
}

// -----------------------------------------------------------------------------
// MOVEMENT FORMATTING
// -----------------------------------------------------------------------------

/**
 * Format odds movement with arrow
 * @param change - Change in odds
 * @returns Formatted string with arrow
 */
export function formatMovement(change: number): string {
  if (change === 0) return '—';
  const arrow = change > 0 ? '↑' : '↓';
  const absChange = Math.abs(change);
  return `${arrow} ${absChange}`;
}

/**
 * Get color class for movement
 * @param direction - Movement direction
 * @returns Tailwind color class
 */
export function getMovementColor(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up':
      return 'text-accent-red'; // Odds going up = worse for bettor
    case 'down':
      return 'text-accent-green'; // Odds going down = better value
    default:
      return 'text-track-400';
  }
}

// -----------------------------------------------------------------------------
// DRIVER FORMATTING
// -----------------------------------------------------------------------------

/**
 * Get manufacturer logo/color
 * @param manufacturer - Manufacturer name
 * @returns Object with color info
 */
export function getManufacturerInfo(manufacturer: string): {
  color: string;
  bgColor: string;
} {
  switch (manufacturer) {
    case 'Chevrolet':
      return { color: '#cfb53b', bgColor: 'bg-yellow-500/10' };
    case 'Ford':
      return { color: '#003478', bgColor: 'bg-blue-500/10' };
    case 'Toyota':
      return { color: '#eb0a1e', bgColor: 'bg-red-500/10' };
    default:
      return { color: '#666', bgColor: 'bg-gray-500/10' };
  }
}

/**
 * Get abbreviated team name
 * @param team - Full team name
 * @returns Abbreviated name
 */
export function abbreviateTeam(team: string): string {
  const abbreviations: Record<string, string> = {
    'Hendrick Motorsports': 'HMS',
    'Joe Gibbs Racing': 'JGR',
    'Team Penske': 'Penske',
    'Stewart-Haas Racing': 'SHR',
    'Trackhouse Racing': 'Trackhouse',
    '23XI Racing': '23XI',
    'Richard Childress Racing': 'RCR',
    'RFK Racing': 'RFK',
    'Spire Motorsports': 'Spire',
    'Legacy Motor Club': 'Legacy',
    'Front Row Motorsports': 'FRM',
    'Kaulig Racing': 'Kaulig',
    'JTG Daugherty Racing': 'JTG',
    'Wood Brothers Racing': 'Wood Bros',
    'Rick Ware Racing': 'RWR',
  };
  
  return abbreviations[team] || team;
}
