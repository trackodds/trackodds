import { Header, RaceHero, OddsTable } from '@/components';
import { getCurrentOddsWithDrivers } from '@/lib/data';
import { Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const driverOdds = await getCurrentOddsWithDrivers('daytona-500-2026');
  
  const sortedOdds = [...driverOdds].sort((a, b) => {
    if (a.bestOdds === 0 && b.bestOdds === 0) return a.driverName.localeCompare(b.driverName);
    if (a.bestOdds === 0) return 1;
    if (b.bestOdds === 0) return -1;
    return a.bestOdds - b.bestOdds;
  });

  const upcomingRace = {
    id: 'daytona-500-2026',
    name: 'Daytona 500',
    track: {
      id: 'daytona',
      name: 'Daytona International Speedway',
      shortName: 'Daytona',
      location: 'Daytona Beach, FL',
      type: 'superspeedway' as const,
      length: 2.5,
      shape: 'tri-oval' as const,
      surface: 'Asphalt' as const,
    },
    series: 'Cup' as const,
    scheduledDate: new Date('2026-02-15T14:30:00-05:00'),
    scheduledTime: '2:30 PM ET',
    tvNetwork: 'FOX',
    laps: 200,
    distance: 500,
    stage1Laps: 65,
    stage2Laps: 65,
    status: 'scheduled' as const,
  };

  return (
    <div className="min-h-screen bg-void-900">
      <Header />
      <RaceHero race={upcomingRace} />
      
      <main className="relative z-10 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <OddsTable odds={sortedOdds} market="Race Winner" />
        </div>
      </main>

      <footer className="border-t border-void-700/50 bg-void-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-flame-500 to-race-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-cream-200">
                TRACK<span className="text-flame-500">ODDS</span>
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">About</a>
              <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">Contact</a>
              <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">Privacy</a>
              <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">Terms</a>
            </div>
            <div className="text-xs text-cream-500 text-center md:text-right">
              <p>21+ | Gambling Problem? Call 1-800-GAMBLER</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}