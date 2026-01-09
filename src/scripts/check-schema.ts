/**
 * Quick diagnostic script to check Supabase schema
 * Run this to understand the table structure
 */

import { supabase } from '../lib/supabase';

async function checkSchema() {
  console.log('Checking Supabase schema...\n');

  // Check drivers table
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('*')
    .limit(1);

  console.log('DRIVERS TABLE:');
  console.log('Sample row:', drivers?.[0]);
  console.log('Columns:', drivers?.[0] ? Object.keys(drivers[0]) : 'None');
  console.log('\n');

  // Check tracks table
  const { data: tracks, error: tracksError } = await supabase
    .from('tracks')
    .select('*')
    .limit(1);

  console.log('TRACKS TABLE:');
  console.log('Sample row:', tracks?.[0]);
  console.log('Columns:', tracks?.[0] ? Object.keys(tracks[0]) : 'None');
  console.log('\n');

  // Check races table
  const { data: races, error: racesError } = await supabase
    .from('races')
    .select('*')
    .limit(1);

  console.log('RACES TABLE:');
  console.log('Sample row:', races?.[0]);
  console.log('Columns:', races?.[0] ? Object.keys(races[0]) : 'None');
  console.log('\n');

  // Try to check race_results table (or similar)
  const possibleTableNames = [
    'race_results',
    'results',
    'driver_results',
    'race_result',
    'season_results',
  ];

  for (const tableName of possibleTableNames) {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (!error && data) {
      console.log(`FOUND: ${tableName.toUpperCase()} TABLE:`);
      console.log('Sample row:', data[0]);
      console.log('Columns:', data[0] ? Object.keys(data[0]) : 'None');
      console.log('\n');
      break;
    }
  }
}

// If running directly: node check-schema.ts
if (require.main === module) {
  checkSchema().then(() => console.log('Schema check complete'));
}

export { checkSchema };
