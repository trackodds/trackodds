import { Header, RaceHero, OddsTable } from '@/components';
import { getCurrentOddsWithDrivers } from '@/lib/data';
import { Trophy, TrendingUp, Clock, Zap } from 'lucide-react';

// =============================================================================
// HOME PAGE - V2 REDESIGN
// =============================================================================

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch odds from database
  const driverOdds = await getCurrentOddsWithDrivers('daytona-500-2026');
  
  // Sort by best odds (favorites first)
  const sortedOdds = [...driverOdds].sort((a, b) => {
    if (a.bestOdds === 0 && b.bestOdds === 0) return a.driverName.localeCompare(b.driverName);
    if (a.bestOdds === 0) return 1;
    if (b.bestOdds === 0) return -1;
    return a.bestOdds - b.bestOdds;
  });

  // Get top 3 favorites for featured section
  const favorites = sortedOdds.filter(d => d.bestOdds > 0).slice(0, 3);

  // Race data
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
      
      {/* Hero Section */}
      <RaceHero race={upcomingRace} />
      
      {/* Main Content */}
      <main className="relative z-10 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Featured Favorites - Visual highlight */}
          {favorites.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-flame-500" />
                <h2 className="font-display text-lg font-semibold text-cream-100">
                  Current Favorites
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favorites.map((driver, index) => (
                  <FavoriteCard key={driver.driverId} driver={driver} rank={index + 1} />
                ))}
              </div>
            </section>
          )}

          {/* Main Odds Table */}
          <section>
            <OddsTable odds={sortedOdds} market="Race Winner" />
          </section>
          
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// =============================================================================
// FAVORITE CARD - Featured drivers with visual impact
// =============================================================================

function FavoriteCard({ driver, rank }: { driver: any; rank: number }) {
  const formatOdds = (odds: number) => (odds > 0 ? `+${odds}` : odds.toString());
  
  return (
    <div className="card-interactive p-5 group">
      <div className="flex items-start justify-between mb-4">
        {/* Rank badge */}
        <div className="flex items-center gap-2">
          <span className={`
            w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm
            ${rank === 1 ? 'bg-gradient-to-br from-flame-500 to-race-500 text-white' : 
              rank === 2 ? 'bg-void-600 text-cream-200' : 
              'bg-void-700 text-cream-300'}
          `}>
            {rank}
          </span>
          <span className="text-xs text-cream-500 uppercase tracking-wider">
            {rank === 1 ? 'Favorite' : rank === 2 ? '2nd Choice' : '3rd Choice'}
          </span>
        </div>
        
        {/* Driver number */}
        <div className="driver-number-featured text-lg">
          {driver.driverNumber}
        </div>
      </div>

      {/* Driver name */}
      <h3 className="font-display text-xl font-bold text-cream-50 mb-1 group-hover:text-flame-400 transition-colors">
        {driver.driverName}
      </h3>
      <p className="text-sm text-cream-400 mb-4">
        {driver.team}
      </p>

      {/* Best odds */}
      <div className="flex items-end justify-between pt-4 border-t border-void-700/50">
        <div>
          <div className="text-xs text-cream-500 mb-1">Best Available</div>
          <div className="font-mono text-2xl font-bold text-mint-500">
            {formatOdds(driver.bestOdds)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-cream-500 mb-1">Win Probability</div>
          <div className="text-lg font-semibold text-cream-200">
            {(100 / (driver.bestOdds / 100 + 1)).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="border-t border-void-700/50 bg-void-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-flame-500 to-race-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-cream-200">
              TRACK<span className="text-flame-500">ODDS</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">About</a>
            <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">Contact</a>
            <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">Privacy</a>
            <a href="#" className="text-cream-400 hover:text-cream-100 transition-colors">Terms</a>
          </div>

          {/* Responsible gambling */}
          <div className="text-xs text-cream-500 text-center md:text-right">
            <p>21+ | Gambling Problem? Call 1-800-GAMBLER</p>
            <p className="mt-1">Odds for informational purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
