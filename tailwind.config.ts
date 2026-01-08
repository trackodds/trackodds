import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core brand colors - inspired by racing, but sophisticated
        track: {
          900: '#0a0a0f',    // Deepest black - main background
          800: '#12121a',    // Card backgrounds
          700: '#1a1a25',    // Elevated surfaces
          600: '#252530',    // Borders, dividers
          500: '#3a3a4a',    // Muted text
          400: '#6a6a7a',    // Secondary text
          300: '#9a9aaa',    // Tertiary text
          200: '#cacada',    // Primary text
          100: '#eaeafa',    // Bright text
          50: '#ffffff',     // Pure white
        },
        // Accent colors for data visualization and CTAs
        accent: {
          green: '#22c55e',   // Positive movement, best odds
          red: '#ef4444',     // Negative movement
          yellow: '#eab308',  // Warnings, neutral
          blue: '#3b82f6',    // Links, interactive
          purple: '#8b5cf6',  // Featured, premium
          orange: '#f97316',  // Hot/trending
        },
        // Sportsbook brand colors for recognition
        book: {
          draftkings: '#53d337',
          fanduel: '#1493ff',
          betmgm: '#c4a962',
          caesars: '#0a3d2a',
          betrivers: '#ff6b35',
          pointsbet: '#ed1c24',
        },
      },
      fontFamily: {
        // Sharp, modern display font for headers
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // Clean, readable body font
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        // Monospace for odds/numbers
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Custom scale optimized for data density
        'odds': ['1.125rem', { lineHeight: '1.25', fontWeight: '600' }],
        'odds-sm': ['0.9375rem', { lineHeight: '1.25', fontWeight: '600' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)' },
        },
      },
      backgroundImage: {
        // Subtle gradient overlays
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-track': 'linear-gradient(135deg, #12121a 0%, #0a0a0f 100%)',
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a25' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};

export default config;
