'use client';

import { useState } from 'react';

// Simple password protection (not secure for production, but fine for now)
const ADMIN_PASSWORD = 'trackodds2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Wrong password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-track-900 flex items-center justify-center p-4">
        <div className="card p-8 w-full max-w-md">
          <h1 className="font-display text-2xl font-bold text-track-50 mb-6 text-center">
            TrackOdds Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-track-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <p className="text-accent-red text-sm">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-track-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-track-50">
            TrackOdds Admin
          </h1>
          <a href="/" className="btn-secondary">
            ← Back to Site
          </a>
        </div>

        {/* Quick Guide */}
        <div className="card p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-track-50 mb-4">
            📝 How to Update Odds
          </h2>
          <div className="space-y-3 text-track-300">
            <p>
              <strong className="text-track-100">1. Go to Supabase:</strong>{' '}
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent-green hover:underline"
              >
                supabase.com/dashboard
              </a>
            </p>
            <p>
              <strong className="text-track-100">2. Click "Table Editor"</strong> in the left sidebar
            </p>
            <p>
              <strong className="text-track-100">3. Click "odds"</strong> table
            </p>
            <p>
              <strong className="text-track-100">4. Click "Insert" → "Insert Row"</strong> to add new odds
            </p>
            <p>
              <strong className="text-track-100">5. Fill in:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li><code className="bg-track-700 px-1 rounded">driver_id</code> - e.g., "kyle-larson"</li>
              <li><code className="bg-track-700 px-1 rounded">race_id</code> - "daytona-500-2026"</li>
              <li><code className="bg-track-700 px-1 rounded">sportsbook</code> - "draftkings", "fanduel", or "betmgm"</li>
              <li><code className="bg-track-700 px-1 rounded">market</code> - "race_winner"</li>
              <li><code className="bg-track-700 px-1 rounded">odds</code> - The American odds number (e.g., 800 for +800)</li>
            </ul>
          </div>
        </div>

        {/* Driver IDs Reference */}
        <div className="card p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-track-50 mb-4">
            🏎️ Driver IDs Reference
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            {[
              'kyle-larson',
              'chase-elliott', 
              'william-byron',
              'alex-bowman',
              'denny-hamlin',
              'christopher-bell',
              'ty-gibbs',
              'chase-briscoe',
              'joey-logano',
              'ryan-blaney',
              'austin-cindric',
              'ross-chastain',
              'connor-zilisch',
              'shane-van-gisbergen',
              'bubba-wallace',
              'tyler-reddick',
              'kyle-busch',
              'austin-dillon',
              'brad-keselowski',
              'chris-buescher',
              'ryan-preece',
              'cole-custer',
              'daniel-suarez',
              'carson-hocevar',
              'erik-jones',
              'john-hunter-nemechek',
              'michael-mcdowell',
              'todd-gilliland',
              'zane-smith',
              'josh-berry',
              'ricky-stenhouse-jr',
              'ty-dillon',
              'aj-allmendinger',
              'cody-ware',
            ].map((id) => (
              <code key={id} className="bg-track-700 px-2 py-1 rounded text-track-200">
                {id}
              </code>
            ))}
          </div>
        </div>

        {/* Quick SQL Templates */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-track-50 mb-4">
            ⚡ Quick SQL Templates
          </h2>
          <p className="text-track-400 text-sm mb-4">
            Copy these to Supabase SQL Editor to bulk update odds:
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-track-200 font-semibold mb-2">Add single odds:</h3>
              <pre className="bg-track-700 p-3 rounded text-xs text-track-300 overflow-x-auto">
{`INSERT INTO odds (driver_id, race_id, sportsbook, market, odds)
VALUES ('kyle-larson', 'daytona-500-2026', 'draftkings', 'race_winner', 800);`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-track-200 font-semibold mb-2">Update existing odds:</h3>
              <pre className="bg-track-700 p-3 rounded text-xs text-track-300 overflow-x-auto">
{`UPDATE odds 
SET odds = 750 
WHERE driver_id = 'kyle-larson' 
  AND sportsbook = 'draftkings'
  AND race_id = 'daytona-500-2026';`}
              </pre>
            </div>

            <div>
              <h3 className="text-track-200 font-semibold mb-2">Delete old odds:</h3>
              <pre className="bg-track-700 p-3 rounded text-xs text-track-300 overflow-x-auto">
{`DELETE FROM odds WHERE race_id = 'daytona-500-2026';`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}