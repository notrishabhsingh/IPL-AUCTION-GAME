export type PlayerRole = 'BAT' | 'BOWL' | 'AR' | 'WK';
export type PlayerEra = 'current' | 'legend';

export interface PlayerStats {
  matches: number;
  runs?: number;
  avg?: number;
  sr?: number;
  fifties?: number;
  hundreds?: number;
  wickets?: number;
  economy?: number;
  bowlAvg?: number;
  bowlSr?: number;
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  basePrice: number;
  ipl: PlayerStats;
  t20i: PlayerStats;
  country: string;
  era: PlayerEra;
}

// ─── CURRENT PLAYERS ────────────────────────────────────────────────────────

// Top 30 players - 2 crore base (Current)
export const topTierPlayers: Player[] = [
  { id: '1', name: 'Virat Kohli', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 278, runs: 9040, avg: 39.65, sr: 133.27, fifties: 66, hundreds: 7 }, t20i: { matches: 125, runs: 4188, avg: 48.7, sr: 137.05, fifties: 38, hundreds: 1 }, country: 'India' },
  { id: '2', name: 'Jasprit Bumrah', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 132, wickets: 165, economy: 7.43, bowlAvg: 23.55, bowlSr: 15.67 }, t20i: { matches: 89, wickets: 96, economy: 6.68, bowlAvg: 20.32, bowlSr: 13.90 }, country: 'India' },
  { id: '3', name: 'Rohit Sharma', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 243, runs: 6213, avg: 30.66, sr: 130.08, fifties: 42, hundreds: 2 }, t20i: { matches: 159, runs: 4312, avg: 32.54, sr: 135.42, fifties: 30, hundreds: 5 }, country: 'India' },
  { id: '4', name: 'MS Dhoni', role: 'WK', basePrice: 2, era: 'current', ipl: { matches: 251, runs: 5082, avg: 38.06, sr: 136.54, fifties: 23, hundreds: 0 }, t20i: { matches: 98, runs: 1617, avg: 36.73, sr: 127.09, fifties: 5, hundreds: 0 }, country: 'India' },
  { id: '5', name: 'Hardik Pandya', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 118, runs: 2624, avg: 26.78, sr: 144.54, wickets: 47, economy: 7.85 }, t20i: { matches: 89, runs: 1404, avg: 25.07, sr: 135.46, wickets: 55, economy: 7.36 }, country: 'India' },
  { id: '6', name: 'Ravindra Jadeja', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 213, runs: 3111, avg: 26.16, sr: 126.87, wickets: 160, economy: 7.12, bowlAvg: 24.34, bowlSr: 22.26 }, t20i: { matches: 74, runs: 816, avg: 22.66, sr: 118.26, wickets: 83, economy: 6.73, bowlAvg: 18.54, bowlSr: 15.36 }, country: 'India' },
  { id: '7', name: 'KL Rahul', role: 'WK', basePrice: 2, era: 'current', ipl: { matches: 132, runs: 3896, avg: 34.60, sr: 135.86, fifties: 26, hundreds: 1 }, t20i: { matches: 72, runs: 2263, avg: 35.98, sr: 140.58, fifties: 16, hundreds: 2 }, country: 'India' },
  { id: '8', name: 'Shubman Gill', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 74, runs: 2298, avg: 34.87, sr: 137.22, fifties: 14, hundreds: 3 }, t20i: { matches: 37, runs: 1263, avg: 36.08, sr: 144.79, fifties: 9, hundreds: 1 }, country: 'India' },
  { id: '9', name: 'Mohammed Shami', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 116, wickets: 127, economy: 8.10, bowlAvg: 25.90, bowlSr: 19.32 }, t20i: { matches: 61, wickets: 55, economy: 8.62, bowlAvg: 29.45, bowlSr: 20.64 }, country: 'India' },
  { id: '10', name: 'Mohammed Siraj', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 83, wickets: 94, economy: 7.84, bowlAvg: 23.78, bowlSr: 17.18 }, t20i: { matches: 41, wickets: 35, economy: 8.41, bowlAvg: 24.77, bowlSr: 18.20 }, country: 'India' },
  { id: '11', name: 'Shreyas Iyer', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 109, runs: 3438, avg: 35.44, sr: 135.42, fifties: 26, hundreds: 3 }, t20i: { matches: 62, runs: 1733, avg: 30.22, sr: 127.38, fifties: 12, hundreds: 1 }, country: 'India' },
  { id: '12', name: 'Rishabh Pant', role: 'WK', basePrice: 2, era: 'current', ipl: { matches: 84, runs: 2538, avg: 34.02, sr: 147.53, fifties: 14, hundreds: 2 }, t20i: { matches: 66, runs: 1574, avg: 26.23, sr: 125.99, fifties: 8, hundreds: 0 }, country: 'India' },
  { id: '13', name: 'Suryakumar Yadav', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 79, runs: 2156, avg: 31.24, sr: 140.12, fifties: 13, hundreds: 1 }, t20i: { matches: 51, runs: 1652, avg: 38.88, sr: 173.55, fifties: 13, hundreds: 4 }, country: 'India' },
  { id: '14', name: 'Axar Patel', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 111, runs: 1659, avg: 24.39, sr: 122.56, wickets: 94, economy: 7.10, bowlAvg: 22.44, bowlSr: 20.16 }, t20i: { matches: 60, runs: 584, avg: 18.25, sr: 108.36, wickets: 52, economy: 6.45, bowlAvg: 16.50, bowlSr: 14.88 }, country: 'India' },
  { id: '15', name: 'Shivam Dube', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 62, runs: 1329, avg: 28.70, sr: 143.28, wickets: 8, economy: 7.95 }, t20i: { matches: 32, runs: 528, avg: 22.00, sr: 128.70, wickets: 7, economy: 8.30 }, country: 'India' },
  { id: '16', name: 'Arshdeep Singh', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 62, wickets: 61, economy: 7.90, bowlAvg: 26.08, bowlSr: 18.90 }, t20i: { matches: 37, wickets: 46, economy: 8.04, bowlAvg: 19.85, bowlSr: 15.12 }, country: 'India' },
  { id: '17', name: 'Yuzvendra Chahal', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 105, wickets: 138, economy: 7.52, bowlAvg: 20.45, bowlSr: 17.22 }, t20i: { matches: 59, wickets: 66, economy: 8.18, bowlAvg: 22.36, bowlSr: 17.40 }, country: 'India' },
  { id: '18', name: 'Kuldeep Yadav', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 77, wickets: 88, economy: 7.72, bowlAvg: 22.80, bowlSr: 18.60 }, t20i: { matches: 33, wickets: 43, economy: 7.66, bowlAvg: 17.44, bowlSr: 13.28 }, country: 'India' },
  { id: '19', name: 'Bhuvneshwar Kumar', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 154, wickets: 152, economy: 7.35, bowlAvg: 25.22, bowlSr: 18.24 }, t20i: { matches: 87, wickets: 71, economy: 7.62, bowlAvg: 26.80, bowlSr: 18.92 }, country: 'India' },
  { id: '20', name: 'Sanju Samson', role: 'WK', basePrice: 2, era: 'current', ipl: { matches: 114, runs: 3011, avg: 31.36, sr: 134.53, fifties: 16, hundreds: 3 }, t20i: { matches: 28, runs: 542, avg: 22.58, sr: 120.09, fifties: 2, hundreds: 0 }, country: 'India' },
  { id: '21', name: 'Ruturaj Gaikwad', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 58, runs: 1792, avg: 33.74, sr: 131.23, fifties: 12, hundreds: 2 }, t20i: { matches: 17, runs: 461, avg: 30.73, sr: 130.41, fifties: 3, hundreds: 0 }, country: 'India' },
  { id: '22', name: 'Ishan Kishan', role: 'WK', basePrice: 2, era: 'current', ipl: { matches: 69, runs: 1790, avg: 29.02, sr: 132.05, fifties: 9, hundreds: 1 }, t20i: { matches: 34, runs: 862, avg: 28.73, sr: 128.36, fifties: 4, hundreds: 0 }, country: 'India' },
  { id: '23', name: 'Tilak Varma', role: 'BAT', basePrice: 2, era: 'current', ipl: { matches: 27, runs: 746, avg: 31.08, sr: 131.34, fifties: 4, hundreds: 0 }, t20i: { matches: 16, runs: 343, avg: 24.50, sr: 126.01, fifties: 2, hundreds: 0 }, country: 'India' },
  { id: '24', name: 'Washington Sundar', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 36, runs: 493, avg: 20.54, sr: 110.56, wickets: 25, economy: 7.22, bowlAvg: 26.40, bowlSr: 24.10 }, t20i: { matches: 26, runs: 198, avg: 14.85, sr: 98.51, wickets: 16, economy: 6.35, bowlAvg: 17.00, bowlSr: 15.50 }, country: 'India' },
  { id: '25', name: 'Rashid Khan', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 76, wickets: 110, economy: 6.21, bowlAvg: 18.55, bowlSr: 17.90 }, t20i: { matches: 56, wickets: 76, economy: 5.83, bowlAvg: 14.73, bowlSr: 15.16 }, country: 'Afghanistan' },
  { id: '26', name: 'Jos Buttler', role: 'WK', basePrice: 2, era: 'current', ipl: { matches: 84, runs: 2716, avg: 37.19, sr: 149.61, fifties: 18, hundreds: 4 }, t20i: { matches: 62, runs: 1881, avg: 32.43, sr: 145.10, fifties: 13, hundreds: 1 }, country: 'England' },
  { id: '27', name: 'Glenn Maxwell', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 98, runs: 2361, avg: 27.69, sr: 150.44, wickets: 14, economy: 7.88 }, t20i: { matches: 89, runs: 2073, avg: 27.64, sr: 153.40, wickets: 25, economy: 7.53 }, country: 'Australia' },
  { id: '28', name: 'Andre Russell', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 109, runs: 2193, avg: 26.43, sr: 174.10, wickets: 67, economy: 9.12 }, t20i: { matches: 47, runs: 586, avg: 18.31, sr: 165.06, wickets: 31, economy: 9.26 }, country: 'West Indies' },
  { id: '29', name: 'Sunil Narine', role: 'AR', basePrice: 2, era: 'current', ipl: { matches: 112, runs: 1473, avg: 21.04, sr: 128.94, wickets: 120, economy: 6.69, bowlAvg: 21.88, bowlSr: 19.62 }, t20i: { matches: 51, runs: 456, avg: 13.52, sr: 110.17, wickets: 45, economy: 6.15, bowlAvg: 18.49, bowlSr: 18.00 }, country: 'West Indies' },
  { id: '30', name: 'Pat Cummins', role: 'BOWL', basePrice: 2, era: 'current', ipl: { matches: 46, wickets: 45, economy: 8.26, bowlAvg: 25.30, bowlSr: 18.38 }, t20i: { matches: 64, wickets: 55, economy: 7.58, bowlAvg: 22.40, bowlSr: 17.73 }, country: 'Australia' },
];

// Premium Current Players - 1.5 crore
export const premiumPlayers: Player[] = [
  { id: '31', name: 'David Warner', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 184, runs: 5884, avg: 40.30, sr: 140.45, fifties: 59, hundreds: 4 }, t20i: { matches: 106, runs: 3277, avg: 36.38, sr: 140.34, fifties: 25, hundreds: 1 }, country: 'Australia' },
  { id: '32', name: 'Faf du Plessis', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 156, runs: 4695, avg: 35.98, sr: 131.49, fifties: 37, hundreds: 2 }, t20i: { matches: 70, runs: 1781, avg: 28.11, sr: 129.67, fifties: 14, hundreds: 0 }, country: 'South Africa' },
  { id: '33', name: 'Kagiso Rabada', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 63, wickets: 77, economy: 7.70, bowlAvg: 22.44, bowlSr: 17.47 }, t20i: { matches: 53, wickets: 55, economy: 7.62, bowlAvg: 22.96, bowlSr: 18.07 }, country: 'South Africa' },
  { id: '34', name: 'Trent Boult', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 62, wickets: 74, economy: 7.99, bowlAvg: 24.81, bowlSr: 18.64 }, t20i: { matches: 44, wickets: 55, economy: 7.73, bowlAvg: 22.91, bowlSr: 17.76 }, country: 'New Zealand' },
  { id: '35', name: 'Jofra Archer', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 29, wickets: 29, economy: 7.68, bowlAvg: 22.10, bowlSr: 17.27 }, t20i: { matches: 29, wickets: 30, economy: 7.26, bowlAvg: 22.36, bowlSr: 18.50 }, country: 'England' },
  { id: '36', name: 'Mitchell Starc', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 75, wickets: 90, economy: 7.98, bowlAvg: 25.40, bowlSr: 19.10 }, t20i: { matches: 62, wickets: 55, economy: 7.47, bowlAvg: 24.31, bowlSr: 19.51 }, country: 'Australia' },
  { id: '37', name: 'Kane Williamson', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 76, runs: 2083, avg: 34.72, sr: 123.59, fifties: 16, hundreds: 0 }, t20i: { matches: 62, runs: 1823, avg: 33.24, sr: 121.86, fifties: 16, hundreds: 0 }, country: 'New Zealand' },
  { id: '38', name: 'Nicholas Pooran', role: 'WK', basePrice: 1.5, era: 'current', ipl: { matches: 42, runs: 1008, avg: 26.53, sr: 143.47, fifties: 4, hundreds: 0 }, t20i: { matches: 45, runs: 924, avg: 23.69, sr: 132.66, fifties: 4, hundreds: 0 }, country: 'West Indies' },
  { id: '39', name: 'Sam Curran', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 40, runs: 670, avg: 23.92, sr: 135.76, wickets: 42, economy: 8.44 }, t20i: { matches: 37, runs: 510, avg: 18.21, sr: 129.47, wickets: 38, economy: 8.30 }, country: 'England' },
  { id: '40', name: 'Heinrich Klaasen', role: 'WK', basePrice: 1.5, era: 'current', ipl: { matches: 22, runs: 562, avg: 28.10, sr: 142.43, fifties: 3, hundreds: 0 }, t20i: { matches: 21, runs: 501, avg: 27.83, sr: 143.53, fifties: 3, hundreds: 0 }, country: 'South Africa' },
  { id: '41', name: 'Marcus Stoinis', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 57, runs: 876, avg: 22.97, sr: 132.72, wickets: 27, economy: 8.88 }, t20i: { matches: 49, runs: 555, avg: 17.90, sr: 128.64, wickets: 20, economy: 8.62 }, country: 'Australia' },
  { id: '42', name: 'Mohammad Nabi', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 41, runs: 515, avg: 18.39, sr: 110.33, wickets: 35, economy: 6.85, bowlAvg: 21.26, bowlSr: 18.63 }, t20i: { matches: 67, runs: 803, avg: 14.35, sr: 102.30, wickets: 46, economy: 6.72, bowlAvg: 20.67, bowlSr: 18.43 }, country: 'Afghanistan' },
  { id: '43', name: 'Mujeeb Ur Rahman', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 14, wickets: 12, economy: 6.68, bowlAvg: 20.83, bowlSr: 18.67 }, t20i: { matches: 38, wickets: 52, economy: 5.84, bowlAvg: 14.94, bowlSr: 15.35 }, country: 'Afghanistan' },
  { id: '44', name: 'Shimron Hetmyer', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 34, runs: 890, avg: 28.06, sr: 137.84, fifties: 4, hundreds: 0 }, t20i: { matches: 33, runs: 789, avg: 27.20, sr: 135.50, fifties: 5, hundreds: 0 }, country: 'West Indies' },
  { id: '45', name: 'Anrich Nortje', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 35, wickets: 38, economy: 7.92, bowlAvg: 22.55, bowlSr: 17.08 }, t20i: { matches: 29, wickets: 33, economy: 7.44, bowlAvg: 20.88, bowlSr: 16.85 }, country: 'South Africa' },
  { id: '46', name: 'Prithvi Shaw', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 57, runs: 1734, avg: 32.70, sr: 144.12, fifties: 12, hundreds: 1 }, t20i: { matches: 18, runs: 475, avg: 26.38, sr: 138.54, fifties: 3, hundreds: 0 }, country: 'India' },
  { id: '47', name: 'Devdutt Padikkal', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 34, runs: 1157, avg: 36.15, sr: 131.72, fifties: 9, hundreds: 1 }, t20i: { matches: 12, runs: 297, avg: 27.00, sr: 119.76, fifties: 1, hundreds: 0 }, country: 'India' },
  { id: '48', name: 'Venkatesh Iyer', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 28, runs: 641, avg: 27.86, sr: 132.43, wickets: 7, economy: 7.65 }, t20i: { matches: 15, runs: 221, avg: 17.76, sr: 114.06, wickets: 4, economy: 7.28 }, country: 'India' },
  { id: '49', name: 'Shardul Thakur', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 47, wickets: 42, economy: 8.41, bowlAvg: 29.17, bowlSr: 20.81 }, t20i: { matches: 26, wickets: 21, economy: 8.84, bowlAvg: 30.81, bowlSr: 20.90 }, country: 'India' },
  { id: '50', name: 'Ravi Bishnoi', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 26, wickets: 25, economy: 7.31, bowlAvg: 22.84, bowlSr: 18.72 }, t20i: { matches: 11, wickets: 10, economy: 7.54, bowlAvg: 24.10, bowlSr: 19.20 }, country: 'India' },
  { id: '51', name: 'Sai Sudharsan', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 16, runs: 407, avg: 29.78, sr: 125.69, fifties: 2, hundreds: 0 }, t20i: { matches: 2, runs: 28, avg: 14.00, sr: 116.67 }, country: 'India' },
  { id: '52', name: 'Abhishek Sharma', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 32, runs: 519, avg: 19.96, sr: 125.36, wickets: 12, economy: 8.10 }, t20i: { matches: 8, runs: 88, avg: 12.57, sr: 105.76, wickets: 5, economy: 7.90 }, country: 'India' },
  { id: '53', name: 'Mayank Agarwal', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 82, runs: 2353, avg: 31.77, sr: 135.63, fifties: 17, hundreds: 2 }, t20i: { matches: 16, runs: 347, avg: 23.13, sr: 125.54, fifties: 2, hundreds: 0 }, country: 'India' },
  { id: '54', name: 'Krunal Pandya', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 58, runs: 768, avg: 19.69, sr: 121.14, wickets: 46, economy: 7.32, bowlAvg: 24.28, bowlSr: 19.89 }, t20i: { matches: 21, runs: 160, avg: 12.30, sr: 103.22, wickets: 9, economy: 7.01, bowlAvg: 20.67, bowlSr: 17.67 }, country: 'India' },
  { id: '55', name: 'Rovman Powell', role: 'BAT', basePrice: 1.5, era: 'current', ipl: { matches: 34, runs: 676, avg: 23.31, sr: 144.73, fifties: 3, hundreds: 0 }, t20i: { matches: 28, runs: 538, avg: 22.42, sr: 134.16, fifties: 2, hundreds: 0 }, country: 'West Indies' },
  { id: '56', name: 'Jason Holder', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 41, runs: 535, avg: 19.81, sr: 122.70, wickets: 28, economy: 7.82, bowlAvg: 26.18, bowlSr: 20.07 }, t20i: { matches: 54, runs: 450, avg: 15.00, sr: 103.23, wickets: 41, economy: 7.13, bowlAvg: 23.24, bowlSr: 19.56 }, country: 'West Indies' },
  { id: '57', name: 'Lockie Ferguson', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 24, wickets: 26, economy: 8.49, bowlAvg: 24.77, bowlSr: 17.54 }, t20i: { matches: 31, wickets: 33, economy: 8.19, bowlAvg: 23.42, bowlSr: 17.18 }, country: 'New Zealand' },
  { id: '58', name: 'Rachin Ravindra', role: 'AR', basePrice: 1.5, era: 'current', ipl: { matches: 18, runs: 295, avg: 21.07, sr: 120.90, wickets: 11, economy: 7.76 }, t20i: { matches: 22, runs: 378, avg: 21.00, sr: 124.18, wickets: 15, economy: 7.83 }, country: 'New Zealand' },
  { id: '59', name: 'Alzarri Joseph', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 30, wickets: 32, economy: 8.33, bowlAvg: 23.53, bowlSr: 16.94 }, t20i: { matches: 36, wickets: 34, economy: 8.23, bowlAvg: 24.59, bowlSr: 17.91 }, country: 'West Indies' },
  { id: '60', name: 'Adil Rashid', role: 'BOWL', basePrice: 1.5, era: 'current', ipl: { matches: 50, wickets: 56, economy: 7.12, bowlAvg: 21.98, bowlSr: 18.54 }, t20i: { matches: 67, wickets: 65, economy: 7.11, bowlAvg: 22.97, bowlSr: 19.38 }, country: 'England' },
];

// Mid-tier current players - 1 crore
export const midTierPlayers: Player[] = [
  { id: '61', name: 'Manish Pandey', role: 'BAT', basePrice: 1, era: 'current', ipl: { matches: 154, runs: 3794, avg: 30.11, sr: 122.67, fifties: 25, hundreds: 1 }, t20i: { matches: 39, runs: 786, avg: 23.15, sr: 116.47, fifties: 4, hundreds: 0 }, country: 'India' },
  { id: '62', name: 'Nitish Rana', role: 'BAT', basePrice: 1, era: 'current', ipl: { matches: 55, runs: 1306, avg: 27.20, sr: 131.07, fifties: 8, hundreds: 0 }, t20i: { matches: 10, runs: 183, avg: 20.33, sr: 127.08, fifties: 1, hundreds: 0 }, country: 'India' },
  { id: '63', name: 'Shahbaz Ahmed', role: 'AR', basePrice: 1, era: 'current', ipl: { matches: 14, runs: 172, avg: 17.20, sr: 126.76, wickets: 9, economy: 8.02 }, t20i: { matches: 5, runs: 46, avg: 9.20, sr: 117.95, wickets: 3, economy: 7.80 }, country: 'India' },
  { id: '64', name: 'Sarfaraz Khan', role: 'BAT', basePrice: 1, era: 'current', ipl: { matches: 14, runs: 456, avg: 38.00, sr: 148.54, fifties: 3, hundreds: 0 }, t20i: { matches: 3, runs: 24, avg: 8.00, sr: 109.09 }, country: 'India' },
  { id: '65', name: 'Jitesh Sharma', role: 'WK', basePrice: 1, era: 'current', ipl: { matches: 18, runs: 365, avg: 23.31, sr: 141.47, fifties: 2, hundreds: 0 }, t20i: { matches: 6, runs: 92, avg: 15.33, sr: 126.03 }, country: 'India' },
  { id: '66', name: 'Prabhsimran Singh', role: 'WK', basePrice: 1, era: 'current', ipl: { matches: 12, runs: 246, avg: 20.50, sr: 132.97, fifties: 1, hundreds: 0 }, t20i: { matches: 2, runs: 21, avg: 10.50, sr: 105.00 }, country: 'India' },
  { id: '67', name: 'Prasidh Krishna', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 36, wickets: 34, economy: 8.43, bowlAvg: 29.56, bowlSr: 21.06 }, t20i: { matches: 14, wickets: 12, economy: 8.93, bowlAvg: 30.25, bowlSr: 20.33 }, country: 'India' },
  { id: '68', name: 'Mohsin Khan', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 15, wickets: 18, economy: 6.92, bowlAvg: 20.06, bowlSr: 17.39 }, t20i: { matches: 7, wickets: 6, economy: 7.71, bowlAvg: 22.33, bowlSr: 17.33 }, country: 'India' },
  { id: '69', name: 'Yash Dayal', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 12, wickets: 14, economy: 7.87, bowlAvg: 23.29, bowlSr: 17.79 }, t20i: { matches: 4, wickets: 3, economy: 9.00 }, country: 'India' },
  { id: '70', name: 'Khaleel Ahmed', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 34, wickets: 34, economy: 8.21, bowlAvg: 28.06, bowlSr: 20.53 }, t20i: { matches: 18, wickets: 18, economy: 8.42, bowlAvg: 27.78, bowlSr: 19.78 }, country: 'India' },
  { id: '71', name: 'Vijay Shankar', role: 'AR', basePrice: 1, era: 'current', ipl: { matches: 45, runs: 623, avg: 17.86, sr: 122.30, wickets: 19, economy: 8.18 }, t20i: { matches: 23, runs: 268, avg: 17.86, sr: 115.52, wickets: 8, economy: 7.55 }, country: 'India' },
  { id: '72', name: 'Naveen-ul-Haq', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 20, wickets: 17, economy: 7.68, bowlAvg: 25.35, bowlSr: 19.82 }, t20i: { matches: 26, wickets: 22, economy: 7.21, bowlAvg: 21.68, bowlSr: 18.05 }, country: 'Afghanistan' },
  { id: '73', name: 'Fazalhaq Farooqi', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 8, wickets: 9, economy: 7.45, bowlAvg: 20.89, bowlSr: 16.78 }, t20i: { matches: 15, wickets: 21, economy: 6.64, bowlAvg: 15.57, bowlSr: 14.10 }, country: 'Afghanistan' },
  { id: '74', name: 'Kyle Mayers', role: 'AR', basePrice: 1, era: 'current', ipl: { matches: 18, runs: 339, avg: 22.60, sr: 131.40, wickets: 5, economy: 8.20 }, t20i: { matches: 20, runs: 346, avg: 20.35, sr: 123.83, wickets: 4, economy: 7.90 }, country: 'West Indies' },
  { id: '75', name: 'Romario Shepherd', role: 'AR', basePrice: 1, era: 'current', ipl: { matches: 24, runs: 212, avg: 14.13, sr: 105.47, wickets: 18, economy: 9.00 }, t20i: { matches: 22, runs: 127, avg: 9.77, sr: 95.49, wickets: 18, economy: 8.64 }, country: 'West Indies' },
  { id: '76', name: 'Tim Southee', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 44, wickets: 39, economy: 8.25, bowlAvg: 28.92, bowlSr: 21.03 }, t20i: { matches: 55, wickets: 55, economy: 7.78, bowlAvg: 25.65, bowlSr: 19.78 }, country: 'New Zealand' },
  { id: '77', name: 'Jimmy Neesham', role: 'AR', basePrice: 1, era: 'current', ipl: { matches: 38, runs: 398, avg: 17.30, sr: 125.79, wickets: 30, economy: 8.30 }, t20i: { matches: 47, runs: 328, avg: 12.61, sr: 115.43, wickets: 39, economy: 7.63 }, country: 'New Zealand' },
  { id: '78', name: 'Azmatullah Omarzai', role: 'AR', basePrice: 1, era: 'current', ipl: { matches: 7, runs: 85, avg: 17.00, sr: 113.33, wickets: 4, economy: 7.75 }, t20i: { matches: 12, runs: 142, avg: 14.20, sr: 117.36, wickets: 9, economy: 7.58 }, country: 'Afghanistan' },
  { id: '79', name: 'Rahmanullah Gurbaz', role: 'WK', basePrice: 1, era: 'current', ipl: { matches: 16, runs: 350, avg: 25.00, sr: 132.58, fifties: 2, hundreds: 0 }, t20i: { matches: 22, runs: 487, avg: 24.35, sr: 124.87, fifties: 3, hundreds: 0 }, country: 'Afghanistan' },
  { id: '80', name: 'Odean Smith', role: 'BOWL', basePrice: 1, era: 'current', ipl: { matches: 19, wickets: 18, economy: 8.85, bowlAvg: 28.72, bowlSr: 19.44 }, t20i: { matches: 14, wickets: 14, economy: 8.42, bowlAvg: 24.43, bowlSr: 17.43 }, country: 'West Indies' },
];

// Budget current players - 0.5 crore
export const budgetPlayers: Player[] = [
  { id: '81', name: 'Tanmay Agarwal', role: 'BAT', basePrice: 0.5, era: 'current', ipl: { matches: 6, runs: 128, avg: 21.33, sr: 128.00 }, t20i: { matches: 1, runs: 5, avg: 5.00, sr: 83.33 }, country: 'India' },
  { id: '82', name: 'Shahrukh Khan', role: 'BAT', basePrice: 0.5, era: 'current', ipl: { matches: 18, runs: 320, avg: 22.85, sr: 133.61, fifties: 1, hundreds: 0 }, t20i: { matches: 4, runs: 56, avg: 14.00, sr: 116.67 }, country: 'India' },
  { id: '83', name: 'Mandeep Singh', role: 'BAT', basePrice: 0.5, era: 'current', ipl: { matches: 46, runs: 1023, avg: 24.34, sr: 127.31, fifties: 7, hundreds: 0 }, t20i: { matches: 13, runs: 186, avg: 15.50, sr: 112.72 }, country: 'India' },
  { id: '84', name: 'Navdeep Saini', role: 'BOWL', basePrice: 0.5, era: 'current', ipl: { matches: 36, wickets: 36, economy: 8.22, bowlAvg: 27.11, bowlSr: 19.83 }, t20i: { matches: 22, wickets: 18, economy: 8.61, bowlAvg: 27.83, bowlSr: 19.39 }, country: 'India' },
  { id: '85', name: 'Kuldeep Sen', role: 'BOWL', basePrice: 0.5, era: 'current', ipl: { matches: 14, wickets: 16, economy: 8.30, bowlAvg: 24.25, bowlSr: 17.50 }, t20i: { matches: 8, wickets: 6, economy: 9.28 }, country: 'India' },
  { id: '86', name: 'Chetan Sakariya', role: 'BOWL', basePrice: 0.5, era: 'current', ipl: { matches: 14, wickets: 11, economy: 8.54, bowlAvg: 29.09, bowlSr: 20.45 }, t20i: { matches: 3, wickets: 1, economy: 8.33 }, country: 'India' },
  { id: '87', name: 'Krishnappa Gowtham', role: 'AR', basePrice: 0.5, era: 'current', ipl: { matches: 40, runs: 469, avg: 17.37, sr: 119.85, wickets: 29, economy: 7.80 }, t20i: { matches: 9, runs: 76, avg: 15.20, sr: 100.00, wickets: 8, economy: 7.44 }, country: 'India' },
  { id: '88', name: 'Karun Nair', role: 'BAT', basePrice: 0.5, era: 'current', ipl: { matches: 48, runs: 1151, avg: 28.07, sr: 125.08, fifties: 8, hundreds: 0 }, t20i: { matches: 8, runs: 181, avg: 22.62, sr: 121.21, fifties: 1, hundreds: 0 }, country: 'India' },
  { id: '89', name: 'Vishnu Vinod', role: 'WK', basePrice: 0.5, era: 'current', ipl: { matches: 8, runs: 158, avg: 19.75, sr: 127.64 }, t20i: { matches: 4, runs: 69, avg: 17.25, sr: 130.19 }, country: 'India' },
  { id: '90', name: 'Hanuma Vihari', role: 'BAT', basePrice: 0.5, era: 'current', ipl: { matches: 35, runs: 824, avg: 26.58, sr: 125.65, fifties: 5, hundreds: 0 }, t20i: { matches: 19, runs: 353, avg: 21.44, sr: 115.23, fifties: 2, hundreds: 0 }, country: 'India' },
];

// ─── ALL-TIME LEGENDS ────────────────────────────────────────────────────────

export const legendPlayers: Player[] = [
  // Indian Legends
  { id: 'L1', name: 'Sachin Tendulkar', role: 'BAT', basePrice: 2, era: 'legend', ipl: { matches: 78, runs: 2334, avg: 34.83, sr: 119.82, fifties: 13, hundreds: 1 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: 'L2', name: 'Sourav Ganguly', role: 'BAT', basePrice: 2, era: 'legend', ipl: { matches: 59, runs: 1349, avg: 26.45, sr: 116.76, fifties: 7, hundreds: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: 'L3', name: 'Rahul Dravid', role: 'BAT', basePrice: 2, era: 'legend', ipl: { matches: 89, runs: 2174, avg: 31.97, sr: 110.56, fifties: 13, hundreds: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: 'L4', name: 'VVS Laxman', role: 'BAT', basePrice: 1.5, era: 'legend', ipl: { matches: 10, runs: 242, avg: 26.89, sr: 117.47, fifties: 1, hundreds: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: 'L5', name: 'Virender Sehwag', role: 'BAT', basePrice: 2, era: 'legend', ipl: { matches: 104, runs: 2728, avg: 27.00, sr: 153.80, fifties: 15, hundreds: 1 }, t20i: { matches: 19, runs: 394, avg: 21.90, sr: 145.02, fifties: 2, hundreds: 0 }, country: 'India' },
  { id: 'L6', name: 'Yuvraj Singh', role: 'AR', basePrice: 2, era: 'legend', ipl: { matches: 132, runs: 2750, avg: 28.93, sr: 136.63, wickets: 38, economy: 7.87, fifties: 14, hundreds: 0 }, t20i: { matches: 58, runs: 1177, avg: 25.58, sr: 136.55, wickets: 28, economy: 7.26, fifties: 8, hundreds: 0 }, country: 'India' },
  { id: 'L7', name: 'Harbhajan Singh', role: 'BOWL', basePrice: 1.5, era: 'legend', ipl: { matches: 163, wickets: 150, economy: 7.05, bowlAvg: 26.29, bowlSr: 22.38 }, t20i: { matches: 28, wickets: 25, economy: 6.89, bowlAvg: 20.44, bowlSr: 17.76 }, country: 'India' },
  { id: 'L8', name: 'Zaheer Khan', role: 'BOWL', basePrice: 1.5, era: 'legend', ipl: { matches: 100, wickets: 102, economy: 7.59, bowlAvg: 23.72, bowlSr: 18.73 }, t20i: { matches: 17, wickets: 17, economy: 7.62, bowlAvg: 22.00, bowlSr: 17.29 }, country: 'India' },
  { id: 'L9', name: 'Gautam Gambhir', role: 'BAT', basePrice: 1.5, era: 'legend', ipl: { matches: 154, runs: 4217, avg: 31.23, sr: 123.89, fifties: 34, hundreds: 0 }, t20i: { matches: 37, runs: 932, avg: 27.41, sr: 119.24, fifties: 7, hundreds: 0 }, country: 'India' },
  { id: 'L10', name: 'Suresh Raina', role: 'AR', basePrice: 2, era: 'legend', ipl: { matches: 205, runs: 5528, avg: 32.52, sr: 136.76, wickets: 36, economy: 7.46, fifties: 39, hundreds: 1 }, t20i: { matches: 78, runs: 1605, avg: 29.18, sr: 134.87, wickets: 28, economy: 7.86, fifties: 10, hundreds: 0 }, country: 'India' },
  { id: 'L11', name: 'Irfan Pathan', role: 'AR', basePrice: 1.5, era: 'legend', ipl: { matches: 96, runs: 1144, avg: 17.87, sr: 118.47, wickets: 76, economy: 7.57, bowlAvg: 26.49, bowlSr: 20.96 }, t20i: { matches: 24, runs: 172, avg: 10.75, sr: 100.00, wickets: 28, economy: 7.68, bowlAvg: 19.32, bowlSr: 15.07 }, country: 'India' },
  // Foreign Legends
  { id: 'L12', name: 'AB de Villiers', role: 'BAT', basePrice: 2, era: 'legend', ipl: { matches: 184, runs: 5162, avg: 39.70, sr: 151.69, fifties: 40, hundreds: 3 }, t20i: { matches: 78, runs: 1672, avg: 26.46, sr: 134.87, fifties: 10, hundreds: 0 }, country: 'South Africa' },
  { id: 'L13', name: 'Chris Gayle', role: 'BAT', basePrice: 2, era: 'legend', ipl: { matches: 141, runs: 4954, avg: 40.11, sr: 149.70, fifties: 36, hundreds: 6 }, t20i: { matches: 58, runs: 1899, avg: 38.76, sr: 145.42, fifties: 14, hundreds: 2 }, country: 'West Indies' },
  { id: 'L14', name: 'Kieron Pollard', role: 'AR', basePrice: 2, era: 'legend', ipl: { matches: 203, runs: 3417, avg: 28.22, sr: 137.98, wickets: 35, economy: 8.63, fifties: 17, hundreds: 0 }, t20i: { matches: 90, runs: 1368, avg: 22.44, sr: 135.40, wickets: 16, economy: 7.78 }, country: 'West Indies' },
  { id: 'L15', name: 'Lasith Malinga', role: 'BOWL', basePrice: 2, era: 'legend', ipl: { matches: 122, wickets: 170, economy: 7.14, bowlAvg: 19.80, bowlSr: 16.64 }, t20i: { matches: 84, wickets: 107, economy: 7.73, bowlAvg: 20.12, bowlSr: 15.59 }, country: 'Sri Lanka' },
  { id: 'L16', name: 'Kumar Sangakkara', role: 'WK', basePrice: 2, era: 'legend', ipl: { matches: 71, runs: 2070, avg: 31.36, sr: 118.23, fifties: 15, hundreds: 1 }, t20i: { matches: 56, runs: 1382, avg: 27.09, sr: 120.38, fifties: 8, hundreds: 0 }, country: 'Sri Lanka' },
  { id: 'L17', name: 'Mahela Jayawardena', role: 'BAT', basePrice: 1.5, era: 'legend', ipl: { matches: 91, runs: 2390, avg: 30.64, sr: 127.82, fifties: 18, hundreds: 0 }, t20i: { matches: 55, runs: 1016, avg: 22.13, sr: 126.68, fifties: 5, hundreds: 0 }, country: 'Sri Lanka' },
  { id: 'L18', name: 'Muttiah Muralitharan', role: 'BOWL', basePrice: 1.5, era: 'legend', ipl: { matches: 66, wickets: 63, economy: 6.67, bowlAvg: 25.56, bowlSr: 23.00 }, t20i: { matches: 12, wickets: 13, economy: 5.95, bowlAvg: 17.77, bowlSr: 17.92 }, country: 'Sri Lanka' },
  { id: 'L19', name: 'Shane Bond', role: 'BOWL', basePrice: 1.5, era: 'legend', ipl: { matches: 19, wickets: 22, economy: 6.26, bowlAvg: 15.86, bowlSr: 15.18 }, t20i: { matches: 18, wickets: 25, economy: 5.76, bowlAvg: 14.00, bowlSr: 14.56 }, country: 'New Zealand' },
  { id: 'L20', name: 'Daniel Vettori', role: 'AR', basePrice: 1.5, era: 'legend', ipl: { matches: 55, runs: 426, avg: 15.77, sr: 96.81, wickets: 43, economy: 6.29, bowlAvg: 22.30, bowlSr: 21.26 }, t20i: { matches: 34, runs: 179, avg: 11.93, sr: 91.33, wickets: 38, economy: 6.10, bowlAvg: 17.84, bowlSr: 17.52 }, country: 'New Zealand' },
  { id: 'L21', name: 'Shaun Pollock', role: 'AR', basePrice: 1.5, era: 'legend', ipl: { matches: 22, runs: 180, avg: 15.00, sr: 101.69, wickets: 22, economy: 6.85, bowlAvg: 19.18, bowlSr: 16.82 }, t20i: { matches: 12, runs: 56, avg: 8.00, sr: 93.33, wickets: 11, economy: 6.42, bowlAvg: 17.36, bowlSr: 16.18 }, country: 'South Africa' },
  { id: 'L22', name: 'Shoaib Akhtar', role: 'BOWL', basePrice: 1.5, era: 'legend', ipl: { matches: 6, wickets: 5, economy: 7.83, bowlAvg: 30.20, bowlSr: 23.20 }, t20i: { matches: 15, wickets: 13, economy: 7.00, bowlAvg: 21.00, bowlSr: 18.00 }, country: 'Pakistan' },
  { id: 'L23', name: 'Herschelle Gibbs', role: 'BAT', basePrice: 1, era: 'legend', ipl: { matches: 53, runs: 1298, avg: 27.61, sr: 140.17, fifties: 9, hundreds: 1 }, t20i: { matches: 23, runs: 481, avg: 22.90, sr: 135.77, fifties: 3, hundreds: 0 }, country: 'South Africa' },
  { id: 'L24', name: 'Chaminda Vaas', role: 'BOWL', basePrice: 1, era: 'legend', ipl: { matches: 18, wickets: 18, economy: 7.38, bowlAvg: 26.00, bowlSr: 21.17 }, t20i: { matches: 6, wickets: 5, economy: 7.20, bowlAvg: 22.40, bowlSr: 18.60 }, country: 'Sri Lanka' },
  { id: 'L25', name: 'Matthew Hayden', role: 'BAT', basePrice: 1, era: 'legend', ipl: { matches: 30, runs: 572, avg: 21.18, sr: 120.67, fifties: 4, hundreds: 0 }, t20i: { matches: 9, runs: 206, avg: 25.75, sr: 125.61, fifties: 1, hundreds: 0 }, country: 'Australia' },
  { id: 'L26', name: 'Adam Gilchrist', role: 'WK', basePrice: 2, era: 'legend', ipl: { matches: 71, runs: 1812, avg: 26.64, sr: 142.26, fifties: 12, hundreds: 1 }, t20i: { matches: 13, runs: 338, avg: 28.17, sr: 139.09, fifties: 2, hundreds: 0 }, country: 'Australia' },
  { id: 'L27', name: 'Brendon McCullum', role: 'WK', basePrice: 2, era: 'legend', ipl: { matches: 109, runs: 2880, avg: 30.97, sr: 131.92, fifties: 20, hundreds: 1 }, t20i: { matches: 71, runs: 2140, avg: 35.67, sr: 136.39, fifties: 13, hundreds: 2 }, country: 'New Zealand' },
  { id: 'L28', name: 'Jacques Kallis', role: 'AR', basePrice: 2, era: 'legend', ipl: { matches: 98, runs: 2427, avg: 33.29, sr: 111.63, wickets: 18, economy: 7.55, fifties: 20, hundreds: 0 }, t20i: { matches: 38, runs: 666, avg: 22.20, sr: 102.15, wickets: 12, economy: 7.25, fifties: 3, hundreds: 0 }, country: 'South Africa' },
  { id: 'L29', name: 'Tillakaratne Dilshan', role: 'AR', basePrice: 1.5, era: 'legend', ipl: { matches: 66, runs: 1513, avg: 24.40, sr: 125.52, wickets: 15, economy: 7.20, fifties: 10, hundreds: 0 }, t20i: { matches: 80, runs: 1889, avg: 28.19, sr: 122.54, wickets: 21, economy: 7.06, fifties: 14, hundreds: 0 }, country: 'Sri Lanka' },
  { id: 'L30', name: 'Ricky Ponting', role: 'BAT', basePrice: 1.5, era: 'legend', ipl: { matches: 66, runs: 1444, avg: 27.24, sr: 117.84, fifties: 11, hundreds: 0 }, t20i: { matches: 17, runs: 401, avg: 26.73, sr: 111.97, fifties: 3, hundreds: 0 }, country: 'Australia' },
];

// ─── COMBINED DATA ───────────────────────────────────────────────────────────

export const currentPlayers: Player[] = [
  ...topTierPlayers,
  ...premiumPlayers,
  ...midTierPlayers,
  ...budgetPlayers,
];

export const allPlayers: Player[] = [...currentPlayers, ...legendPlayers];

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────

export function getRandomPlayers(
  count: number,
  era: 'current' | 'legend' | 'mixed' = 'mixed'
): Player[] {
  let pool: Player[];
  if (era === 'current') {
    pool = [...currentPlayers];
  } else if (era === 'legend') {
    // Always include all legends + fill rest with top current players
    const legends = [...legendPlayers];
    const topCurrent = [...topTierPlayers, ...premiumPlayers];
    pool = [...legends, ...topCurrent];
  } else {
    // Mixed: all legends + all current
    pool = [...allPlayers];
  }
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getPlayerById(id: string): Player | undefined {
  return allPlayers.find(p => p.id === id);
}
