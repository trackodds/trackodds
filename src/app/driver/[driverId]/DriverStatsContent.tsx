'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Trophy, Target, Gauge, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateAggregatedStats } from '@/lib/data';
import type { RaceResult, AggregatedStats, TrackType } from '@/types';

// =============================================================================
// DRIVER STATS CONTENT - Client component for filtering and display
// =============================================================================

interface DriverStatsContentProps {
  driverId: string;
  results: RaceResult[];
  tracks: Array<{ id: string; name: string; type: string }>;
  years: number[];
}

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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function DriverStatsContent({
  driverId,
  results,
  tracks,
  years,
}: DriverStatsContentProps) {
  // Filter state
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType | 'all'>('all');
  const [selectedTrack, setSelectedTrack] = useState<string | 'all'>('all');

  // Filter results based on selections
  const filteredResults = useMemo(() => {
    return results.filter(r => {
      if (selectedYear !== 'all' && r.year !== selectedYear) return false;
      if (selectedTrackType !== 'all' && r.trackType !== selectedTrackType) return false;
      if (selectedTrack !== 'all' && r.trackId !== selectedTrack) return false;
      return true;
    });
  }, [results, selectedYear, selectedTrackType, selectedTrack]);

  // Calculate stats from filtered results
  const stats = useMemo(() => calculateAggregatedStats(filteredResults), [filteredResults]);

  // Get results by track type
  const getResultsByTrackType = (type: TrackType) => {
    return results.filter(r => r.trackType === type).slice(0, 5);
  };

  // Filter tracks by selected type
  const filteredTracks = useMemo(() => {
    if (selectedTrackType === 'all') return tracks;
    return tracks.filter(t => t.type === selectedTrackType);
  }, [tracks, selectedTrackType]);

  // Reset track selection when track type changes
  const handleTrackTypeChange = (value: string) => {
    setSelectedTrackType(value as TrackType | 'all');
    setSelectedTrack('all');
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <section className="card p-6">
        <h2 className="text-sm font-semibold text-cream-500 uppercase tracking-wider mb-4">
          Filter Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FilterSelect
            label="Year"
            value={selectedYear}
            onChange={(v) => setSelectedYear(v === 'all' ? 'all' : Number(v))}
            options={[
              { value: 'all', label: 'All Time' },
              ...years.map(y => ({ value: y, label: String(y) })),
            ]}
          />
          <FilterSelect
            label="Track Type"
            value={selectedTrackType}
            onChange={handleTrackTypeChange}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'superspeedway', label: 'Superspeedway' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'short', label: 'Short Track' },
              { value: 'road', label: 'Road Course' },
            ]}
          />
          <FilterSelect
            label="Track"
            value={selectedTrack}
            onChange={(v) => setSelectedTrack(v)}
            options={[
              { value: 'all', label: 'All Tracks' },
              ...filteredTracks.map(t => ({ value: t.id, label: t.name })),
            ]}
          />
        </div>
      </section>

      {/* Aggregated Stats Cards */}
      <section>
        <h2 className="text-sm font-semibold text-cream-500 uppercase tracking-wider mb-4">
          Aggregated Stats ({stats.races} races)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Target}
            label="Avg Finish"
            value={stats.avgFinish.toFixed(1)}
            color="text-mint-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Start"
            value={stats.avgStart.toFixed(1)}
            color="text-cream-200"
          />
          <StatCard
            icon={Gauge}
            label="Avg Rating"
            value={stats.avgRating.toFixed(1)}
            color="text-flame-400"
          />
          <StatCard
            icon={Trophy}
            label="Win %"
            value={`${stats.winPct}%`}
            color="text-yellow-400"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <MiniStat label="Top 5 %" value={`${stats.top5Pct}%`} />
          <MiniStat label="Top 10 %" value={`${stats.top10Pct}%`} />
          <MiniStat label="Avg Laps Led" value={stats.avgLapsLed.toFixed(1)} />
        </div>
      </section>

      {/* Tale of the Tape - Track Type Breakdowns */}
      <section>
        <h2 className="text-sm font-semibold text-cream-500 uppercase tracking-wider mb-4">
          Performance by Track Type
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Superspeedways */}
          <TrackTypeCard
            type="superspeedway"
            label="Superspeedways"
            results={getResultsByTrackType('superspeedway')}
          />

          {/* Intermediates */}
          <TrackTypeCard
            type="intermediate"
            label="Intermediates"
            results={getResultsByTrackType('intermediate')}
          />

          {/* Short Tracks */}
          <TrackTypeCard
            type="short"
            label="Short Tracks"
            results={getResultsByTrackType('short')}
          />

          {/* Road Courses */}
          <TrackTypeCard
            type="road"
            label="Road Courses"
            results={getResultsByTrackType('road')}
          />
        </div>
      </section>

      {/* Full Results Table */}
      {filteredResults.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-cream-500 uppercase tracking-wider mb-4">
            All Filtered Results ({filteredResults.length})
          </h2>
          <ResultsTable results={filteredResults} />
        </section>
      )}

      {filteredResults.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-cream-400">No results found for the selected filters.</p>
          <button
            onClick={() => {
              setSelectedYear('all');
              setSelectedTrackType('all');
              setSelectedTrack('all');
            }}
            className="mt-2 text-sm text-flame-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// FILTER SELECT COMPONENT
// =============================================================================

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Array<{ value: string | number; label: string }>;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-cream-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-void-700 border border-void-600 rounded-xl px-4 py-3 text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500 pointer-events-none" />
      </div>
    </div>
  );
}

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <Icon className={cn('w-5 h-5 mb-3', color)} />
      <div className={cn('text-3xl font-bold font-mono', color)}>{value}</div>
      <div className="text-xs text-cream-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xl font-bold font-mono text-cream-200">{value}</div>
      <div className="text-[10px] text-cream-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

// =============================================================================
// TRACK TYPE CARD COMPONENT
// =============================================================================

function TrackTypeCard({
  type,
  label,
  results,
}: {
  type: TrackType;
  label: string;
  results: RaceResult[];
}) {
  const stats = calculateAggregatedStats(results);

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 bg-void-850 border-b border-void-700/50">
        <h3 className="font-display font-semibold text-cream-100">{label}</h3>
        <p className="text-xs text-cream-500 mt-0.5">Last 5 races</p>
      </div>

      {results.length > 0 ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-4 divide-x divide-void-700/50 border-b border-void-700/50">
            <QuickStat label="Avg Fin" value={stats.avgFinish.toFixed(1)} />
            <QuickStat label="Avg St" value={stats.avgStart.toFixed(1)} />
            <QuickStat label="Rating" value={stats.avgRating.toFixed(1)} />
            <QuickStat label="Led" value={stats.avgLapsLed.toFixed(0)} />
          </div>

          {/* Results List */}
          <div className="divide-y divide-void-700/30">
            {results.map((result) => (
              <div
                key={result.id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-cream-200">
                    {result.trackName}
                  </div>
                  <div className="text-xs text-cream-500">
                    {formatDate(result.date)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-cream-500 text-[10px] uppercase">St</div>
                    <div className="text-cream-300">{result.startPos}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-cream-500 text-[10px] uppercase">Fin</div>
                    <div className={cn(
                      'font-semibold',
                      result.finishPos === 1 ? 'text-yellow-400' :
                      result.finishPos <= 5 ? 'text-mint-400' :
                      result.finishPos <= 10 ? 'text-cream-200' :
                      'text-cream-500'
                    )}>
                      {result.finishPos}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-cream-500 text-[10px] uppercase">Led</div>
                    <div className="text-cream-300">{result.lapsLed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-cream-500 text-sm">
          No results at {label.toLowerCase()}
        </div>
      )}
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 text-center">
      <div className="text-[10px] text-cream-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-cream-200 mt-0.5">{value}</div>
    </div>
  );
}

// =============================================================================
// RESULTS TABLE COMPONENT
// =============================================================================

function ResultsTable({ results }: { results: RaceResult[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-void-700/50 bg-void-850">
              <th className="text-left px-5 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                Race
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
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
                Laps Led
              </th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-void-700/30">
            {results.map((result, idx) => (
              <tr
                key={result.id}
                className={cn(idx % 2 === 0 ? 'bg-void-800/30' : '')}
              >
                <td className="px-5 py-3 text-cream-300 whitespace-nowrap">
                  {formatDate(result.date)}
                </td>
                <td className="px-5 py-3 text-cream-200 font-medium">
                  {result.raceName}
                </td>
                <td className="px-5 py-3 text-cream-400">
                  {result.trackName}
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={cn(
                    'inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
                    result.trackType === 'superspeedway' ? 'bg-flame-500/20 text-flame-400' :
                    result.trackType === 'intermediate' ? 'bg-blue-500/20 text-blue-400' :
                    result.trackType === 'short' ? 'bg-purple-500/20 text-purple-400' :
                    result.trackType === 'road' ? 'bg-green-500/20 text-green-400' :
                    'bg-void-600 text-cream-400'
                  )}>
                    {TRACK_TYPE_LABELS[result.trackType] || result.trackType}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-cream-400">
                  {result.startPos}
                </td>
                <td className={cn(
                  'px-3 py-3 text-center font-semibold',
                  result.finishPos === 1 ? 'text-yellow-400' :
                  result.finishPos <= 5 ? 'text-mint-400' :
                  result.finishPos <= 10 ? 'text-cream-200' :
                  'text-cream-500'
                )}>
                  {result.finishPos}
                </td>
                <td className="px-3 py-3 text-center text-cream-400">
                  {result.lapsLed}
                </td>
                <td className={cn(
                  'px-3 py-3 text-center',
                  result.driverRating >= 100 ? 'text-mint-400' :
                  result.driverRating >= 80 ? 'text-cream-200' :
                  'text-cream-500'
                )}>
                  {result.driverRating.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
