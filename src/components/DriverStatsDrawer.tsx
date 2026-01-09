'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, TrendingUp, Trophy, Target, Gauge, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDriverResults, getTracks, getResultYears, calculateAggregatedStats } from '@/lib/data';
import type { RaceResult, AggregatedStats, TrackType } from '@/types';

// =============================================================================
// DRIVER STATS DRAWER - Slide-over panel for driver analytics
// =============================================================================

interface DriverStatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string;
  driverName: string;
  driverNumber: string;
  team: string;
  currentTrackType?: TrackType;
  currentTrackId?: string;
}

const TRACK_TYPE_LABELS: Record<TrackType, string> = {
  superspeedway: 'Superspeedway',
  intermediate: 'Intermediate',
  short: 'Short Track',
  road: 'Road Course',
  dirt: 'Dirt',
};

export function DriverStatsDrawer({
  isOpen,
  onClose,
  driverId,
  driverName,
  driverNumber,
  team,
  currentTrackType = 'superspeedway',
  currentTrackId = 'daytona',
}: DriverStatsDrawerProps) {
  // Data state
  const [results, setResults] = useState<RaceResult[]>([]);
  const [tracks, setTracks] = useState<Array<{ id: string; name: string; type: string }>>([]);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType | 'all'>('all');
  const [selectedTrack, setSelectedTrack] = useState<string | 'all'>('all');

  // Fetch data on open
  useEffect(() => {
    if (isOpen && driverId) {
      setIsLoading(true);
      Promise.all([
        getDriverResults(driverId),
        getTracks(),
        getResultYears(),
      ]).then(([resultsData, tracksData, yearsData]) => {
        setResults(resultsData);
        setTracks(tracksData);
        setYears(yearsData);
        setIsLoading(false);
      });
    }
  }, [isOpen, driverId]);

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

  // Get results by track type (for current race's track type)
  const trackTypeResults = useMemo(() => {
    return results
      .filter(r => r.trackType === currentTrackType)
      .slice(0, 5);
  }, [results, currentTrackType]);

  // Get results at specific track
  const trackResults = useMemo(() => {
    return results
      .filter(r => r.trackId === currentTrackId)
      .slice(0, 5);
  }, [results, currentTrackId]);

  // Get current track name
  const currentTrackName = useMemo(() => {
    const track = tracks.find(t => t.id === currentTrackId);
    return track?.name || 'This Track';
  }, [tracks, currentTrackId]);

  // Filter tracks by selected type
  const filteredTracks = useMemo(() => {
    if (selectedTrackType === 'all') return tracks;
    return tracks.filter(t => t.type === selectedTrackType);
  }, [tracks, selectedTrackType]);

  // Reset track selection when track type changes
  useEffect(() => {
    setSelectedTrack('all');
  }, [selectedTrackType]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void-950/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-void-900 border-l border-void-700/50 shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-void-700/50 bg-void-850">
          <div className="flex items-center gap-4">
            <div className="driver-number-featured text-lg">{driverNumber}</div>
            <div>
              <h2 className="font-display text-xl font-bold text-cream-50">{driverName}</h2>
              <p className="text-sm text-cream-400">{team}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-cream-400 hover:text-cream-100 hover:bg-void-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-void-700/50 bg-void-850/50">
          <div className="grid grid-cols-3 gap-3">
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
              onChange={(v) => setSelectedTrackType(v as TrackType | 'all')}
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-2 border-flame-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Stats Cards */}
              <section>
                <h3 className="text-xs font-semibold text-cream-500 uppercase tracking-wider mb-3">
                  Aggregated Stats ({stats.races} races)
                </h3>
                <div className="grid grid-cols-4 gap-3">
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
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <MiniStat label="Top 5 %" value={`${stats.top5Pct}%`} />
                  <MiniStat label="Top 10 %" value={`${stats.top10Pct}%`} />
                  <MiniStat label="Avg Laps Led" value={stats.avgLapsLed.toFixed(1)} />
                </div>
              </section>

              {/* Tale of the Tape - Two tables */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent at Track Type */}
                <div>
                  <h3 className="text-xs font-semibold text-cream-500 uppercase tracking-wider mb-3">
                    Recent at {TRACK_TYPE_LABELS[currentTrackType]}s
                  </h3>
                  <ResultsTable results={trackTypeResults} showTrack />
                </div>

                {/* History at Specific Track */}
                <div>
                  <h3 className="text-xs font-semibold text-cream-500 uppercase tracking-wider mb-3">
                    History at {currentTrackName}
                  </h3>
                  <ResultsTable results={trackResults} />
                </div>
              </section>

              {/* Full Results Table */}
              {filteredResults.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-cream-500 uppercase tracking-wider mb-3">
                    All Filtered Results ({filteredResults.length})
                  </h3>
                  <ResultsTable results={filteredResults.slice(0, 10)} showTrack showYear />
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
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
      <label className="block text-[10px] font-medium text-cream-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-void-700 border border-void-600 rounded-lg px-3 py-2 text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500 pointer-events-none" />
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
    <div className="bg-void-800 rounded-xl p-3 border border-void-700/50">
      <Icon className={cn('w-4 h-4 mb-2', color)} />
      <div className={cn('text-xl font-bold font-mono', color)}>{value}</div>
      <div className="text-[10px] text-cream-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-void-800/50 rounded-lg p-2 text-center border border-void-700/30">
      <div className="text-sm font-bold font-mono text-cream-200">{value}</div>
      <div className="text-[9px] text-cream-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// =============================================================================
// RESULTS TABLE COMPONENT
// =============================================================================

function ResultsTable({
  results,
  showTrack = false,
  showYear = false,
}: {
  results: RaceResult[];
  showTrack?: boolean;
  showYear?: boolean;
}) {
  if (results.length === 0) {
    return (
      <div className="bg-void-800/50 rounded-xl p-4 text-center text-cream-500 text-sm">
        No results available
      </div>
    );
  }

  return (
    <div className="bg-void-800/50 rounded-xl border border-void-700/30 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-void-700/50">
            <th className="text-left px-3 py-2 text-[10px] font-semibold text-cream-500 uppercase tracking-wider">
              {showYear ? 'Year' : 'Date'}
            </th>
            {showTrack && (
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-cream-500 uppercase tracking-wider">
                Track
              </th>
            )}
            <th className="text-center px-2 py-2 text-[10px] font-semibold text-cream-500 uppercase tracking-wider">
              St
            </th>
            <th className="text-center px-2 py-2 text-[10px] font-semibold text-cream-500 uppercase tracking-wider">
              Fin
            </th>
            <th className="text-center px-2 py-2 text-[10px] font-semibold text-cream-500 uppercase tracking-wider">
              Led
            </th>
            <th className="text-center px-2 py-2 text-[10px] font-semibold text-cream-500 uppercase tracking-wider">
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, idx) => (
            <tr
              key={result.id}
              className={cn(
                'border-b border-void-700/20 last:border-0',
                idx % 2 === 0 ? 'bg-void-800/30' : ''
              )}
            >
              <td className="px-3 py-2 text-cream-300">
                {showYear ? result.year : formatDate(result.date)}
              </td>
              {showTrack && (
                <td className="px-3 py-2 text-cream-400 truncate max-w-[120px]" title={result.trackName}>
                  {result.trackName.split(' ')[0]}
                </td>
              )}
              <td className="text-center px-2 py-2 text-cream-400">{result.startPos}</td>
              <td className={cn(
                'text-center px-2 py-2 font-semibold',
                result.finishPos === 1 ? 'text-yellow-400' :
                result.finishPos <= 5 ? 'text-mint-400' :
                result.finishPos <= 10 ? 'text-cream-200' :
                'text-cream-500'
              )}>
                {result.finishPos}
              </td>
              <td className="text-center px-2 py-2 text-cream-400">{result.lapsLed}</td>
              <td className={cn(
                'text-center px-2 py-2',
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
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}
