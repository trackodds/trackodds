import { Header, RaceHeader, OddsTable, SharpAlerts } from '@/components';
import { races2025 } from '@/data/nascar';
import { sortedOdds } from '@/data/mock-odds';

// =============================================================================
// HOME PAGE
// =============================================================================

export default function HomePage() {
  // Get the upcoming race (Daytona 500)
  const upcomingRace = races2025[0];

  return (
    <div className="min-h-screen bg-track-900">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Race Header */}
        <RaceHeader race={upcomingRace} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Odds Table - Main content */}
          <div className="xl:col-span-3">
            <OddsTable odds={sortedOdds} market="Race Winner" />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sharp Alerts */}
            <SharpAlerts odds={sortedOdds} />
            
            {/* Quick Stats Card */}
            <QuickStatsCard />
            
            {/* About Card */}
            <AboutCard />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// =============================================================================
// QUICK STATS CARD
// =============================================================================

function QuickStatsCard() {
  return (
    <div className="card p-4 sm:p-5">
      <h3 className="font-display text-sm font-semibold text-track-300 uppercase tracking-wider mb-4">
        Daytona 500 Quick Facts
      </h3>
      <div className="space-y-3">
        <StatRow label="Distance" value="500 miles" />
        <StatRow label="Laps" value="200" />
        <StatRow label="Track Length" value="2.5 miles" />
        <StatRow label="Track Type" value="Superspeedway" />
        <StatRow label="2024 Winner" value="William Byron" />
        <StatRow label="Most Wins (Active)" value="Denny Hamlin (3)" />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-track-400">{label}</span>
      <span className="text-track-100 font-medium">{value}</span>
    </div>
  );
}

// =============================================================================
// ABOUT CARD
// =============================================================================

function AboutCard() {
  return (
    <div className="card p-4 sm:p-5">
      <h3 className="font-display text-sm font-semibold text-track-300 uppercase tracking-wider mb-3">
        About TrackOdds
      </h3>
      <p className="text-sm text-track-400 leading-relaxed">
        TrackOdds compares NASCAR betting odds across all major sportsbooks in real-time. 
        Find the best lines, track sharp money movements, and make informed betting decisions.
      </p>
      <div className="mt-4 pt-4 border-t border-track-600">
        <p className="text-xs text-track-500">
          Odds updated every 15 minutes. Must be 21+ to bet. Please gamble responsibly.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="border-t border-track-600 bg-track-800/50 mt-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-track-300">
              Track<span className="text-accent-green">Odds</span>
            </span>
            <span className="text-xs text-track-500">© 2025</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-track-400">
            <a href="#" className="hover:text-track-200 transition-colors">About</a>
            <a href="#" className="hover:text-track-200 transition-colors">Contact</a>
            <a href="#" className="hover:text-track-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-track-200 transition-colors">Terms</a>
          </div>
          
          <div className="text-xs text-track-500">
            21+ | Gambling Problem? Call 1-800-GAMBLER
          </div>
        </div>
      </div>
    </footer>
  );
}
