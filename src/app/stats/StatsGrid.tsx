'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateAggregatedStats } from '@/lib/data';
import type { RaceResult, TrackType, AggregatedStats } from '@/types';

// =============================================================================
// STATS GRID - Comprehensive driver analysis
// =============================================================================

interface Driver {
  id: string;
  name: string;
  number: string;
  team: string;
  manufacturer: string;
}

interface StatsGridProps {
  drivers: Driver[];
  results: RaceResult[];
  tracks: Array<{ id: string; name: string; type: string }>;
  years: number[];
  defaultTrackType: TrackType;
  defaultTrackId: string;
  defaultTrackName: string;
}

const TRACK_TYPE_OPTIONS: { value: TrackType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Track Types' },
  { value: 'superspeedway', label: 'Superspeedway' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'short', label: 'Short Track' },
  { value: 'road', label: 'Road Course' },
];

const RANGE_OPTIONS = [
  { value: 5, label: 'Last 5 Races' },
  { value: 10, label: 'Last 10 Races' },
  { value: 20, label: 'Last 20 Races' },
  { value: 0, label: 'All Races' },
];

type SortField = 'name' | 'avgFinish' | 'avgStart' | 'avgRating' | 'avgLapsLed' | 'races';
type SortDirection = 'asc' | 'desc';

export function StatsGrid({
  drivers,
  results,
  tracks,
  years,
  defaultTrackType,
  defaultTrackId,
  defaultTrackName,
}: StatsGridProps) {
  // Filter state
  const [selectedYears, setSelectedYears] = useState<number[]>(years.slice(0, 2));
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType | 'all'>(defaultTrackType);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [raceRange, setRaceRange] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Sort state
  const [sortField, setSortField] = useState<SortField>('avgFinish');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Dropdown states
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showTrackDropdown, setShowTrackDropdown] = useState(false);

  // Filter tracks by selected type
  const filteredTracks = useMemo(() => {
    if (selectedTrackType === 'all') return tracks;
    return tracks.filter(t => t.type === selectedTrackType);
  }, [tracks, selectedTrackType]);

  // Build driver stats based on filters
  const driverStats = useMemo(() => {
    return drivers.map(driver => {
      // Filter results for this driver
      let driverResults = results.filter(r => r.driverId === driver.id);

      // Apply year filter
      if (selectedYears.length > 0) {
        driverResults = driverResults.filter(r => selectedYears.includes(r.year));
      }

      // Apply track type filter
      if (selectedTrackType !== 'all') {
        driverResults = driverResults.filter(r => r.trackType === selectedTrackType);
      }

      // Apply specific track filter
      if (selectedTracks.length > 0) {
        driverResults = driverResults.filter(r => selectedTracks.includes(r.trackId));
      }

      // Sort by date (most recent first)
      driverResults.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Apply range limit for stats
      const limitedResults = raceRange > 0 ? driverResults.slice(0, raceRange) : driverResults;

      // Calculate aggregated stats
      const stats = calculateAggregatedStats(limitedResults);

      // Get recent race history (last 10 for display)
      const recentRaces = driverResults.slice(0, 10);

      // Get track-specific history (for the upcoming track)
      const trackHistory = results
        .filter(r => r.driverId === driver.id && r.trackId === defaultTrackId)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

      return {
        driver,
        stats,
        recentRaces,
        trackHistory,
        totalRaces: limitedResults.length,
      };
    });
  }, [drivers, results, selectedYears, selectedTrackType, selectedTracks, raceRange, defaultTrackId]);

  // Filter by search
  const filteredDriverStats = useMemo(() => {
    if (!searchQuery) return driverStats;
    const query = searchQuery.toLowerCase();
    return driverStats.filter(
      ds =>
        ds.driver.name.toLowerCase().includes(query) ||
        ds.driver.number.includes(query) ||
        ds.driver.team.toLowerCase().includes(query)
    );
  }, [driverStats, searchQuery]);

  // Sort drivers
  const sortedDriverStats = useMemo(() => {
    return [...filteredDriverStats].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case 'name':
          aVal = a.driver.name;
          bVal = b.driver.name;
          break;
        case 'avgFinish':
          aVal = a.stats.avgFinish || 99;
          bVal = b.stats.avgFinish || 99;
          break;
        case 'avgStart':
          aVal = a.stats.avgStart || 99;
          bVal = b.stats.avgStart || 99;
          break;
        case 'avgRating':
          aVal = a.stats.avgRating || 0;
          bVal = b.stats.avgRating || 0;
          break;
        case 'avgLapsLed':
          aVal = a.stats.avgLapsLed || 0;
          bVal = b.stats.avgLapsLed || 0;
          break;
        case 'races':
          aVal = a.stats.races || 0;
          bVal = b.stats.races || 0;
          break;
        default:
          aVal = a.stats.avgFinish || 99;
          bVal = b.stats.avgFinish || 99;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });
  }, [filteredDriverStats, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default: lower is better for finish/start, higher is better for rating/laps
      setSortDirection(field === 'avgRating' || field === 'avgLapsLed' || field === 'races' ? 'desc' : 'asc');
    }
  };

  const toggleYear = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTracks(prev =>
      prev.includes(trackId) ? prev.filter(t => t !== trackId) : [...prev, trackId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="card p-4 sticky top-0 z-30 bg-void-800/95 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-void-700 border border-void-600 rounded-lg pl-9 pr-3 py-2 text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50"
            />
          </div>

          {/* Year Multi-select */}
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-void-700 border border-void-600 rounded-lg text-sm text-cream-100 hover:bg-void-600 transition-colors"
            >
              <span>Years: {selectedYears.length > 0 ? selectedYears.join(', ') : 'All'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showYearDropdown && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-void-800 border border-void-600 rounded-lg shadow-xl z-50 py-1">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => toggleYear(year)}
                    className={cn(
                      'w-full px-3 py-1.5 text-left text-sm hover:bg-void-700 transition-colors',
                      selectedYears.includes(year) ? 'text-flame-400' : 'text-cream-200'
                    )}
                  >
                    {selectedYears.includes(year) && '✓ '}{year}
                  </button>
                ))}
                <div className="border-t border-void-600 mt-1 pt-1">
                  <button
                    onClick={() => setSelectedYears([])}
                    className="w-full px-3 py-1.5 text-left text-sm text-cream-400 hover:bg-void-700"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Track Type */}
          <select
            value={selectedTrackType}
            onChange={e => {
              setSelectedTrackType(e.target.value as TrackType | 'all');
              setSelectedTracks([]);
            }}
            className="px-3 py-2 bg-void-700 border border-void-600 rounded-lg text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50"
          >
            {TRACK_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Track Multi-select */}
          <div className="relative">
            <button
              onClick={() => setShowTrackDropdown(!showTrackDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-void-700 border border-void-600 rounded-lg text-sm text-cream-100 hover:bg-void-600 transition-colors"
            >
              <span>
                {selectedTracks.length > 0
                  ? `${selectedTracks.length} track${selectedTracks.length > 1 ? 's' : ''}`
                  : 'All Tracks'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showTrackDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-void-800 border border-void-600 rounded-lg shadow-xl z-50 py-1">
                {filteredTracks.map(track => (
                  <button
                    key={track.id}
                    onClick={() => toggleTrack(track.id)}
                    className={cn(
                      'w-full px-3 py-1.5 text-left text-sm hover:bg-void-700 transition-colors truncate',
                      selectedTracks.includes(track.id) ? 'text-flame-400' : 'text-cream-200'
                    )}
                  >
                    {selectedTracks.includes(track.id) && '✓ '}{track.name}
                  </button>
                ))}
                {selectedTracks.length > 0 && (
                  <div className="border-t border-void-600 mt-1 pt-1">
                    <button
                      onClick={() => setSelectedTracks([])}
                      className="w-full px-3 py-1.5 text-left text-sm text-cream-400 hover:bg-void-700"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Range */}
          <select
            value={raceRange}
            onChange={e => setRaceRange(Number(e.target.value))}
            className="px-3 py-2 bg-void-700 border border-void-600 rounded-lg text-sm text-cream-100 focus:outline-none focus:ring-2 focus:ring-flame-500/50"
          >
            {RANGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Active filters indicator */}
          {(selectedYears.length > 0 || selectedTrackType !== 'all' || selectedTracks.length > 0) && (
            <button
              onClick={() => {
                setSelectedYears([]);
                setSelectedTrackType('all');
                setSelectedTracks([]);
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-flame-400 hover:text-flame-300"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* Filter summary */}
        <div className="mt-2 text-xs text-cream-500">
          Showing {sortedDriverStats.length} drivers • {sortedDriverStats.reduce((sum, d) => sum + d.stats.races, 0)} total race results
        </div>
      </div>

      {/* Data Grid */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-void-850 border-b border-void-700/50">
                {/* Driver Column - Sticky */}
                <th className="sticky left-0 z-20 bg-void-850 text-left px-4 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider min-w-[200px]">
                  <SortButton
                    label="Driver"
                    field="name"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>

                {/* Aggregate Stats */}
                <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                  <SortButton
                    label="Avg Start"
                    field="avgStart"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                  <SortButton
                    label="Avg Finish"
                    field="avgFinish"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                  <SortButton
                    label="Avg Rating"
                    field="avgRating"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                  <SortButton
                    label="Laps Led"
                    field="avgLapsLed"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-cream-500 uppercase tracking-wider">
                  <SortButton
                    label="Races"
                    field="races"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>

                {/* Recent Form - 10 columns */}
                <th
                  colSpan={10}
                  className="text-center px-3 py-3 text-xs font-semibold text-cream-400 uppercase tracking-wider border-l border-void-600"
                >
                  Recent Form (Filtered)
                </th>

                {/* Track History - 5 columns */}
                <th
                  colSpan={5}
                  className="text-center px-3 py-3 text-xs font-semibold text-mint-500 uppercase tracking-wider border-l border-void-600"
                >
                  History at {defaultTrackName.split(' ')[0]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-void-700/30">
              {sortedDriverStats.map((ds, idx) => (
                <DriverRow
                  key={ds.driver.id}
                  driverStats={ds}
                  rank={idx + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showYearDropdown || showTrackDropdown) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowYearDropdown(false);
            setShowTrackDropdown(false);
          }}
        />
      )}
    </div>
  );
}

// =============================================================================
// SORT BUTTON
// =============================================================================

function SortButton({
  label,
  field,
  currentField,
  direction,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        'inline-flex items-center gap-1 hover:text-cream-200 transition-colors',
        isActive && 'text-flame-400'
      )}
    >
      {label}
      {isActive && (
        direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      )}
    </button>
  );
}

// =============================================================================
// DRIVER ROW
// =============================================================================

interface DriverRowProps {
  driverStats: {
    driver: Driver;
    stats: AggregatedStats;
    recentRaces: RaceResult[];
    trackHistory: RaceResult[];
    totalRaces: number;
  };
  rank: number;
}

function DriverRow({ driverStats, rank }: DriverRowProps) {
  const { driver, stats, recentRaces, trackHistory } = driverStats;
  const hasData = stats.races > 0;

  return (
    <tr className={cn('hover:bg-void-700/30 transition-colors', !hasData && 'opacity-50')}>
      {/* Driver Info - Sticky */}
      <td className="sticky left-0 z-10 bg-void-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="w-6 text-xs font-mono text-cream-500">{rank}</span>
          <div className="driver-number w-8 h-8 text-xs">{driver.number}</div>
          <div className="min-w-0">
            <div className="font-semibold text-cream-100 truncate">{driver.name}</div>
            <div className="text-[10px] text-cream-500 truncate">{driver.team}</div>
          </div>
        </div>
      </td>

      {/* Aggregate Stats with Heatmap */}
      <td className="text-center px-3 py-2">
        <HeatmapCell value={stats.avgStart} type="position" />
      </td>
      <td className="text-center px-3 py-2">
        <HeatmapCell value={stats.avgFinish} type="position" />
      </td>
      <td className="text-center px-3 py-2">
        <HeatmapCell value={stats.avgRating} type="rating" />
      </td>
      <td className="text-center px-3 py-2">
        <HeatmapCell value={stats.avgLapsLed} type="lapsLed" />
      </td>
      <td className="text-center px-3 py-2 text-cream-400">
        {stats.races || '—'}
      </td>

      {/* Recent Form - 10 cells */}
      {[...Array(10)].map((_, i) => (
        <td key={i} className={cn('text-center px-1 py-2', i === 0 && 'border-l border-void-600')}>
          {recentRaces[i] ? (
            <RaceCell race={recentRaces[i]} />
          ) : (
            <span className="text-void-600">—</span>
          )}
        </td>
      ))}

      {/* Track History - 5 cells */}
      {[...Array(5)].map((_, i) => (
        <td key={i} className={cn('text-center px-1 py-2', i === 0 && 'border-l border-void-600')}>
          {trackHistory[i] ? (
            <RaceCell race={trackHistory[i]} />
          ) : (
            <span className="text-void-600">—</span>
          )}
        </td>
      ))}
    </tr>
  );
}

// =============================================================================
// HEATMAP CELL
// =============================================================================

function HeatmapCell({
  value,
  type,
}: {
  value: number;
  type: 'position' | 'rating' | 'lapsLed';
}) {
  if (!value || value === 0) {
    return <span className="text-void-500">—</span>;
  }

  let color: string;
  let bgColor: string;

  if (type === 'position') {
    // Lower is better for positions
    if (value <= 5) {
      color = 'text-green-400';
      bgColor = 'bg-green-500/20';
    } else if (value <= 10) {
      color = 'text-green-300';
      bgColor = 'bg-green-500/10';
    } else if (value <= 15) {
      color = 'text-cream-200';
      bgColor = 'bg-void-700/50';
    } else if (value <= 25) {
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/10';
    } else {
      color = 'text-red-400';
      bgColor = 'bg-red-500/10';
    }
  } else if (type === 'rating') {
    // Higher is better for rating
    if (value >= 110) {
      color = 'text-green-400';
      bgColor = 'bg-green-500/20';
    } else if (value >= 100) {
      color = 'text-green-300';
      bgColor = 'bg-green-500/10';
    } else if (value >= 85) {
      color = 'text-cream-200';
      bgColor = 'bg-void-700/50';
    } else if (value >= 70) {
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/10';
    } else {
      color = 'text-red-400';
      bgColor = 'bg-red-500/10';
    }
  } else {
    // Laps led - higher is better
    if (value >= 20) {
      color = 'text-green-400';
      bgColor = 'bg-green-500/20';
    } else if (value >= 10) {
      color = 'text-green-300';
      bgColor = 'bg-green-500/10';
    } else if (value >= 5) {
      color = 'text-cream-200';
      bgColor = 'bg-void-700/50';
    } else {
      color = 'text-cream-400';
      bgColor = '';
    }
  }

  return (
    <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold', color, bgColor)}>
      {value.toFixed(1)}
    </span>
  );
}

// =============================================================================
// RACE CELL WITH TOOLTIP
// =============================================================================

function RaceCell({ race }: { race: RaceResult }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Color based on finish position
  let bgColor: string;
  let textColor: string;

  if (race.finishPos === 1) {
    bgColor = 'bg-yellow-500/30';
    textColor = 'text-yellow-300';
  } else if (race.finishPos <= 5) {
    bgColor = 'bg-green-500/30';
    textColor = 'text-green-300';
  } else if (race.finishPos <= 10) {
    bgColor = 'bg-green-500/15';
    textColor = 'text-green-400';
  } else if (race.finishPos <= 15) {
    bgColor = 'bg-void-600';
    textColor = 'text-cream-200';
  } else if (race.finishPos <= 25) {
    bgColor = 'bg-orange-500/15';
    textColor = 'text-orange-400';
  } else {
    bgColor = 'bg-red-500/20';
    textColor = 'text-red-400';
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className={cn(
          'inline-block w-7 h-7 rounded flex items-center justify-center text-xs font-bold cursor-default',
          bgColor,
          textColor
        )}
      >
        {race.finishPos}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-void-900 border border-void-600 rounded-lg shadow-xl z-50 text-left">
          <div className="text-xs font-semibold text-cream-100 truncate">{race.raceName}</div>
          <div className="text-[10px] text-cream-500 mb-2">{formatDate(race.date)}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <div>
              <span className="text-cream-500">Started:</span>
              <span className="ml-1 text-cream-200">{race.startPos}</span>
            </div>
            <div>
              <span className="text-cream-500">Finished:</span>
              <span className={cn('ml-1 font-semibold', textColor)}>{race.finishPos}</span>
            </div>
            <div>
              <span className="text-cream-500">Laps Led:</span>
              <span className="ml-1 text-cream-200">{race.lapsLed}</span>
            </div>
            <div>
              <span className="text-cream-500">Rating:</span>
              <span className="ml-1 text-cream-200">{race.driverRating.toFixed(1)}</span>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-void-600" />
        </div>
      )}
    </div>
  );
}
