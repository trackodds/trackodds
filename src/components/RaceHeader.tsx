'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Tv, Clock, Flag } from 'lucide-react';
import { Race } from '@/types';
import { getCountdown, formatRaceDate, formatRaceTime } from '@/lib/utils';

// =============================================================================
// RACE HEADER COMPONENT
// =============================================================================

interface RaceHeaderProps {
  race: Race;
}

export function RaceHeader({ race }: RaceHeaderProps) {
  const [countdown, setCountdown] = useState(getCountdown(race.scheduledDate));

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(race.scheduledDate));
    }, 60000);
    return () => clearInterval(interval);
  }, [race.scheduledDate]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-track-800 via-track-800 to-track-700 border border-track-600">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Accent gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-green/5 to-transparent" />
      
      <div className="relative px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Race Info */}
          <div className="flex-1">
            {/* Series badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20 mb-3">
              <Flag className="w-3.5 h-3.5 text-accent-green" />
              <span className="text-xs font-semibold text-accent-green uppercase tracking-wide">
                {race.series} Series
              </span>
            </div>
            
            {/* Race name */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-track-50 mb-2">
              {race.name}
            </h1>
            
            {/* Track info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-track-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-track-400" />
                <span>{race.track.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-track-400" />
                <span>{formatRaceDate(race.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-track-400" />
                <span>{race.scheduledTime || formatRaceTime(race.scheduledDate)}</span>
              </div>
              {race.tvNetwork && (
                <div className="flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-track-400" />
                  <span>{race.tvNetwork}</span>
                </div>
              )}
            </div>
            
            {/* Track details */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 rounded bg-track-700/50 text-xs font-medium text-track-300">
                {race.track.length} mi
              </span>
              <span className="px-2 py-1 rounded bg-track-700/50 text-xs font-medium text-track-300 capitalize">
                {race.track.type.replace('-', ' ')}
              </span>
              <span className="px-2 py-1 rounded bg-track-700/50 text-xs font-medium text-track-300">
                {race.laps} Laps
              </span>
              <span className="px-2 py-1 rounded bg-track-700/50 text-xs font-medium text-track-300">
                {race.distance} Miles
              </span>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="flex-shrink-0">
            {countdown.isLive ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-accent-green/10 border border-accent-green/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
                  </span>
                  <span className="text-lg font-bold text-accent-green uppercase tracking-wide">
                    Race Live
                  </span>
                </div>
                <span className="text-sm text-track-300">Race in progress</span>
              </div>
            ) : countdown.isPast ? (
              <div className="text-center p-6 rounded-xl bg-track-700/50 border border-track-600">
                <span className="text-sm font-medium text-track-400">Race Complete</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-xs font-medium text-track-400 uppercase tracking-wider mb-2 block">
                  Race Starts In
                </span>
                <div className="flex items-center gap-3">
                  <CountdownUnit value={countdown.days} label="Days" />
                  <span className="text-2xl font-light text-track-500">:</span>
                  <CountdownUnit value={countdown.hours} label="Hrs" />
                  <span className="text-2xl font-light text-track-500">:</span>
                  <CountdownUnit value={countdown.minutes} label="Min" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COUNTDOWN UNIT SUBCOMPONENT
// =============================================================================

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-track-700 border border-track-600 flex items-center justify-center">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-track-50">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs font-medium text-track-400 mt-1.5 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
