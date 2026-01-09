'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { OddsSnapshot, Sportsbook } from '@/types';
import { cn, formatOdds, formatImpliedProbability, abbreviateTeam } from '@/lib/utils';

// =============================================================================
// ODDS TABLE - The heart of TrackOdds
// =============================================================================

interface OddsTableProps {
  odds: OddsSnapshot[];
  market?: string;
}

const SPORTSBOOKS: { id: Sportsbook; name: string; shortName: string; color: string; bgColor: string }[] = [
  { id: 'draftkings', name: 'DraftKings', shortName: 'DK', color: '#53d337', bgColor: 'bg-[#53d337]/10' },
  { id: 'fanduel', name: 'FanDuel', shortName: 'FD', color: '#1493ff', bgColor: 'bg-[#1493ff]/10' },
  { id: 'betmgm', name: 'BetMGM', shortName: 'MGM', color: '#b8860b', bgColor: 'bg-[#b8860b]/10' },
  { id: 'caesars', name: 'Caesars', shortName: 'CZR', color: '#00843d', bgColor: 'bg-[#00843d]/10' },
  { id: 'betrivers', name: 'BetRivers', shortName: 'BR', color: '#1a73e8', bgColor: 'bg-[#1a73e8]/10' },
];

export function OddsTable({ odds, market = 'Race Winner' }: OddsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filteredOdds = useMemo(() => {
    if (!searchQuery) return odds;
    const query = searchQuery.toLowerCase();
    return odds.filter(
      (o) =>
        o.driverName.toLowerCase().includes(query) ||
        o.driverNumber.includes(query) ||
        o.team.toLowerCase().includes(query)
    );
  }, [odds, searchQuery]);

  // Count drivers with odds (0 means no odds, negative odds are valid)
  const driversWithOdds = filteredOdds.filter(d => d.bestOdds !== 0).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-display text-display-md text-cream-50">{market}</h2>
            <span className="badge-flame">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
          <p className="text-sm text-cream-400">
            Comparing {SPORTSBOOKS.length} sportsbooks • {driversWithOdds} drivers with odds
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 text-sm"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="card overflow-hidden">
          {/* Sportsbook header */}
          <div className="flex items-center gap-1 px-4 py-3 bg-void-850 border-b border-void-700/50">
            <div className="w-64 text-xs font-semibold text-cream-400 uppercase tracking-wider">
              Driver
            </div>
            <div className="flex-1 grid grid-cols-5 gap-1">
              {SPORTSBOOKS.map((book) => (
                <div
                  key={book.id}
                  className="text-center"
                >
                  <span
                    className="inline-flex items-center justify-center w-10 h-6 rounded-md text-xs font-bold"
                    style={{ backgroundColor: `${book.color}20`, color: book.color }}
                  >
                    {book.shortName}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-28 text-center text-xs font-semibold text-mint-500 uppercase tracking-wider">
              Best Odds
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-void-700/30">
            {filteredOdds.map((driver, index) => (
              <DesktopRow
                key={driver.driverId}
                driver={driver}
                index={index}
                isHovered={hoveredRow === driver.driverId}
                onHover={() => setHoveredRow(driver.driverId)}
                onLeave={() => setHoveredRow(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2">
        {filteredOdds.map((driver, index) => (
          <MobileCard
            key={driver.driverId}
            driver={driver}
            index={index}
            expanded={expandedDriver === driver.driverId}
            onToggle={() => setExpandedDriver(expandedDriver === driver.driverId ? null : driver.driverId)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredOdds.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-cream-400">No drivers found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-sm text-flame-500 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// DESKTOP ROW
// =============================================================================

function DesktopRow({
  driver,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  driver: OddsSnapshot;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const hasOdds = driver.bestOdds !== 0;

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-4 py-3 transition-all duration-200',
        isHovered && 'bg-void-700/30',
        !hasOdds && 'opacity-50'
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Driver info */}
      <div className="w-64 flex items-center gap-3">
        {/* Rank */}
        <span className="w-6 text-sm font-mono text-cream-500">
          {hasOdds ? index + 1 : '—'}
        </span>

        {/* Number badge */}
        <div className={cn(
          'driver-number',
          index < 3 && hasOdds && 'driver-number-featured'
        )}>
          {driver.driverNumber}
        </div>

        {/* Name & Team - Link to driver page */}
        <Link
          href={`/driver/${driver.driverId}`}
          className="min-w-0 text-left group"
        >
          <div className="font-semibold text-cream-100 truncate group-hover:text-flame-400 transition-colors">
            {driver.driverName}
          </div>
          <div className="text-xs text-cream-500 truncate">
            {abbreviateTeam(driver.team)}
          </div>
        </Link>
      </div>

      {/* Odds grid */}
      <div className="flex-1 grid grid-cols-5 gap-1">
        {SPORTSBOOKS.map((book) => {
          const bookOdds = driver.odds[book.id];
          const isBest = bookOdds && bookOdds === driver.bestOdds;

          return (
            <div key={book.id} className="odds-cell">
              {bookOdds ? (
                <span
                  className={cn(
                    'odds-value text-odds-md',
                    isBest ? 'odds-best' : 'text-cream-200'
                  )}
                >
                  {formatOdds(bookOdds)}
                </span>
              ) : (
                <span className="text-void-500">—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Best odds */}
      <div className="w-28 text-center">
        {hasOdds ? (
          <div className="inline-flex flex-col items-center">
            <span className="odds-value text-odds-lg odds-best">
              {formatOdds(driver.bestOdds)}
            </span>
            <span className="text-[10px] text-cream-500 mt-0.5">
              {formatImpliedProbability(driver.bestOdds)}
            </span>
          </div>
        ) : (
          <span className="text-void-500">—</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MOBILE CARD
// =============================================================================

function MobileCard({
  driver,
  index,
  expanded,
  onToggle,
}: {
  driver: OddsSnapshot;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasOdds = driver.bestOdds !== 0;

  return (
    <div className={cn('card overflow-hidden', !hasOdds && 'opacity-50')}>
      {/* Header - always visible */}
      <div className="w-full p-4 flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          {/* Rank */}
          <span className="w-5 text-sm font-mono text-cream-500">
            {hasOdds ? index + 1 : '—'}
          </span>

          {/* Number badge */}
          <div className={cn(
            'driver-number',
            index < 3 && hasOdds && 'driver-number-featured'
          )}>
            {driver.driverNumber}
          </div>

          {/* Name & Team - Link to driver page */}
          <Link
            href={`/driver/${driver.driverId}`}
            className="text-left"
          >
            <div className="font-semibold text-cream-100 hover:text-flame-400 transition-colors">
              {driver.driverName}
            </div>
            <div className="text-xs text-cream-500">
              {abbreviateTeam(driver.team)}
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {hasOdds && (
            <div className="text-right">
              <div className="odds-value text-odds-lg odds-best">
                {formatOdds(driver.bestOdds)}
              </div>
              <div className="text-[10px] text-cream-500">
                Best odds
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-void-700 transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-cream-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-cream-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && hasOdds && (
        <div className="px-4 pb-4 pt-2 border-t border-void-700/50 animate-fade-in">
          <div className="grid grid-cols-3 gap-2">
            {SPORTSBOOKS.map((book) => {
              const bookOdds = driver.odds[book.id];
              const isBest = bookOdds && bookOdds === driver.bestOdds;

              return (
                <div
                  key={book.id}
                  className={cn(
                    'text-center py-2.5 px-2 rounded-xl transition-all',
                    isBest
                      ? 'bg-mint-500/10 ring-1 ring-mint-500/30'
                      : 'bg-void-700/50'
                  )}
                >
                  <div
                    className="text-[10px] font-bold uppercase mb-1"
                    style={{ color: book.color }}
                  >
                    {book.shortName}
                  </div>
                  {bookOdds ? (
                    <div className={cn(
                      'odds-value text-odds-sm',
                      isBest ? 'odds-best' : 'text-cream-200'
                    )}>
                      {formatOdds(bookOdds)}
                    </div>
                  ) : (
                    <div className="text-void-500 text-sm">—</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Implied probability */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-void-700/50">
            <span className="text-xs text-cream-500">Implied Probability</span>
            <span className="text-sm font-semibold text-cream-200">
              {formatImpliedProbability(driver.bestOdds)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
