import { DriverProfile, TrackType } from '@/types';

// =============================================================================
// MOCK DRIVER PROFILES - Phase Two UI Development
// =============================================================================

// Helper to generate track-type stats
function generateTrackTypeStats(trackType: TrackType, baseline: number): any {
  const variance = {
    superspeedway: { finish: 0, rating: 95 },
    intermediate: { finish: baseline - 14, rating: 88 },
    short: { finish: baseline - 16, rating: 82 },
    road: { finish: baseline - 18, rating: 79 },
    dirt: { finish: baseline - 20, rating: 75 },
  };

  const adjustment = variance[trackType];

  return {
    trackType,
    races: Math.floor(Math.random() * 15) + 10,
    avgFinish: baseline + adjustment.finish + (Math.random() * 4 - 2),
    avgStart: baseline + (Math.random() * 6 - 3),
    top5: Math.floor(Math.random() * 8) + 2,
    top10: Math.floor(Math.random() * 12) + 5,
    wins: Math.floor(Math.random() * 3),
    lapsLed: Math.floor(Math.random() * 400) + 50,
    driverRating: adjustment.rating + (Math.random() * 10 - 5),
    dnfRate: Math.random() * 12 + 3,
  };
}

export const mockDriverProfiles: Record<string, DriverProfile> = {
  'ryan-blaney': {
    id: 'ryan-blaney',
    name: 'Ryan Blaney',
    firstName: 'Ryan',
    lastName: 'Blaney',
    number: '12',
    team: 'Team Penske',
    manufacturer: 'Ford',
    isActive: true,
    currentOdds: 1200,
    currentRank: 5,
    startingPosition: 8,
    stats: {
      overall: {
        driverId: 'ryan-blaney',
        races: 108,
        wins: 11,
        top5: 38,
        top10: 62,
        avgFinish: 14.2,
        avgStart: 13.8,
        lapsLed: 2847,
        driverRating: 87.6,
        lapsCompleted: 35892,
        dnfs: 12,
      },
      byTrackType: [
        generateTrackTypeStats('superspeedway', 11.5),
        generateTrackTypeStats('intermediate', 14.2),
        generateTrackTypeStats('short', 16.8),
        generateTrackTypeStats('road', 18.3),
      ],
      atCurrentTrack: {
        driverId: 'ryan-blaney',
        trackId: 'daytona',
        races: 15,
        wins: 1,
        top5: 5,
        top10: 9,
        avgFinish: 12.7,
        avgStart: 14.2,
        lapsLed: 287,
        driverRating: 92.3,
        lapsCompleted: 2876,
        dnfs: 2,
      },
    },
    recentForm: {
      lastRace: { finish: 8, laps: 267, track: 'Phoenix' },
      last5Avg: 11.4,
    },
    practiceResults: [
      {
        driverId: 'ryan-blaney',
        raceId: 'daytona-500-2026',
        session: 'practice_1',
        bestLapTime: 48.234,
        bestLapSpeed: 186.523,
        totalLaps: 28,
        rank: 6,
      },
    ],
    qualifyingResult: {
      driverId: 'ryan-blaney',
      raceId: 'daytona-500-2026',
      position: 8,
      lapTime: 47.892,
      lapSpeed: 187.845,
    },
  },

  'kyle-larson': {
    id: 'kyle-larson',
    name: 'Kyle Larson',
    firstName: 'Kyle',
    lastName: 'Larson',
    number: '5',
    team: 'Hendrick Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
    currentOdds: 800,
    currentRank: 2,
    startingPosition: 3,
    stats: {
      overall: {
        driverId: 'kyle-larson',
        races: 112,
        wins: 18,
        top5: 52,
        top10: 71,
        avgFinish: 11.8,
        avgStart: 10.2,
        lapsLed: 4234,
        driverRating: 94.2,
        lapsCompleted: 37234,
        dnfs: 9,
      },
      byTrackType: [
        generateTrackTypeStats('superspeedway', 16.2),
        generateTrackTypeStats('intermediate', 9.8),
        generateTrackTypeStats('short', 8.4),
        generateTrackTypeStats('road', 10.6),
      ],
      atCurrentTrack: {
        driverId: 'kyle-larson',
        trackId: 'daytona',
        races: 16,
        wins: 0,
        top5: 3,
        top10: 7,
        avgFinish: 16.9,
        avgStart: 11.4,
        lapsLed: 145,
        driverRating: 82.6,
        lapsCompleted: 2734,
        dnfs: 3,
      },
    },
    recentForm: {
      lastRace: { finish: 2, laps: 312, track: 'Phoenix' },
      last5Avg: 6.8,
    },
    practiceResults: [
      {
        driverId: 'kyle-larson',
        raceId: 'daytona-500-2026',
        session: 'practice_1',
        bestLapTime: 47.892,
        bestLapSpeed: 187.845,
        totalLaps: 32,
        rank: 3,
      },
    ],
    qualifyingResult: {
      driverId: 'kyle-larson',
      raceId: 'daytona-500-2026',
      position: 3,
      lapTime: 47.634,
      lapSpeed: 188.856,
    },
  },

  'denny-hamlin': {
    id: 'denny-hamlin',
    name: 'Denny Hamlin',
    firstName: 'Denny',
    lastName: 'Hamlin',
    number: '11',
    team: 'Joe Gibbs Racing',
    manufacturer: 'Toyota',
    isActive: true,
    currentOdds: 900,
    currentRank: 3,
    startingPosition: 2,
    stats: {
      overall: {
        driverId: 'denny-hamlin',
        races: 124,
        wins: 15,
        top5: 48,
        top10: 68,
        avgFinish: 12.4,
        avgStart: 11.6,
        lapsLed: 3892,
        driverRating: 91.8,
        lapsCompleted: 39234,
        dnfs: 11,
      },
      byTrackType: [
        generateTrackTypeStats('superspeedway', 8.7),
        generateTrackTypeStats('intermediate', 11.2),
        generateTrackTypeStats('short', 14.6),
        generateTrackTypeStats('road', 15.9),
      ],
      atCurrentTrack: {
        driverId: 'denny-hamlin',
        trackId: 'daytona',
        races: 18,
        wins: 3,
        top5: 9,
        top10: 13,
        avgFinish: 8.9,
        avgStart: 9.2,
        lapsLed: 487,
        driverRating: 96.4,
        lapsCompleted: 3456,
        dnfs: 1,
      },
    },
    recentForm: {
      lastRace: { finish: 12, laps: 312, track: 'Phoenix' },
      last5Avg: 9.2,
    },
    practiceResults: [
      {
        driverId: 'denny-hamlin',
        raceId: 'daytona-500-2026',
        session: 'practice_1',
        bestLapTime: 47.523,
        bestLapSpeed: 189.234,
        totalLaps: 35,
        rank: 1,
      },
    ],
    qualifyingResult: {
      driverId: 'denny-hamlin',
      raceId: 'daytona-500-2026',
      position: 2,
      lapTime: 47.456,
      lapSpeed: 189.567,
    },
  },
};

// Helper function to get driver profile by slug
export function getDriverProfileBySlug(slug: string): DriverProfile | null {
  return mockDriverProfiles[slug] || null;
}

// Helper to get track type label
export function getTrackTypeLabel(trackType: TrackType): string {
  const labels: Record<TrackType, string> = {
    superspeedway: 'Superspeedways',
    intermediate: 'Intermediates',
    short: 'Short Tracks',
    road: 'Road Courses',
    dirt: 'Dirt Tracks',
  };
  return labels[trackType];
}
