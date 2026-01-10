'use client';

import { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Flame, Snowflake, TrendingUp, TrendingDown, Trophy, Target, Gauge, Flag, ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateAggregatedStats } from '@/lib/data';
import type { RaceResult, TrackType, AggregatedStats } from '@/types';

// =============================================================================
// DRIVER DASHBOARD - High-octane analytics dashboard
// =============================================================================

interface Driver {
  id: string;
  name: string;
  number: string;
  team: string;
  manufacturer: string;
}

interface DriverDashboardProps {
  driver: Driver;
  results: RaceResult[];
  tracks: Array<{ id: string; name: string; type: string }>;
  years: number[];
}

// Team/Manufacturer color mappings
const MANUFACTURER_GRADIENTS: Record<string, { from: string; to: string; accent: string }> = {
  'Ford': { from: 'from-blue-900/40', to: 'to-blue-600/10', accent: 'text-blue-400' },
  'Toyota': { from: 'from-red-900/40', to: 'to-red-600/10', accent: 'text-red-400' },
  'Chevrolet': { from: 'from-yellow-900/40', to: 'to-yellow-600/10', accent: 'text-yellow-400' },
};

const TRACK_TYPE_LABELS: Record<TrackType, string> = {
  superspeedway: 'Superspeedway',
  intermediate: 'Intermediate',
  short: 'Short Track',
  road: 'Road Course',
  dirt: 'Dirt',
};

// Format date as "Month Day, Year"
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function DriverDashboard({ driver, results, tracks, years }: DriverDashboardProps) {
  // Filter state
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType | 'all'>('all');

  // Sort results by date (most recent first)
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [results]);

  // Filter results based on selections
  const filteredResults = useMemo(() => {
    return sortedResults.filter(r => {
      if (selectedYear !== 'all' && r.year !== selectedYear) return false;
      if (selectedTrackType !== 'all' && r.trackType !== selectedTrackType) return false;
      return true;
    });
  }, [sortedResults, selectedYear, selectedTrackType]);

  // Calculate overall stats
  const overallStats = useMemo(() => calculateAggregatedStats(filteredResults), [filteredResults]);

  // Calculate stats by track type for radar chart
  const trackTypeStats = useMemo(() => {
    const types: TrackType[] = ['superspeedway', 'intermediate', 'short', 'road'];
    return types.map(type => {
      const typeResults = sortedResults.filter(r => r.trackType === type);
      const stats = calculateAggregatedStats(typeResults);
      return {
        type,
        label: TRACK_TYPE_LABELS[type],
        rating: stats.avgRating || 0,
        races: stats.races,
        avgFinish: stats.avgFinish || 0,
      };
    });
  }, [sortedResults]);

  // Get last 10 races for sparkline (sorted most recent first for display, but chart shows progression)
  const last10Races = useMemo(() => {
    return sortedResults.slice(0, 10).reverse(); // Reverse for chart to show oldest to newest
  }, [sortedResults]);

  // Calculate form status
  const formStatus = useMemo(() => {
    const last3 = sortedResults.slice(0, 3);
    if (last3.length < 3) return null;

    const avgLast3 = last3.reduce((sum, r) => sum + r.finishPos, 0) / 3;
    const top5Count = last3.filter(r => r.finishPos <= 5).length;
    const top10Count = last3.filter(r => r.finishPos <= 10).length;

    if (top5Count >= 2) return { status: 'hot', label: `Top 5 in ${top5Count}/3`, icon: Flame };
    if (top10Count >= 2) return { status: 'warm', label: `Top 10 in ${top10Count}/3`, icon: TrendingUp };
    if (avgLast3 > 25) return { status: 'cold', label: `Avg ${avgLast3.toFixed(0)}th last 3`, icon: Snowflake };
    return { status: 'neutral', label: `Avg ${avgLast3.toFixed(0)}th last 3`, icon: Target };
  }, [sortedResults]);

  // Calculate momentum trend
  const momentumTrend = useMemo(() => {
    if (last10Races.length < 3) return 'neutral';
    const firstHalf = last10Races.slice(0, Math.floor(last10Races.length / 2));
    const secondHalf = last10Races.slice(Math.floor(last10Races.length / 2));

    const firstAvg = firstHalf.reduce((sum, r) => sum + r.finishPos, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.finishPos, 0) / secondHalf.length;

    if (secondAvg < firstAvg - 2) return 'improving';
    if (secondAvg > firstAvg + 2) return 'declining';
    return 'neutral';
  }, [last10Races]);

  const seasonAvgFinish = overallStats.avgFinish;

  const gradients = MANUFACTURER_GRADIENTS[driver.manufacturer] || MANUFACTURER_GRADIENTS['Chevrolet'];

  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* ============================================= */}
        {/* HERO IDENTITY CARD - Spans 5 cols */}
        {/* ============================================= */}
        <div className={cn(
          'col-span-12 lg:col-span-5 rounded-2xl border border-void-700/50 overflow-hidden',
          'bg-gradient-to-br',
          gradients.from,
          gradients.to
        )}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-start gap-5">
              {/* Massive Car Number */}
              <div className={cn(
                'text-7xl md:text-8xl font-black font-mono tracking-tighter',
                gradients.accent,
                'opacity-90 leading-none'
              )}>
                {driver.number}
              </div>

              {/* Driver Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-cream-50 truncate">
                    {driver.name}
                  </h1>

                  {/* Form Tracker Badge */}
                  {formStatus && (
                    <div className={cn(
                      'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                      formStatus.status === 'hot' && 'bg-orange-500/20 text-orange-400',
                      formStatus.status === 'warm' && 'bg-green-500/20 text-green-400',
                      formStatus.status === 'cold' && 'bg-blue-500/20 text-blue-400',
                      formStatus.status === 'neutral' && 'bg-void-600 text-cream-400'
                    )}>
                      <formStatus.icon className="w-3.5 h-3.5" />
                      {formStatus.label}
                    </div>
                  )}
                </div>

                <p className="text-cream-400 mt-1">
                  {driver.team}
                </p>
                <p className={cn('text-sm font-semibold mt-0.5', gradients.accent)}>
                  {driver.manufacturer}
                </p>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              <QuickStatCard
                label="Avg Finish"
                value={overallStats.avgFinish.toFixed(1)}
                icon={Target}
                highlight={overallStats.avgFinish <= 10}
              />
              <QuickStatCard
                label="Win %"
                value={`${overallStats.winPct}%`}
                icon={Trophy}
                highlight={overallStats.winPct > 5}
              />
              <QuickStatCard
                label="Rating"
                value={overallStats.avgRating.toFixed(0)}
                icon={Gauge}
                highlight={overallStats.avgRating >= 100}
              />
              <QuickStatCard
                label="Races"
                value={overallStats.races.toString()}
                icon={Flag}
              />
            </div>
          </div>
        </div>

        {/* ============================================= */}
        {/* SKILL PENTAGON - Radar Chart - Spans 4 cols */}
        {/* ============================================= */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-void-800/50 rounded-2xl border border-void-700/50 p-4">
          <h2 className="text-xs font-semibold text-cream-500 uppercase tracking-wider mb-2">
            Track Type Mastery
          </h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={trackTypeStats} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 150]}
                  tick={{ fill: '#6b7280', fontSize: 9 }}
                  tickCount={4}
                />
                <Radar
                  name="Rating"
                  dataKey="rating"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)} (${props.payload.races} races)`,
                    'Avg Rating'
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {trackTypeStats.map(stat => (
              <div key={stat.type} className="text-center">
                <div className="text-[10px] text-cream-500">{stat.label}</div>
                <div className={cn(
                  'text-sm font-bold',
                  stat.rating >= 100 ? 'text-green-400' : stat.rating >= 80 ? 'text-cream-200' : 'text-cream-500'
                )}>
                  {stat.rating.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================= */}
        {/* MOMENTUM SPARKLINE - Spans 3 cols */}
        {/* ============================================= */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-void-800/50 rounded-2xl border border-void-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-cream-500 uppercase tracking-wider">
              Last 10 Races
            </h2>
            <div className={cn(
              'flex items-center gap-1 text-xs font-semibold',
              momentumTrend === 'improving' && 'text-green-400',
              momentumTrend === 'declining' && 'text-red-400',
              momentumTrend === 'neutral' && 'text-cream-400'
            )}>
              {momentumTrend === 'improving' && <><TrendingDown className="w-3 h-3" /> Improving</>}
              {momentumTrend === 'declining' && <><TrendingUp className="w-3 h-3" /> Declining</>}
              {momentumTrend === 'neutral' && 'Steady'}
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last10Races} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fill: '#6b7280', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  reversed
                  domain={[1, 40]}
                  tick={{ fill: '#6b7280', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  ticks={[1, 10, 20, 30, 40]}
                />
                <ReferenceLine
                  y={seasonAvgFinish}
                  stroke="#6b7280"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <Line
                  type="monotone"
                  dataKey="finishPos"
                  stroke={momentumTrend === 'improving' ? '#22c55e' : momentumTrend === 'declining' ? '#ef4444' : '#f97316'}
                  strokeWidth={2}
                  dot={{ fill: '#1f2937', stroke: momentumTrend === 'improving' ? '#22c55e' : momentumTrend === 'declining' ? '#ef4444' : '#f97316', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`P${value}`, 'Finish']}
                  labelFormatter={(date) => formatDate(new Date(date))}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[10px] text-cream-500 mt-1">
            <span>Season Avg: P{seasonAvgFinish.toFixed(1)}</span>
            <span>Best: P{Math.min(...last10Races.map(r => r.finishPos))}</span>
          </div>
        </div>

        {/* ============================================= */}
        {/* DEEP DIVE DATA GRID - Full Width */}
        {/* ============================================= */}
        <div className="col-span-12 bg-void-800/50 rounded-2xl border border-void-700/50 overflow-hidden">
          {/* Sticky Filter Toolbar */}
          <div className="sticky top-0 z-20 bg-void-850/95 backdrop-blur-sm border-b border-void-700/50 p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-sm font-semibold text-cream-200 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Race History
              </h2>

              <div className="flex items-center gap-3">
                {/* Year Filter */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-1.5 bg-void-700 border border-void-600 rounded-lg text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                {/* Track Type Filter */}
                <select
                  value={selectedTrackType}
                  onChange={(e) => setSelectedTrackType(e.target.value as TrackType | 'all')}
                  className="px-3 py-1.5 bg-void-700 border border-void-600 rounded-lg text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50"
                >
                  <option value="all">All Track Types</option>
                  <option value="superspeedway">Superspeedway</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="short">Short Track</option>
                  <option value="road">Road Course</option>
                </select>

                {/* Clear Filters */}
                {(selectedYear !== 'all' || selectedTrackType !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedYear('all');
                      setSelectedTrackType('all');
                    }}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs text-flame-400 hover:text-flame-300"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-cream-500 mt-2">
              Showing {filteredResults.length} races
            </div>
          </div>

          {/* Data Table with Heatmap */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-void-700/50 bg-void-850">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Race
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Start
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Finish
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    +/-
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Led
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-700/30">
                {filteredResults.map((result, idx) => (
                  <ResultRow key={result.id} result={result} idx={idx} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredResults.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-cream-400">No results found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// QUICK STAT CARD
// =============================================================================

function QuickStatCard({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className="bg-void-900/50 rounded-xl p-3 text-center">
      <Icon className={cn('w-4 h-4 mx-auto mb-1', highlight ? 'text-green-400' : 'text-cream-500')} />
      <div className={cn('text-lg font-bold font-mono', highlight ? 'text-green-400' : 'text-cream-100')}>
        {value}
      </div>
      <div className="text-[10px] text-cream-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// =============================================================================
// RESULT ROW WITH HEATMAP
// =============================================================================

function ResultRow({ result, idx }: { result: RaceResult; idx: number }) {
  const positionChange = result.startPos - result.finishPos;

  // Heatmap colors for finish position
  const getFinishColor = (pos: number) => {
    if (pos === 1) return 'bg-yellow-500/30 text-yellow-300';
    if (pos <= 5) return 'bg-green-500/30 text-green-300';
    if (pos <= 10) return 'bg-green-500/15 text-green-400';
    if (pos <= 15) return 'bg-void-700 text-cream-200';
    if (pos <= 25) return 'bg-orange-500/15 text-orange-400';
    if (pos <= 30) return 'bg-red-500/15 text-red-400';
    return 'bg-red-500/25 text-red-300';
  };

  // Rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 120) return 'text-green-400';
    if (rating >= 100) return 'text-green-300';
    if (rating >= 80) return 'text-cream-200';
    return 'text-cream-500';
  };

  // Track type badge color
  const getTrackTypeBadge = (type: TrackType) => {
    const colors: Record<TrackType, string> = {
      superspeedway: 'bg-flame-500/20 text-flame-400',
      intermediate: 'bg-blue-500/20 text-blue-400',
      short: 'bg-purple-500/20 text-purple-400',
      road: 'bg-green-500/20 text-green-400',
      dirt: 'bg-amber-500/20 text-amber-400',
    };
    return colors[type] || 'bg-void-600 text-cream-400';
  };

  return (
    <tr className={cn(
      'hover:bg-void-700/30 transition-colors',
      idx % 2 === 0 ? 'bg-void-800/20' : ''
    )}>
      <td className="px-4 py-3 text-cream-300 whitespace-nowrap font-mono text-xs">
        {formatDate(result.date)}
      </td>
      <td className="px-4 py-3 text-cream-200 font-medium max-w-[200px] truncate">
        {result.raceName}
      </td>
      <td className="px-4 py-3 text-cream-400 max-w-[150px] truncate">
        {result.trackName}
      </td>
      <td className="px-3 py-3 text-center">
        <span className={cn(
          'inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
          getTrackTypeBadge(result.trackType)
        )}>
          {result.trackType === 'superspeedway' ? 'SS' :
           result.trackType === 'intermediate' ? 'INT' :
           result.trackType === 'short' ? 'SHORT' :
           result.trackType === 'road' ? 'ROAD' : result.trackType.toUpperCase()}
        </span>
      </td>
      <td className="px-3 py-3 text-center text-cream-400 font-mono">
        {result.startPos}
      </td>
      <td className="px-3 py-3 text-center">
        <span className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold font-mono text-sm',
          getFinishColor(result.finishPos)
        )}>
          {result.finishPos}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        <span className={cn(
          'font-mono text-sm font-semibold',
          positionChange > 0 ? 'text-green-400' :
          positionChange < 0 ? 'text-red-400' :
          'text-cream-500'
        )}>
          {positionChange > 0 ? `+${positionChange}` : positionChange === 0 ? '—' : positionChange}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        {result.lapsLed > 0 ? (
          <span className="text-flame-400 font-semibold">{result.lapsLed}</span>
        ) : (
          <span className="text-void-500">—</span>
        )}
      </td>
      <td className={cn('px-3 py-3 text-center font-mono', getRatingColor(result.driverRating))}>
        {result.driverRating.toFixed(1)}
      </td>
    </tr>
  );
}
