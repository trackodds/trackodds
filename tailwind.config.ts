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
        // Deep, rich darks - not pure black
        void: {
          950: '#0a0908',    // Deepest - almost black with warmth
          900: '#0f0d0b',    // Main background
          850: '#141210',    // Slightly elevated
          800: '#1a1714',    // Cards
          700: '#252019',    // Borders, elevated
          600: '#332b22',    // Muted elements
          500: '#4a3f32',    // Disabled states
        },
        // Cream/warm whites for text
        cream: {
          50: '#fefdfb',     // Pure cream white
          100: '#faf8f5',    // Primary text
          200: '#f0ebe3',    // Secondary text
          300: '#d9d0c3',    // Muted text
          400: '#b8a994',    // Very muted
          500: '#8c7a63',    // Disabled text
        },
        // Signature orange-red - the soul of the brand
        flame: {
          300: '#ffb088',    // Light - highlights
          400: '#ff8a5c',    // Hover states
          500: '#ff6b35',    // PRIMARY - main accent
          600: '#e85a2a',    // Active states
          700: '#c44a22',    // Dark variant
        },
        // Racing red for contrast moments
        race: {
          400: '#ff5555',
          500: '#e63946',    // Secondary accent
          600: '#c1121f',
        },
        // Success green for best odds
        mint: {
          400: '#6ee7b7',
          500: '#34d399',
          600: '#10b981',
        },
        // Sportsbook brand colors
        book: {
          draftkings: '#53d337',
          fanduel: '#1493ff',
          betmgm: '#b8860b',
          caesars: '#00843d',
          betrivers: '#1a73e8',
          pointsbet: '#f94f6d',
        },
      },
      fontFamily: {
        // Sharp, modern display font
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // Clean body font
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        // Monospace for odds
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'odds-lg': ['1.5rem', { lineHeight: '1', fontWeight: '700' }],
        'odds-md': ['1.125rem', { lineHeight: '1', fontWeight: '600' }],
        'odds-sm': ['0.875rem', { lineHeight: '1', fontWeight: '600' }],
      },
      backgroundImage: {
        // Gradient meshes for depth
        'mesh-1': 'radial-gradient(at 40% 20%, rgba(255, 107, 53, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(230, 57, 70, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 138, 92, 0.1) 0px, transparent 50%)',
        'mesh-2': 'radial-gradient(at 100% 100%, rgba(255, 107, 53, 0.1) 0px, transparent 40%), radial-gradient(at 0% 0%, rgba(230, 57, 70, 0.05) 0px, transparent 50%)',
        // Carbon fiber texture
        'carbon': `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M5 0h1L0 5v1zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
        // Noise texture
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
      },
      boxShadow: {
        'glow-flame': '0 0 30px -5px rgba(255, 107, 53, 0.3)',
        'glow-flame-lg': '0 0 60px -10px rgba(255, 107, 53, 0.4)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'number-tick': 'numberTick 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px -5px rgba(255, 107, 53, 0.2)' },
          '100%': { boxShadow: '0 0 30px -5px rgba(255, 107, 53, 0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        numberTick: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
