'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { OddsSnapshot, Sportsbook } from '@/types';
import { cn, formatOdds, formatImpliedProbability, formatMovement, abbreviateTeam } from '@/lib/utils';
import { sportsbooks } from '@/data/nascar';

// =============================================================================
// ODDS TABLE COMPONENT
// =============================================================================

interface OddsTableProps {
  odds: OddsSnapshot[];
  market?: string;
}

type SortField = 'bestOdds' | 'name' | 'number' | 'movement';
type SortDirection = 'asc' | 'desc';

const SPORTSBOOK_ORDER: Sportsbook[] = ['draftkings', 'fanduel', 'betmgm', 'caesars', 'betrivers'];

export function OddsTable({ odds, market = 'Race Winner' }: OddsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('bestOdds');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);

  // Filter and sort odds
  const filteredOdds = useMemo(() => {
    let result = [...odds];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.driverName.toLowerCase().includes(query) ||
          o.driverNumber.includes(query) ||
          o.team.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'bestOdds':
          comparison = a.bestOdds - b.bestOdds;
          break;
        case 'name':
          comparison = a.driverName.localeCompare(b.driverName);
          break;
        case 'number':
          comparison = parseInt(a.driverNumber) - parseInt(b.driverNumber);
          break;
        case 'movement':
          const aMove = a.movement24h?.change || 0;
          const bMove = b.movement24h?.change || 0;
          comparison = aMove - bMove;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [odds, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleDriverExpand = (driverId: string) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-track-50">{market} Odds</h2>
          <p className="text-sm text-track-400 mt-0.5">
            Compare odds across {SPORTSBOOK_ORDER.length} sportsbooks • Updated live
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-track-400" />
          <input
            type="text"
            placeholder="Search driver or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-track-600 bg-track-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-track-700/50">
                <th className="text-left text-xs font-semibold text-track-400 uppercase tracking-wider px-4 py-3 border-b border-track-600">
                  <button
                    onClick={() => handleSort('bestOdds')}
                    className="flex items-center gap-1 hover:text-track-200 transition-colors"
                  >
                    # Driver
                    <SortIcon field="bestOdds" current={sortField} direction={sortDirection} />
                  </button>
                </th>
                {SPORTSBOOK_ORDER.map((book) => (
                  <th
                    key={book}
                    className="text-center text-xs font-semibold uppercase tracking-wider px-3 py-3 border-b border-track-600 min-w-[80px]"
                    style={{ color: sportsbooks[book].color }}
                  >
                    {sportsbooks[book].shortName}
                  </th>
                ))}
                <th className="text-center text-xs font-semibold text-accent-green uppercase tracking-wider px-4 py-3 border-b border-track-600">
                  Best
                </th>
                <th className="text-center text-xs font-semibold text-track-400 uppercase tracking-wider px-4 py-3 border-b border-track-600">
                  <button
                    onClick={() => handleSort('movement')}
                    className="flex items-center gap-1 hover:text-track-200 transition-colors mx-auto"
                  >
                    24h
                    <SortIcon field="movement" current={sortField} direction={sortDirection} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOdds.map((driver, index) => (
                <tr
                  key={driver.driverId}
                  className={cn(
                    'transition-colors hover:bg-track-700/50',
                    index % 2 === 0 ? 'bg-track-800' : 'bg-track-800/50'
                  )}
                >
                  {/* Driver */}
                  <td className="px-4 py-3 border-b border-track-700">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-track-400 w-8">
                        #{driver.driverNumber}
                      </span>
                      <div>
                        <div className="font-semibold text-track-100">{driver.driverName}</div>
                        <div className="text-xs text-track-400">{abbreviateTeam(driver.team)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Odds for each book */}
                  {SPORTSBOOK_ORDER.map((book) => {
                    const bookOdds = driver.odds[book];
                    const isBest = bookOdds === driver.bestOdds;
                    return (
                      <td
                        key={book}
                        className="text-center px-3 py-3 border-b border-track-700"
                      >
                        {bookOdds ? (
                          <span
                            className={cn(
                              'font-mono text-odds-sm',
                              isBest ? 'text-accent-green font-bold' : 'text-track-200'
                            )}
                          >
                            {formatOdds(bookOdds)}
                          </span>
                        ) : (
                          <span className="text-track-500">—</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Best odds */}
                  <td className="text-center px-4 py-3 border-b border-track-700">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-odds font-bold text-accent-green">
                        {formatOdds(driver.bestOdds)}
                      </span>
                      <span className="text-[10px] text-track-400">
                        {formatImpliedProbability(driver.bestOdds)}
                      </span>
                    </div>
                  </td>

                  {/* 24h Movement */}
                  <td className="text-center px-4 py-3 border-b border-track-700">
                    <MovementBadge movement={driver.movement24h} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredOdds.map((driver) => (
          <MobileOddsCard
            key={driver.driverId}
            driver={driver}
            expanded={expandedDriver === driver.driverId}
            onToggle={() => toggleDriverExpand(driver.driverId)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredOdds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-track-400">No drivers found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function SortIcon({
  field,
  current,
  direction,
}: {
  field: SortField;
  current: SortField;
  direction: SortDirection;
}) {
  if (field !== current) {
    return <ArrowUpDown className="w-3 h-3 opacity-50" />;
  }
  return direction === 'asc' ? (
    <ArrowUp className="w-3 h-3" />
  ) : (
    <ArrowDown className="w-3 h-3" />
  );
}

function MovementBadge({ movement }: { movement?: OddsSnapshot['movement24h'] }) {
  if (!movement || movement.change === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-track-400 text-sm">
        <Minus className="w-3 h-3" />
      </span>
    );
  }

  const isPositive = movement.change > 0;
  
  // Note: In betting, odds going UP means WORSE for bettor (longer shot)
  // Odds going DOWN means BETTER for bettor (more favored)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium',
        isPositive ? 'text-accent-red' : 'text-accent-green'
      )}
    >
      {isPositive ? (
        <TrendingUp className="w-3.5 h-3.5" />
      ) : (
        <TrendingDown className="w-3.5 h-3.5" />
      )}
      <span>{Math.abs(movement.change)}</span>
    </span>
  );
}

function MobileOddsCard({
  driver,
  expanded,
  onToggle,
}: {
  driver: OddsSnapshot;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-track-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-track-400 w-8">
            #{driver.driverNumber}
          </span>
          <div className="text-left">
            <div className="font-semibold text-track-100">{driver.driverName}</div>
            <div className="text-xs text-track-400">{abbreviateTeam(driver.team)}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-accent-green">
              {formatOdds(driver.bestOdds)}
            </div>
            <div className="text-[10px] text-track-400 uppercase">
              Best @ {sportsbooks[driver.bestBook].shortName}
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-track-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-track-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-3 border-t border-track-600 bg-track-700/30">
          {/* All odds */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {SPORTSBOOK_ORDER.map((book) => {
              const bookOdds = driver.odds[book];
              const isBest = bookOdds === driver.bestOdds;
              return (
                <div
                  key={book}
                  className={cn(
                    'text-center py-2 px-2 rounded-lg',
                    isBest ? 'bg-accent-green/10 ring-1 ring-accent-green/30' : 'bg-track-700/50'
                  )}
                >
                  <div
                    className="text-[10px] font-semibold uppercase mb-0.5"
                    style={{ color: sportsbooks[book].color }}
                  >
                    {sportsbooks[book].shortName}
                  </div>
                  {bookOdds ? (
                    <div
                      className={cn(
                        'font-mono text-sm font-semibold',
                        isBest ? 'text-accent-green' : 'text-track-200'
                      )}
                    >
                      {formatOdds(bookOdds)}
                    </div>
                  ) : (
                    <div className="text-track-500 text-sm">—</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Movement and probability */}
          <div className="flex items-center justify-between pt-2 border-t border-track-600">
            <div className="flex items-center gap-2">
              <span className="text-xs text-track-400">24h Change:</span>
              <MovementBadge movement={driver.movement24h} />
            </div>
            <div className="text-xs text-track-400">
              Implied: {formatImpliedProbability(driver.bestOdds)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
