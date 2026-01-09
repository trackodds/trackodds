# 🏁 TrackOdds.io

> The definitive NASCAR betting odds comparison platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

## 🎯 Vision

TrackOdds is building the BestFightOdds for NASCAR. We compare real-time betting odds across all major sportsbooks, track line movements, and provide the analytics serious NASCAR bettors need.

**Launch Target: Daytona 500 (February 16, 2025)**

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/trackodds.git
cd trackodds

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase URL and anon key from your project settings
4. The app will display a clear error if environment variables are missing

## 📁 Project Structure

```
trackodds/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Homepage (odds comparison)
│   │   └── globals.css      # Global styles & design system
│   │
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── RaceHeader.tsx   # Race info & countdown
│   │   ├── OddsTable.tsx    # Main odds comparison table
│   │   ├── SharpAlerts.tsx  # Line movement alerts
│   │   └── index.ts         # Component exports
│   │
│   ├── data/                # Static data & mock data
│   │   ├── nascar.ts        # Drivers, tracks, schedules
│   │   └── mock-odds.ts     # Mock odds for development
│   │
│   ├── lib/                 # Utilities & helpers
│   │   └── utils.ts         # Formatting, calculations
│   │
│   └── types/               # TypeScript definitions
│       └── index.ts         # All type definitions
│
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies & scripts
```

## 🎨 Design System

### Colors

```css
/* Core palette - dark, professional */
--track-900: #0a0a0f;    /* Main background */
--track-800: #12121a;    /* Card backgrounds */
--track-700: #1a1a25;    /* Elevated surfaces */

/* Accents */
--accent-green: #22c55e; /* Best odds, positive */
--accent-red: #ef4444;   /* Negative movement */
--accent-orange: #f97316; /* Alerts, trending */

/* Sportsbook colors */
--book-draftkings: #53d337;
--book-fanduel: #1493ff;
--book-betmgm: #c4a962;
```

### Typography

- **Display**: Outfit (headers, brand)
- **Body**: Manrope (readable text)
- **Mono**: JetBrains Mono (odds, numbers)

## 🛠 Development Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Project scaffolding
- [x] Type definitions
- [x] Component architecture
- [x] Mock data for all Cup Series drivers
- [x] Responsive odds table
- [x] Line movement alerts
- [x] Dark theme design system

### Phase 2: Data Pipeline (Days 8-18)
- [ ] DraftKings odds scraper
- [ ] FanDuel odds scraper
- [ ] BetMGM odds scraper
- [ ] Caesars odds scraper
- [ ] Historical odds storage
- [ ] Automated 15-minute updates

### Phase 3: Polish (Days 19-28)
- [ ] Line movement charts (Recharts)
- [ ] Driver detail pages
- [ ] Head-to-head matchup odds
- [ ] Top 5/10/20 finish odds
- [ ] Stage winner odds
- [ ] Mobile optimization

### Phase 4: Launch (Days 29-38)
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] Analytics integration
- [ ] Soft launch to r/NASCAR
- [ ] Daytona 500 content

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy (zero configuration needed)

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables

```env
# Database (when ready)
DATABASE_URL="postgresql://..."

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXX"
```

## 📊 Data Sources

### Odds Scrapers (To Be Built)

The scrapers will target these endpoints:
- **DraftKings**: Sportsbook racing section
- **FanDuel**: NASCAR futures/race odds
- **BetMGM**: Motorsports section
- **Caesars**: NASCAR betting
- **BetRivers**: Auto racing

### NASCAR Data

For driver stats, we can potentially use:
- NASCAR.com official data
- Racing Reference (historical)
- Loop data from NASCAR

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

TrackOdds is for informational purposes only. We do not facilitate gambling. Users must be 21+ and in a legal jurisdiction to place bets. Please gamble responsibly.

---

**Built with 🏁 for NASCAR bettors**
