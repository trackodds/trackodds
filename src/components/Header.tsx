'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Flame, Calendar, BarChart2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// HEADER - Sleek, purposeful navigation
// =============================================================================

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-void-900/90 backdrop-blur-xl border-b border-void-700/50' 
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Icon mark */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-flame-500 to-race-500 flex items-center justify-center shadow-lg shadow-flame-500/20 group-hover:shadow-flame-500/40 transition-shadow">
                <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-flame-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* Wordmark */}
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-cream-50">
                TRACK<span className="text-flame-500">ODDS</span>
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-cream-400 uppercase">
                NASCAR Betting
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={Zap} active>Odds</NavLink>
            <NavLink href="/schedule" icon={Calendar}>Schedule</NavLink>
            <NavLink href="/stats" icon={BarChart2}>Stats</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="hidden sm:flex live-pulse text-xs font-medium text-cream-300">
              <span>Live</span>
            </div>
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-void-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-void-700/50 animate-fade-in">
            <div className="flex flex-col gap-1">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Odds</MobileNavLink>
              <MobileNavLink href="/schedule" onClick={() => setMobileMenuOpen(false)}>Schedule</MobileNavLink>
              <MobileNavLink href="/stats" onClick={() => setMobileMenuOpen(false)}>Stats</MobileNavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// =============================================================================
// NAV LINKS
// =============================================================================

function NavLink({ 
  href, 
  icon: Icon, 
  active, 
  children 
}: { 
  href: string; 
  icon: React.ElementType;
  active?: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'bg-void-700 text-cream-50'
          : 'text-cream-400 hover:text-cream-100 hover:bg-void-800'
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}

function MobileNavLink({ 
  href, 
  onClick, 
  children 
}: { 
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-cream-200 hover:text-cream-50 hover:bg-void-700 transition-colors"
    >
      {children}
    </Link>
  );
}
