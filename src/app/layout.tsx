import type { Metadata, Viewport } from 'next';
import './globals.css';

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'TrackOdds - NASCAR Betting Odds Comparison',
    template: '%s | TrackOdds',
  },
  description:
    'Compare NASCAR Cup Series betting odds across DraftKings, FanDuel, BetMGM, and more. Real-time odds, line movement tracking, and race analytics for smart bettors.',
  keywords: [
    'NASCAR betting odds',
    'NASCAR odds comparison',
    'Daytona 500 odds',
    'NASCAR DFS',
    'NASCAR betting',
    'Cup Series odds',
    'NASCAR line movement',
    'NASCAR analytics',
  ],
  authors: [{ name: 'TrackOdds' }],
  creator: 'TrackOdds',
  publisher: 'TrackOdds',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trackodds.io',
    siteName: 'TrackOdds',
    title: 'TrackOdds - NASCAR Betting Odds Comparison',
    description:
      'Compare NASCAR Cup Series betting odds across all major sportsbooks. Real-time odds, line movement, and analytics.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrackOdds - NASCAR Betting Odds Comparison',
    description: 'Compare NASCAR odds across all major sportsbooks.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-track-900 antialiased">
        {children}
      </body>
    </html>
  );
}
