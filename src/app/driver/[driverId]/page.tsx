import { notFound } from 'next/navigation';
import { Header } from '@/components';
import { getDriverResults, getTracks, getResultYears, calculateAggregatedStats } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { DriverStatsContent } from './DriverStatsContent';

// =============================================================================
// DRIVER STATS PAGE
// =============================================================================

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ driverId: string }>;
}

export default async function DriverPage({ params }: PageProps) {
  const { driverId } = await params;

  // Fetch driver info
  const { data: driver, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single();

  if (error || !driver) {
    notFound();
  }

  // Fetch all data in parallel
  // Pass driver name to getDriverResults for fallback matching if ID doesn't match
  const [results, tracks, years] = await Promise.all([
    getDriverResults(driverId, driver.name),
    getTracks(),
    getResultYears(),
  ]);

  return (
    <div className="min-h-screen bg-void-900">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-20 pb-8 border-b border-void-700/50">
        <div className="absolute inset-0 bg-gradient-to-b from-flame-500/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            {/* Driver Number */}
            <div className="driver-number-featured text-3xl w-20 h-20">
              {driver.number}
            </div>

            {/* Driver Info */}
            <div>
              <h1 className="font-display text-4xl font-bold text-cream-50">
                {driver.name}
              </h1>
              <p className="text-lg text-cream-400 mt-1">
                {driver.team} • {driver.manufacturer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <DriverStatsContent
          driverId={driverId}
          results={results}
          tracks={tracks}
          years={years}
        />
      </main>
    </div>
  );
}
