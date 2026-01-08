'use client';

import { TrendingDown, TrendingUp, Flame, AlertTriangle } from 'lucide-react';
import { OddsSnapshot } from '@/types';
import { cn, formatOdds, abbreviateTeam } from '@/lib/utils';

// =============================================================================
// SHARP ALERTS COMPONENT
// =============================================================================

interface SharpAlertsProps {
  odds: OddsSnapshot[];
}

export function SharpAlerts({ odds }: SharpAlertsProps) {
  // Find significant movements (>10% change)
  const significantMoves = odds
    .filter((o) => o.movement24h && Math.abs(o.movement24h.percentChange) > 10)
    .sort((a, b) => {
      const aChange = Math.abs(a.movement24h?.percentChange || 0);
      const bChange = Math.abs(b.movement24h?.percentChange || 0);
      return bChange - aChange;
    })
    .slice(0, 5);

  if (significantMoves.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-accent-orange/30 bg-gradient-to-br from-accent-orange/5 to-transparent p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent-orange/10">
          <Flame className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-track-50">Line Movement Alerts</h3>
          <p className="text-xs text-track-400">Significant odds changes in the last 24 hours</p>
        </div>
      </div>

      <div className="space-y-2">
        {significantMoves.map((driver) => (
          <MovementAlert key={driver.driverId} driver={driver} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MOVEMENT ALERT ITEM
// =============================================================================

function MovementAlert({ driver }: { driver: OddsSnapshot }) {
  const movement = driver.movement24h!;
  const isShortening = movement.direction === 'down'; // Odds going down = getting more favored
  
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg',
        isShortening ? 'bg-accent-green/5' : 'bg-accent-red/5'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'p-1.5 rounded',
            isShortening ? 'bg-accent-green/10' : 'bg-accent-red/10'
          )}
        >
          {isShortening ? (
            <TrendingDown className="w-4 h-4 text-accent-green" />
          ) : (
            <TrendingUp className="w-4 h-4 text-accent-red" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-track-400">#{driver.driverNumber}</span>
            <span className="font-semibold text-track-100">{driver.driverName}</span>
          </div>
          <span className="text-xs text-track-400">{abbreviateTeam(driver.team)}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <span className="text-sm text-track-400 line-through">
            {formatOdds(movement.open)}
          </span>
          <span className="text-track-500">→</span>
          <span
            className={cn(
              'font-mono text-sm font-bold',
              isShortening ? 'text-accent-green' : 'text-accent-red'
            )}
          >
            {formatOdds(movement.current)}
          </span>
        </div>
        <span
          className={cn(
            'text-xs font-medium',
            isShortening ? 'text-accent-green' : 'text-accent-red'
          )}
        >
          {isShortening ? '↓' : '↑'} {Math.abs(movement.percentChange).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// STEAM MOVE INDICATOR (for dramatic movements)
// =============================================================================

interface SteamMoveProps {
  driver: OddsSnapshot;
  size?: 'sm' | 'md';
}

export function SteamMove({ driver, size = 'md' }: SteamMoveProps) {
  const movement = driver.movement24h;
  
  if (!movement || Math.abs(movement.percentChange) < 15) {
    return null;
  }
  
  const isShortening = movement.direction === 'down';
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full animate-pulse',
        isShortening ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red',
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}
    >
      <Flame className={cn(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
      <span className="font-semibold">
        {isShortening ? 'Steam' : 'Drift'}
      </span>
    </div>
  );
}
