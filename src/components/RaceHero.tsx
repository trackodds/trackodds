'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Tv, Flag, Clock } from 'lucide-react';
import { Race } from '@/types';
import { formatRaceDate } from '@/lib/utils';

// =============================================================================
// RACE HERO - Visual impact with live countdown
// =============================================================================

interface RaceHeroProps {
  race: Race;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
}

function getCountdownWithSeconds(targetDate: Date): CountdownState {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff < 0) {
    const hoursSinceStart = Math.abs(diff) / (1000 * 60 * 60);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: hoursSinceStart < 4,
      isPast: hoursSinceStart >= 4,
    };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isLive: false, isPast: false };
}

export function RaceHero({ race }: RaceHeroProps) {
  const [countdown, setCountdown] = useState<CountdownState>(getCountdownWithSeconds(race.scheduledDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownWithSeconds(race.scheduledDate));
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, [race.scheduledDate]);

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-mesh-1" />
      <div className="absolute inset-0 bg-gradient-to-b from-void-900/50 via-transparent to-void-900" />
      
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-flame-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-race-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

      <div className="relative pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            
            {/* Left: Race Info */}
            <div className="flex-1 max-w-2xl">
              {/* Series badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-flame-500/10 border border-flame-500/20 mb-4 animate-fade-in">
                <Flag className="w-3.5 h-3.5 text-flame-400" />
                <span className="text-xs font-semibold text-flame-400 uppercase tracking-wide">
                  {race.series} Series • Season Opener
                </span>
              </div>

              {/* Race name - BIG and bold */}
              <h1 className="font-display text-display-lg sm:text-display-xl text-cream-50 mb-4 animate-slide-up">
                {race.name}
              </h1>

              {/* Track name */}
              <p className="text-lg sm:text-xl text-cream-300 mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
                {race.track.name}
              </p>

              {/* Meta info pills */}
              <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <InfoPill icon={Calendar} text={formatRaceDate(race.scheduledDate)} />
                <InfoPill icon={Clock} text={race.scheduledTime || '2:30 PM ET'} />
                <InfoPill icon={Tv} text={race.tvNetwork || 'FOX'} />
                <InfoPill icon={MapPin} text={race.track.location} />
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-void-700/50 animate-slide-up" style={{ animationDelay: '150ms' }}>
                <QuickStat label="Distance" value="500 mi" />
                <QuickStat label="Laps" value="200" />
                <QuickStat label="Track" value="2.5 mi" />
              </div>
            </div>

            {/* Right: Countdown */}
            <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {countdown.isLive ? (
                <LiveIndicator />
              ) : (
                <CountdownDisplay countdown={countdown} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-void-900 to-transparent pointer-events-none" />
    </section>
  );
}

// =============================================================================
// SUB COMPONENTS
// =============================================================================

function InfoPill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void-800/80 border border-void-700/50 text-sm text-cream-300">
      <Icon className="w-3.5 h-3.5 text-cream-400" />
      <span>{text}</span>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl font-bold text-cream-50">{value}</div>
      <div className="text-xs text-cream-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function CountdownDisplay({ countdown }: { countdown: CountdownState }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium text-cream-400 uppercase tracking-wider mb-3">
        Green Flag In
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <CountdownUnit value={countdown.days} label="Days" />
        <CountdownSeparator />
        <CountdownUnit value={countdown.hours} label="Hrs" />
        <CountdownSeparator />
        <CountdownUnit value={countdown.minutes} label="Min" />
        <CountdownSeparator />
        <CountdownUnit value={countdown.seconds} label="Sec" highlight />
      </div>
    </div>
  );
}

function CountdownUnit({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`
        relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden
        ${highlight 
          ? 'bg-gradient-to-br from-flame-500/20 to-flame-600/10 border border-flame-500/30' 
          : 'bg-void-800 border border-void-700/50'}
      `}>
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <span className={`
          font-mono text-xl sm:text-2xl font-bold
          ${highlight ? 'text-flame-400' : 'text-cream-50'}
        `}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-medium text-cream-500 uppercase tracking-wider mt-2">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <span className="text-xl font-bold text-void-600 self-start mt-4">:</span>
  );
}

function LiveIndicator() {
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-mint-500/10 to-mint-500/5 border border-mint-500/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-mint-500"></span>
        </span>
        <span className="text-lg font-display font-bold text-mint-400 uppercase">
          Race Live
        </span>
      </div>
      <span className="text-sm text-cream-400">Race in progress</span>
    </div>
  );
}