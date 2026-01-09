// =============================================================================
// TRACKODDS.IO - CORE TYPE DEFINITIONS
// =============================================================================

// -----------------------------------------------------------------------------
// DRIVERS
// -----------------------------------------------------------------------------

export interface Driver {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  number: string;
  team: string;
  manufacturer: Manufacturer;
  imageUrl?: string;
  isActive: boolean;
}

export type Manufacturer = 'Chevrolet' | 'Ford' | 'Toyota';

// -----------------------------------------------------------------------------
// RACES & TRACKS
// -----------------------------------------------------------------------------

export interface Race {
  id: string;
  name: string;
  track: Track;
  series: Series;
  scheduledDate: Date;
  scheduledTime?: string;
  tvNetwork?: string;
  laps: number;
  distance: number; // miles
  stage1Laps: number;
  stage2Laps: number;
  status: RaceStatus;
}

export interface Track {
  id: string;
  name: string;
  shortName: string;
  location: string;
  type: TrackType;
  length: number; // miles
  shape: TrackShape;
  surface: 'Asphalt' | 'Concrete' | 'Asphalt/Concrete';
}

export type Series = 'Cup' | 'Xfinity' | 'Trucks';
export type RaceStatus = 'scheduled' | 'practice' | 'qualifying' | 'racing' | 'completed' | 'postponed';
export type TrackType = 'superspeedway' | 'intermediate' | 'short' | 'road' | 'dirt';
export type TrackShape = 'oval' | 'tri-oval' | 'road-course' | 'roval' | 'quad-oval';

// -----------------------------------------------------------------------------
// ODDS & BETTING
// -----------------------------------------------------------------------------

export interface Odds {
  id: string;
  driverId: string;
  raceId: string;
  sportsbook: Sportsbook;
  market: Market;
  odds: number; // American odds format (+450, -110, etc.)
  impliedProbability: number;
  timestamp: Date;
}

export interface OddsSnapshot {
  driverId: string;
  driverName: string;
  driverNumber: string;
  team: string;
  odds: {
    [key in Sportsbook]?: number;
  };
  bestOdds: number;
  bestBook: Sportsbook;
  movement24h?: OddsMovement;
}

export interface OddsMovement {
  open: number;
  current: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
  percentChange: number;
}

export interface OddsHistory {
  driverId: string;
  raceId: string;
  sportsbook: Sportsbook;
  history: Array<{
    odds: number;
    timestamp: Date;
  }>;
}

export type Sportsbook = 
  | 'draftkings' 
  | 'fanduel' 
  | 'betmgm' 
  | 'caesars' 
  | 'betrivers'
  | 'pointsbet';

export type Market = 
  | 'race_winner'
  | 'top_3'
  | 'top_5'
  | 'top_10'
  | 'stage_1_winner'
  | 'stage_2_winner'
  | 'head_to_head'
  | 'manufacturer_winner';

// -----------------------------------------------------------------------------
// DFS (Daily Fantasy Sports)
// -----------------------------------------------------------------------------

export interface DFSPlayer {
  driverId: string;
  driver: Driver;
  raceId: string;
  platform: DFSPlatform;
  salary: number;
  projectedPoints?: number;
  ownership?: number;
  value?: number; // points per $1000
}

export interface DFSLineup {
  id: string;
  platform: DFSPlatform;
  raceId: string;
  drivers: DFSPlayer[];
  totalSalary: number;
  projectedPoints: number;
  projectedOwnership: number;
}

export type DFSPlatform = 'draftkings' | 'fanduel';

// -----------------------------------------------------------------------------
// STATISTICS
// -----------------------------------------------------------------------------

export interface DriverStats {
  driverId: string;
  trackId?: string;
  trackType?: TrackType;
  races: number;
  wins: number;
  top5: number;
  top10: number;
  avgFinish: number;
  avgStart: number;
  lapsLed: number;
  driverRating: number;
  lapsCompleted: number;
  dnfs: number;
}

// Track-type specific performance stats
export interface TrackTypeStats {
  trackType: TrackType;
  races: number;
  avgFinish: number;
  avgStart: number;
  top5: number;
  top10: number;
  wins: number;
  lapsLed: number;
  driverRating: number;
  dnfRate: number; // percentage
}

// Driver profile with comprehensive stats
export interface DriverProfile extends Driver {
  currentOdds: number;
  currentRank: number;
  startingPosition?: number;
  stats: {
    overall: DriverStats;
    byTrackType: TrackTypeStats[];
    atCurrentTrack?: DriverStats;
  };
  recentForm: {
    lastRace: { finish: number; laps: number; track: string };
    last5Avg: number;
  };
  practiceResults?: PracticeResult[];
  qualifyingResult?: QualifyingResult;
}

export interface PracticeResult {
  driverId: string;
  raceId: string;
  session: 'practice_1' | 'practice_2' | 'final_practice';
  bestLapTime: number;
  bestLapSpeed: number;
  totalLaps: number;
  rank: number;
}

export interface QualifyingResult {
  driverId: string;
  raceId: string;
  position: number;
  lapTime: number;
  lapSpeed: number;
}

// -----------------------------------------------------------------------------
// UI STATE
// -----------------------------------------------------------------------------

export interface FilterState {
  sportsbooks: Sportsbook[];
  market: Market;
  sortBy: 'odds' | 'name' | 'number' | 'movement';
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
}

export interface AppState {
  selectedRace: Race | null;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}

// -----------------------------------------------------------------------------
// API RESPONSES
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface OddsApiResponse extends ApiResponse<OddsSnapshot[]> {
  race: Race;
  lastUpdated: Date;
}
