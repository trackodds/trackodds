'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, TrendingUp, Calendar, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// HEADER COMPONENT
// =============================================================================

const navigation = [
  { name: 'Odds', href: '/', icon: TrendingUp },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Stats', href: '/stats', icon: BarChart3 },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-track-600 bg-track-900/95 backdrop-blur supports-[backdrop-filter]:bg-track-900/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            {/* Logo icon - stylized checkered flag */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-green to-accent-green/70 flex items-center justify-center shadow-lg group-hover:shadow-accent-green/25 transition-shadow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-track-900"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h4v4H3V4zm7 0h4v4h-4V4zm7 0h4v4h-4V4zM3 11h4v4H3v-4zm14 0h4v4h-4v-4zM3 18h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-track-50">
              Track<span className="text-accent-green">Odds</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-track-400 -mt-1">
              NASCAR Betting
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'text-track-300 hover:text-track-50 hover:bg-track-700'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side - Search and actions */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-track-800 border border-track-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-xs font-medium text-track-300">Live Odds</span>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-track-300 hover:text-track-50 hover:bg-track-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-track-600 bg-track-800">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-track-200 hover:text-track-50 hover:bg-track-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 text-track-400" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
