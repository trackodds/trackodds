import { Header } from '@/components';
import { getDriverProfileBySlug, getTrackTypeLabel } from '@/data/mock-driver-profiles';
import { formatOdds } from '@/lib/utils';
import { ArrowLeft, TrendingUp, Award, Target, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// =============================================================================
// DRIVER DETAIL PAGE - Context-Aware Performance Analysis
// =============================================================================

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

export default function DriverPage({ params }: PageProps) {
  const driver = getDriverProfileBySlug(params.slug);

  if (!driver) {
    notFound();
  }

  // Context: Daytona 500 = Superspeedway
  const currentTrackType = 'superspeedway';
  const trackTypeStats = driver.stats.byTrackType.find(
    (s) => s.trackType === currentTrackType
  );

  return (
    <div className="min-h-screen bg-void-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cream-400 hover:text-cream-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to odds
        </Link>

        {/* Driver Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Driver Number */}
              <div className="driver-number-featured text-3xl w-16 h-16 flex items-center justify-center">
                {driver.number}
              </div>

              {/* Driver Info */}
              <div>
                <h1 className="font-display text-display-lg text-cream-50 mb-1">
                  {driver.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-cream-400">
                  <span>{driver.team}</span>
                  <span>•</span>
                  <span>{driver.manufacturer}</span>
                  <span>•</span>
                  <span>#{driver.number}</span>
                </div>
              </div>
            </div>

            {/* Current Odds */}
            <div className="text-right">
              <div className="text-xs text-cream-500 mb-1">Current Odds</div>
              <div className="font-mono text-3xl font-bold text-mint-500">
                {formatOdds(driver.currentOdds)}
              </div>
              <div className="text-xs text-cream-500 mt-1">
                Rank #{driver.currentRank}
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-void-700/50">
            <StatBox
              label="Starting Position"
              value={driver.startingPosition ? `P${driver.startingPosition}` : 'TBD'}
              icon={<Target className="w-4 h-4" />}
            />
            <StatBox
              label="Last Race"
              value={`P${driver.recentForm.lastRace.finish}`}
              icon={<Award className="w-4 h-4" />}
              sublabel={driver.recentForm.lastRace.track}
            />
            <StatBox
              label="Last 5 Avg"
              value={driver.recentForm.last5Avg.toFixed(1)}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <StatBox
              label="Driver Rating"
              value={driver.stats.overall.driverRating.toFixed(1)}
              icon={<Zap className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Context Banner */}
        <div className="bg-flame-500/10 border border-flame-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-flame-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-cream-100 mb-1">
                Daytona 500 • Superspeedway
              </div>
              <div className="text-sm text-cream-400">
                Stats below are filtered for superspeedway performance (2023-2025)
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stats Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Track Type Performance */}
            {trackTypeStats && (
              <StatsCard title="Superspeedway Performance" subtitle="Last 3 seasons">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatItem label="Avg Finish" value={trackTypeStats.avgFinish.toFixed(1)} />
                  <StatItem label="Avg Start" value={trackTypeStats.avgStart.toFixed(1)} />
                  <StatItem label="Races" value={trackTypeStats.races.toString()} />
                  <StatItem label="Wins" value={trackTypeStats.wins.toString()} />
                  <StatItem label="Top 5s" value={trackTypeStats.top5.toString()} />
                  <StatItem label="Top 10s" value={trackTypeStats.top10.toString()} />
                  <StatItem label="Laps Led" value={trackTypeStats.lapsLed.toString()} />
                  <StatItem
                    label="Driver Rating"
                    value={trackTypeStats.driverRating.toFixed(1)}
                    highlight
                  />
                  <StatItem label="DNF Rate" value={`${trackTypeStats.dnfRate.toFixed(1)}%`} />
                </div>
              </StatsCard>
            )}

            {/* At This Track */}
            {driver.stats.atCurrentTrack && (
              <StatsCard title="At Daytona" subtitle="Career stats">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatItem
                    label="Avg Finish"
                    value={driver.stats.atCurrentTrack.avgFinish.toFixed(1)}
                  />
                  <StatItem
                    label="Avg Start"
                    value={driver.stats.atCurrentTrack.avgStart.toFixed(1)}
                  />
                  <StatItem label="Races" value={driver.stats.atCurrentTrack.races.toString()} />
                  <StatItem label="Wins" value={driver.stats.atCurrentTrack.wins.toString()} />
                  <StatItem label="Top 5s" value={driver.stats.atCurrentTrack.top5.toString()} />
                  <StatItem label="Top 10s" value={driver.stats.atCurrentTrack.top10.toString()} />
                  <StatItem
                    label="Laps Led"
                    value={driver.stats.atCurrentTrack.lapsLed.toString()}
                  />
                  <StatItem
                    label="Driver Rating"
                    value={driver.stats.atCurrentTrack.driverRating.toFixed(1)}
                    highlight
                  />
                  <StatItem label="DNFs" value={driver.stats.atCurrentTrack.dnfs.toString()} />
                </div>
              </StatsCard>
            )}

            {/* All Track Types Comparison */}
            <StatsCard title="Performance by Track Type" subtitle="Last 3 seasons">
              <div className="space-y-3">
                {driver.stats.byTrackType.map((trackStat) => (
                  <div
                    key={trackStat.trackType}
                    className={`p-4 rounded-lg border ${
                      trackStat.trackType === currentTrackType
                        ? 'bg-flame-500/10 border-flame-500/30'
                        : 'bg-void-800/50 border-void-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-cream-100">
                        {getTrackTypeLabel(trackStat.trackType)}
                      </div>
                      {trackStat.trackType === currentTrackType && (
                        <span className="badge-flame text-xs">Current</span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-cream-500 text-xs mb-1">Avg Finish</div>
                        <div className="font-semibold text-cream-100">
                          {trackStat.avgFinish.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-cream-500 text-xs mb-1">Top 5s</div>
                        <div className="font-semibold text-cream-100">{trackStat.top5}</div>
                      </div>
                      <div>
                        <div className="text-cream-500 text-xs mb-1">Wins</div>
                        <div className="font-semibold text-cream-100">{trackStat.wins}</div>
                      </div>
                      <div>
                        <div className="text-cream-500 text-xs mb-1">Rating</div>
                        <div className="font-semibold text-mint-500">
                          {trackStat.driverRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StatsCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekend Data */}
            {(driver.practiceResults || driver.qualifyingResult) && (
              <StatsCard title="Weekend Performance" subtitle="Daytona 500">
                {driver.qualifyingResult && (
                  <div className="mb-4 p-4 bg-mint-500/10 rounded-lg border border-mint-500/30">
                    <div className="text-xs text-cream-500 mb-2">Qualifying</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-cream-100">
                          P{driver.qualifyingResult.position}
                        </div>
                        <div className="text-xs text-cream-500 mt-1">
                          {driver.qualifyingResult.lapSpeed.toFixed(3)} mph
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {driver.practiceResults && driver.practiceResults.length > 0 && (
                  <div>
                    <div className="text-xs text-cream-500 mb-2">Practice Sessions</div>
                    {driver.practiceResults.map((practice, idx) => (
                      <div key={idx} className="p-3 bg-void-800/50 rounded-lg mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-cream-200">
                            {practice.session.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                          <div className="text-sm font-bold text-cream-100">P{practice.rank}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-cream-500">Speed</div>
                            <div className="text-cream-200">{practice.bestLapSpeed.toFixed(2)} mph</div>
                          </div>
                          <div>
                            <div className="text-cream-500">Laps</div>
                            <div className="text-cream-200">{practice.totalLaps}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </StatsCard>
            )}

            {/* Career Overview */}
            <StatsCard title="Career Stats" subtitle="All tracks">
              <div className="space-y-3">
                <StatItem label="Races" value={driver.stats.overall.races.toString()} />
                <StatItem label="Wins" value={driver.stats.overall.wins.toString()} />
                <StatItem label="Top 5s" value={driver.stats.overall.top5.toString()} />
                <StatItem label="Top 10s" value={driver.stats.overall.top10.toString()} />
                <StatItem
                  label="Avg Finish"
                  value={driver.stats.overall.avgFinish.toFixed(1)}
                />
                <StatItem
                  label="Driver Rating"
                  value={driver.stats.overall.driverRating.toFixed(1)}
                  highlight
                />
              </div>
            </StatsCard>
          </div>
        </div>
      </main>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function StatBox({
  label,
  value,
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-void-800 flex items-center justify-center text-flame-500">
        {icon}
      </div>
      <div>
        <div className="text-xs text-cream-500 mb-0.5">{label}</div>
        <div className="font-semibold text-cream-100">{value}</div>
        {sublabel && <div className="text-xs text-cream-600">{sublabel}</div>}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-cream-100">{title}</h2>
        {subtitle && <p className="text-sm text-cream-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-cream-500 mb-1">{label}</div>
      <div
        className={`text-lg font-semibold ${
          highlight ? 'text-mint-500' : 'text-cream-100'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
