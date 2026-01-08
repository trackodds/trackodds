// =============================================================================
// TRACKODDS.IO - 2025 NASCAR CUP SERIES DATA
// =============================================================================

import { Driver, Track, Race, Manufacturer } from '@/types';

// -----------------------------------------------------------------------------
// 2025 CUP SERIES DRIVERS
// Full-time drivers for the 2025 season
// -----------------------------------------------------------------------------

export const drivers: Driver[] = [
  // Hendrick Motorsports - Chevrolet
  {
    id: 'kyle-larson',
    name: 'Kyle Larson',
    firstName: 'Kyle',
    lastName: 'Larson',
    number: '5',
    team: 'Hendrick Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'chase-elliott',
    name: 'Chase Elliott',
    firstName: 'Chase',
    lastName: 'Elliott',
    number: '9',
    team: 'Hendrick Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'william-byron',
    name: 'William Byron',
    firstName: 'William',
    lastName: 'Byron',
    number: '24',
    team: 'Hendrick Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'alex-bowman',
    name: 'Alex Bowman',
    firstName: 'Alex',
    lastName: 'Bowman',
    number: '48',
    team: 'Hendrick Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  
  // Joe Gibbs Racing - Toyota
  {
    id: 'denny-hamlin',
    name: 'Denny Hamlin',
    firstName: 'Denny',
    lastName: 'Hamlin',
    number: '11',
    team: 'Joe Gibbs Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  {
    id: 'christopher-bell',
    name: 'Christopher Bell',
    firstName: 'Christopher',
    lastName: 'Bell',
    number: '20',
    team: 'Joe Gibbs Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  {
    id: 'ty-gibbs',
    name: 'Ty Gibbs',
    firstName: 'Ty',
    lastName: 'Gibbs',
    number: '54',
    team: 'Joe Gibbs Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  {
    id: 'martin-truex-jr',
    name: 'Martin Truex Jr.',
    firstName: 'Martin',
    lastName: 'Truex Jr.',
    number: '19',
    team: 'Joe Gibbs Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  
  // Team Penske - Ford
  {
    id: 'joey-logano',
    name: 'Joey Logano',
    firstName: 'Joey',
    lastName: 'Logano',
    number: '22',
    team: 'Team Penske',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'ryan-blaney',
    name: 'Ryan Blaney',
    firstName: 'Ryan',
    lastName: 'Blaney',
    number: '12',
    team: 'Team Penske',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'austin-cindric',
    name: 'Austin Cindric',
    firstName: 'Austin',
    lastName: 'Cindric',
    number: '2',
    team: 'Team Penske',
    manufacturer: 'Ford',
    isActive: true,
  },
  
  // Stewart-Haas Racing - Ford (Note: Team may be transitioning in 2025)
  {
    id: 'chase-briscoe',
    name: 'Chase Briscoe',
    firstName: 'Chase',
    lastName: 'Briscoe',
    number: '14',
    team: 'Stewart-Haas Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'noah-gragson',
    name: 'Noah Gragson',
    firstName: 'Noah',
    lastName: 'Gragson',
    number: '10',
    team: 'Stewart-Haas Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'ryan-preece',
    name: 'Ryan Preece',
    firstName: 'Ryan',
    lastName: 'Preece',
    number: '41',
    team: 'Stewart-Haas Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'josh-berry',
    name: 'Josh Berry',
    firstName: 'Josh',
    lastName: 'Berry',
    number: '4',
    team: 'Stewart-Haas Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  
  // Trackhouse Racing - Chevrolet
  {
    id: 'ross-chastain',
    name: 'Ross Chastain',
    firstName: 'Ross',
    lastName: 'Chastain',
    number: '1',
    team: 'Trackhouse Racing',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'daniel-suarez',
    name: 'Daniel Suárez',
    firstName: 'Daniel',
    lastName: 'Suárez',
    number: '99',
    team: 'Trackhouse Racing',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'shane-van-gisbergen',
    name: 'Shane van Gisbergen',
    firstName: 'Shane',
    lastName: 'van Gisbergen',
    number: '88',
    team: 'Trackhouse Racing',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  
  // 23XI Racing - Toyota
  {
    id: 'bubba-wallace',
    name: 'Bubba Wallace',
    firstName: 'Bubba',
    lastName: 'Wallace',
    number: '23',
    team: '23XI Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  {
    id: 'tyler-reddick',
    name: 'Tyler Reddick',
    firstName: 'Tyler',
    lastName: 'Reddick',
    number: '45',
    team: '23XI Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  
  // Richard Childress Racing - Chevrolet
  {
    id: 'kyle-busch',
    name: 'Kyle Busch',
    firstName: 'Kyle',
    lastName: 'Busch',
    number: '8',
    team: 'Richard Childress Racing',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'austin-dillon',
    name: 'Austin Dillon',
    firstName: 'Austin',
    lastName: 'Dillon',
    number: '3',
    team: 'Richard Childress Racing',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  
  // RFK Racing - Ford
  {
    id: 'chris-buescher',
    name: 'Chris Buescher',
    firstName: 'Chris',
    lastName: 'Buescher',
    number: '17',
    team: 'RFK Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'brad-keselowski',
    name: 'Brad Keselowski',
    firstName: 'Brad',
    lastName: 'Keselowski',
    number: '6',
    team: 'RFK Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  
  // Spire Motorsports - Chevrolet
  {
    id: 'corey-lajoie',
    name: 'Corey LaJoie',
    firstName: 'Corey',
    lastName: 'LaJoie',
    number: '7',
    team: 'Spire Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'zane-smith',
    name: 'Zane Smith',
    firstName: 'Zane',
    lastName: 'Smith',
    number: '71',
    team: 'Spire Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  {
    id: 'carson-hocevar',
    name: 'Carson Hocevar',
    firstName: 'Carson',
    lastName: 'Hocevar',
    number: '77',
    team: 'Spire Motorsports',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  
  // Legacy Motor Club - Toyota
  {
    id: 'john-hunter-nemechek',
    name: 'John Hunter Nemechek',
    firstName: 'John Hunter',
    lastName: 'Nemechek',
    number: '42',
    team: 'Legacy Motor Club',
    manufacturer: 'Toyota',
    isActive: true,
  },
  {
    id: 'erik-jones',
    name: 'Erik Jones',
    firstName: 'Erik',
    lastName: 'Jones',
    number: '43',
    team: 'Legacy Motor Club',
    manufacturer: 'Toyota',
    isActive: true,
  },
  
  // Front Row Motorsports - Ford
  {
    id: 'michael-mcdowell',
    name: 'Michael McDowell',
    firstName: 'Michael',
    lastName: 'McDowell',
    number: '34',
    team: 'Front Row Motorsports',
    manufacturer: 'Ford',
    isActive: true,
  },
  {
    id: 'todd-gilliland',
    name: 'Todd Gilliland',
    firstName: 'Todd',
    lastName: 'Gilliland',
    number: '38',
    team: 'Front Row Motorsports',
    manufacturer: 'Ford',
    isActive: true,
  },
  
  // Kaulig Racing - Chevrolet
  {
    id: 'aj-allmendinger',
    name: 'AJ Allmendinger',
    firstName: 'AJ',
    lastName: 'Allmendinger',
    number: '16',
    team: 'Kaulig Racing',
    manufacturer: 'Chevrolet',
    isActive: true,
  },
  
  // JTG Daugherty Racing - Toyota
  {
    id: 'ricky-stenhouse-jr',
    name: 'Ricky Stenhouse Jr.',
    firstName: 'Ricky',
    lastName: 'Stenhouse Jr.',
    number: '47',
    team: 'JTG Daugherty Racing',
    manufacturer: 'Toyota',
    isActive: true,
  },
  
  // Wood Brothers Racing - Ford
  {
    id: 'harrison-burton',
    name: 'Harrison Burton',
    firstName: 'Harrison',
    lastName: 'Burton',
    number: '21',
    team: 'Wood Brothers Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
  
  // Rick Ware Racing / Various
  {
    id: 'cody-ware',
    name: 'Cody Ware',
    firstName: 'Cody',
    lastName: 'Ware',
    number: '51',
    team: 'Rick Ware Racing',
    manufacturer: 'Ford',
    isActive: true,
  },
];

// -----------------------------------------------------------------------------
// NASCAR TRACKS
// -----------------------------------------------------------------------------

export const tracks: Track[] = [
  {
    id: 'daytona',
    name: 'Daytona International Speedway',
    shortName: 'Daytona',
    location: 'Daytona Beach, FL',
    type: 'superspeedway',
    length: 2.5,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'atlanta',
    name: 'Atlanta Motor Speedway',
    shortName: 'Atlanta',
    location: 'Hampton, GA',
    type: 'superspeedway',
    length: 1.54,
    shape: 'quad-oval',
    surface: 'Asphalt',
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas Motor Speedway',
    shortName: 'Las Vegas',
    location: 'Las Vegas, NV',
    type: 'intermediate',
    length: 1.5,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'phoenix',
    name: 'Phoenix Raceway',
    shortName: 'Phoenix',
    location: 'Avondale, AZ',
    type: 'short',
    length: 1.0,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'cota',
    name: 'Circuit of the Americas',
    shortName: 'COTA',
    location: 'Austin, TX',
    type: 'road',
    length: 3.426,
    shape: 'road-course',
    surface: 'Asphalt',
  },
  {
    id: 'bristol',
    name: 'Bristol Motor Speedway',
    shortName: 'Bristol',
    location: 'Bristol, TN',
    type: 'short',
    length: 0.533,
    shape: 'oval',
    surface: 'Concrete',
  },
  {
    id: 'martinsville',
    name: 'Martinsville Speedway',
    shortName: 'Martinsville',
    location: 'Ridgeway, VA',
    type: 'short',
    length: 0.526,
    shape: 'oval',
    surface: 'Asphalt/Concrete',
  },
  {
    id: 'texas',
    name: 'Texas Motor Speedway',
    shortName: 'Texas',
    location: 'Fort Worth, TX',
    type: 'intermediate',
    length: 1.5,
    shape: 'quad-oval',
    surface: 'Asphalt',
  },
  {
    id: 'richmond',
    name: 'Richmond Raceway',
    shortName: 'Richmond',
    location: 'Richmond, VA',
    type: 'short',
    length: 0.75,
    shape: 'oval',
    surface: 'Asphalt',
  },
  {
    id: 'talladega',
    name: 'Talladega Superspeedway',
    shortName: 'Talladega',
    location: 'Lincoln, AL',
    type: 'superspeedway',
    length: 2.66,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'dover',
    name: 'Dover Motor Speedway',
    shortName: 'Dover',
    location: 'Dover, DE',
    type: 'short',
    length: 1.0,
    shape: 'oval',
    surface: 'Concrete',
  },
  {
    id: 'kansas',
    name: 'Kansas Speedway',
    shortName: 'Kansas',
    location: 'Kansas City, KS',
    type: 'intermediate',
    length: 1.5,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'charlotte',
    name: 'Charlotte Motor Speedway',
    shortName: 'Charlotte',
    location: 'Concord, NC',
    type: 'intermediate',
    length: 1.5,
    shape: 'quad-oval',
    surface: 'Asphalt',
  },
  {
    id: 'sonoma',
    name: 'Sonoma Raceway',
    shortName: 'Sonoma',
    location: 'Sonoma, CA',
    type: 'road',
    length: 1.99,
    shape: 'road-course',
    surface: 'Asphalt',
  },
  {
    id: 'nashville',
    name: 'Nashville Superspeedway',
    shortName: 'Nashville',
    location: 'Lebanon, TN',
    type: 'intermediate',
    length: 1.33,
    shape: 'oval',
    surface: 'Concrete',
  },
  {
    id: 'chicago-street',
    name: 'Chicago Street Course',
    shortName: 'Chicago',
    location: 'Chicago, IL',
    type: 'road',
    length: 2.2,
    shape: 'road-course',
    surface: 'Asphalt',
  },
  {
    id: 'pocono',
    name: 'Pocono Raceway',
    shortName: 'Pocono',
    location: 'Long Pond, PA',
    type: 'superspeedway',
    length: 2.5,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'michigan',
    name: 'Michigan International Speedway',
    shortName: 'Michigan',
    location: 'Brooklyn, MI',
    type: 'intermediate',
    length: 2.0,
    shape: 'tri-oval',
    surface: 'Asphalt',
  },
  {
    id: 'indianapolis-road',
    name: 'Indianapolis Motor Speedway (Road Course)',
    shortName: 'Indy Road',
    location: 'Speedway, IN',
    type: 'road',
    length: 2.439,
    shape: 'road-course',
    surface: 'Asphalt',
  },
  {
    id: 'watkins-glen',
    name: 'Watkins Glen International',
    shortName: 'Watkins Glen',
    location: 'Watkins Glen, NY',
    type: 'road',
    length: 2.45,
    shape: 'road-course',
    surface: 'Asphalt',
  },
  {
    id: 'daytona-road',
    name: 'Daytona International Speedway (Road Course)',
    shortName: 'Daytona RC',
    location: 'Daytona Beach, FL',
    type: 'road',
    length: 3.61,
    shape: 'road-course',
    surface: 'Asphalt',
  },
  {
    id: 'darlington',
    name: 'Darlington Raceway',
    shortName: 'Darlington',
    location: 'Darlington, SC',
    type: 'intermediate',
    length: 1.366,
    shape: 'oval',
    surface: 'Asphalt',
  },
  {
    id: 'homestead',
    name: 'Homestead-Miami Speedway',
    shortName: 'Homestead',
    location: 'Homestead, FL',
    type: 'intermediate',
    length: 1.5,
    shape: 'oval',
    surface: 'Asphalt',
  },
  {
    id: 'new-hampshire',
    name: 'New Hampshire Motor Speedway',
    shortName: 'New Hampshire',
    location: 'Loudon, NH',
    type: 'short',
    length: 1.058,
    shape: 'oval',
    surface: 'Asphalt',
  },
  {
    id: 'charlotte-roval',
    name: 'Charlotte Roval',
    shortName: 'Roval',
    location: 'Concord, NC',
    type: 'road',
    length: 2.28,
    shape: 'roval',
    surface: 'Asphalt',
  },
];

// -----------------------------------------------------------------------------
// 2025 SCHEDULE (First portion - through Daytona 500)
// -----------------------------------------------------------------------------

export const races2025: Race[] = [
  {
    id: 'daytona-500-2025',
    name: 'Daytona 500',
    track: tracks.find(t => t.id === 'daytona')!,
    series: 'Cup',
    scheduledDate: new Date('2025-02-16T14:30:00-05:00'),
    scheduledTime: '2:30 PM ET',
    tvNetwork: 'FOX',
    laps: 200,
    distance: 500,
    stage1Laps: 65,
    stage2Laps: 65,
    status: 'scheduled',
  },
];

// -----------------------------------------------------------------------------
// SPORTSBOOK METADATA
// -----------------------------------------------------------------------------

export const sportsbooks = {
  draftkings: {
    id: 'draftkings',
    name: 'DraftKings',
    shortName: 'DK',
    color: '#53d337',
    logo: '/logos/draftkings.svg',
  },
  fanduel: {
    id: 'fanduel',
    name: 'FanDuel',
    shortName: 'FD',
    color: '#1493ff',
    logo: '/logos/fanduel.svg',
  },
  betmgm: {
    id: 'betmgm',
    name: 'BetMGM',
    shortName: 'MGM',
    color: '#c4a962',
    logo: '/logos/betmgm.svg',
  },
  caesars: {
    id: 'caesars',
    name: 'Caesars',
    shortName: 'CZR',
    color: '#0a3d2a',
    logo: '/logos/caesars.svg',
  },
  betrivers: {
    id: 'betrivers',
    name: 'BetRivers',
    shortName: 'BR',
    color: '#ff6b35',
    logo: '/logos/betrivers.svg',
  },
  pointsbet: {
    id: 'pointsbet',
    name: 'PointsBet',
    shortName: 'PB',
    color: '#ed1c24',
    logo: '/logos/pointsbet.svg',
  },
} as const;

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

export function getDriverById(id: string): Driver | undefined {
  return drivers.find(d => d.id === id);
}

export function getDriversByTeam(team: string): Driver[] {
  return drivers.filter(d => d.team === team);
}

export function getDriversByManufacturer(manufacturer: Manufacturer): Driver[] {
  return drivers.filter(d => d.manufacturer === manufacturer);
}

export function getTrackById(id: string): Track | undefined {
  return tracks.find(t => t.id === id);
}

export function getTracksByType(type: Track['type']): Track[] {
  return tracks.filter(t => t.type === type);
}
