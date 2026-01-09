import { Header } from '@/components';
import { getDrivers, getAllResults, getTracks, getResultYears, getUpcomingRaceTrack } from '@/lib/data';
import { StatsGrid } from './StatsGrid';

// =============================================================================
// DRIVER STATS PAGE - Research Hub
// =============================================================================

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  // Fetch all data in parallel
  const [drivers, results, tracks, years, upcomingTrack] = await Promise.all([
    getDrivers(),
    getAllResults(),
    getTracks(),
    getResultYears(),
    getUpcomingRaceTrack(),
  ]);

  return (
    <div className="min-h-screen bg-void-900">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-20 pb-6 border-b border-void-700/50">
        <div className="absolute inset-0 bg-gradient-to-b from-flame-500/5 to-transparent" />
        <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-cream-50">
            Driver Stats & Analysis
          </h1>
          <p className="text-cream-400 mt-1">
            Research driver performance across all track types and seasons
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        <StatsGrid
          drivers={drivers}
          results={results}
          tracks={tracks}
          years={years}
          defaultTrackType={upcomingTrack?.trackType || 'superspeedway'}
          defaultTrackId={upcomingTrack?.trackId || 'daytona'}
          defaultTrackName={upcomingTrack?.trackName || 'Daytona International Speedway'}
        />
      </main>
    </div>
  );
}
