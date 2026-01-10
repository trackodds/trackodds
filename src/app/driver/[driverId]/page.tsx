import { notFound } from 'next/navigation';
import { Header } from '@/components';
import { getDriverResults, getTracks, getResultYears } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { DriverDashboard } from './DriverDashboard';

// =============================================================================
// DRIVER ANALYTICS PAGE - High-octane dashboard
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

      {/* Main Content - Full width dashboard */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pt-20">
        <DriverDashboard
          driver={{
            id: driver.id,
            name: driver.name,
            number: driver.number,
            team: driver.team,
            manufacturer: driver.manufacturer,
          }}
          results={results}
          tracks={tracks}
          years={years}
        />
      </main>
    </div>
  );
}
