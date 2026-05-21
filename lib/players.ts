export type PlayerRole = 'BAT' | 'BOWL' | 'AR' | 'WK';

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
}

// Top 30 players - 2 crore base
export const topTierPlayers: Player[] = [
  { id: '1', name: 'Virat Kohli', role: 'BAT', basePrice: 2, ipl: { matches: 278, runs: 9040, avg: 39.65, sr: 133.27, fifties: 66, hundreds: 7 }, t20i: { matches: 125, runs: 4188, avg: 48.7, sr: 137.05, fifties: 38, hundreds: 1 }, country: 'India' },
  { id: '2', name: 'Jasprit Bumrah', role: 'BOWL', basePrice: 2, ipl: { matches: 132, wickets: 165, economy: 7.43, bowlAvg: 23.55, bowlSr: 15.67 }, t20i: { matches: 89, wickets: 96, economy: 6.68, bowlAvg: 20.32, bowlSr: 13.90 }, country: 'India' },
  { id: '3', name: 'Rohit Sharma', role: 'BAT', basePrice: 2, ipl: { matches: 243, runs: 6213, avg: 30.66, sr: 130.08, fifties: 42, hundreds: 2 }, t20i: { matches: 159, runs: 4312, avg: 32.54, sr: 135.42, fifties: 30, hundreds: 5 }, country: 'India' },
  { id: '4', name: 'MS Dhoni', role: 'WK', basePrice: 2, ipl: { matches: 251, runs: 5082, avg: 38.06, sr: 136.54, fifties: 23, hundreds: 0 }, t20i: { matches: 98, runs: 1617, avg: 36.73, sr: 127.09, fifties: 5, hundreds: 0 }, country: 'India' },
  { id: '5', name: 'Hardik Pandya', role: 'AR', basePrice: 2, ipl: { matches: 118, runs: 2624, avg: 26.78, sr: 144.54, wickets: 47, economy: 7.85 }, t20i: { matches: 89, runs: 1404, avg: 25.07, sr: 135.46, wickets: 55, economy: 7.36 }, country: 'India' },
  { id: '6', name: 'Ravindra Jadeja', role: 'AR', basePrice: 2, ipl: { matches: 213, runs: 3111, avg: 26.16, sr: 126.87, wickets: 160, economy: 7.12, bowlAvg: 24.34, bowlSr: 22.26 }, t20i: { matches: 74, runs: 816, avg: 22.66, sr: 118.26, wickets: 83, economy: 6.73, bowlAvg: 18.54, bowlSr: 15.36 }, country: 'India' },
  { id: '7', name: 'KL Rahul', role: 'WK', basePrice: 2, ipl: { matches: 132, runs: 3896, avg: 34.60, sr: 135.86, fifties: 26, hundreds: 1 }, t20i: { matches: 72, runs: 2263, avg: 35.98, sr: 140.58, fifties: 16, hundreds: 2 }, country: 'India' },
  { id: '8', name: 'Shubman Gill', role: 'BAT', basePrice: 2, ipl: { matches: 74, runs: 2298, avg: 34.87, sr: 137.22, fifties: 14, hundreds: 3 }, t20i: { matches: 37, runs: 1263, avg: 36.08, sr: 144.79, fifties: 9, hundreds: 1 }, country: 'India' },
  { id: '9', name: 'Mohammed Shami', role: 'BOWL', basePrice: 2, ipl: { matches: 116, wickets: 127, economy: 8.10, bowlAvg: 25.90, bowlSr: 19.32 }, t20i: { matches: 61, wickets: 55, economy: 8.62, bowlAvg: 29.45, bowlSr: 20.64 }, country: 'India' },
  { id: '10', name: 'Mohammed Siraj', role: 'BOWL', basePrice: 2, ipl: { matches: 83, wickets: 94, economy: 7.84, bowlAvg: 23.78, bowlSr: 17.18 }, t20i: { matches: 41, wickets: 35, economy: 8.41, bowlAvg: 24.77, bowlSr: 18.20 }, country: 'India' },
  { id: '11', name: 'Shreyas Iyer', role: 'BAT', basePrice: 2, ipl: { matches: 109, runs: 3438, avg: 35.44, sr: 135.42, fifties: 26, hundreds: 3 }, t20i: { matches: 62, runs: 1733, avg: 30.22, sr: 127.38, fifties: 12, hundreds: 1 }, country: 'India' },
  { id: '12', name: 'Rishabh Pant', role: 'WK', basePrice: 2, ipl: { matches: 84, runs: 2538, avg: 34.02, sr: 147.53, fifties: 14, hundreds: 2 }, t20i: { matches: 66, runs: 1574, avg: 26.23, sr: 125.99, fifties: 8, hundreds: 0 }, country: 'India' },
  { id: '13', name: 'Suryakumar Yadav', role: 'BAT', basePrice: 2, ipl: { matches: 79, runs: 2156, avg: 31.24, sr: 140.12, fifties: 13, hundreds: 1 }, t20i: { matches: 51, runs: 1652, avg: 38.88, sr: 173.55, fifties: 13, hundreds: 4 }, country: 'India' },
  { id: '14', name: 'Axar Patel', role: 'AR', basePrice: 2, ipl: { matches: 111, runs: 1659, avg: 24.39, sr: 122.56, wickets: 94, economy: 7.10, bowlAvg: 22.44, bowlSr: 20.16 }, t20i: { matches: 60, runs: 584, avg: 18.25, sr: 108.36, wickets: 52, economy: 6.45, bowlAvg: 16.50, bowlSr: 14.88 }, country: 'India' },
  { id: '15', name: 'Shivam Dube', role: 'AR', basePrice: 2, ipl: { matches: 62, runs: 1329, avg: 28.70, sr: 143.28, wickets: 8, economy: 7.95 }, t20i: { matches: 32, runs: 528, avg: 22.00, sr: 128.70, wickets: 7, economy: 8.30 }, country: 'India' },
  { id: '16', name: 'Arshdeep Singh', role: 'BOWL', basePrice: 2, ipl: { matches: 62, wickets: 61, economy: 7.90, bowlAvg: 26.08, bowlSr: 18.90 }, t20i: { matches: 37, wickets: 46, economy: 8.04, bowlAvg: 19.85, bowlSr: 15.12 }, country: 'India' },
  { id: '17', name: 'Yuzvendra Chahal', role: 'BOWL', basePrice: 2, ipl: { matches: 105, wickets: 138, economy: 7.52, bowlAvg: 20.45, bowlSr: 17.22 }, t20i: { matches: 59, wickets: 66, economy: 8.18, bowlAvg: 22.36, bowlSr: 17.40 }, country: 'India' },
  { id: '18', name: 'Kuldeep Yadav', role: 'BOWL', basePrice: 2, ipl: { matches: 77, wickets: 88, economy: 7.72, bowlAvg: 22.80, bowlSr: 18.60 }, t20i: { matches: 33, wickets: 43, economy: 7.66, bowlAvg: 17.44, bowlSr: 13.28 }, country: 'India' },
  { id: '19', name: 'Mohit Sharma', role: 'BOWL', basePrice: 2, ipl: { matches: 84, wickets: 78, economy: 8.15, bowlAvg: 27.10, bowlSr: 20.12 }, t20i: { matches: 44, wickets: 42, economy: 7.70, bowlAvg: 23.52, bowlSr: 17.42 }, country: 'India' },
  { id: '20', name: 'Umesh Yadav', role: 'BOWL', basePrice: 2, ipl: { matches: 91, wickets: 72, economy: 8.38, bowlAvg: 28.56, bowlSr: 21.20 }, t20i: { matches: 34, wickets: 17, economy: 8.71, bowlAvg: 32.50, bowlSr: 21.22 }, country: 'India' },
  { id: '21', name: 'Bhuvneshwar Kumar', role: 'BOWL', basePrice: 2, ipl: { matches: 154, wickets: 152, economy: 7.35, bowlAvg: 25.22, bowlSr: 18.24 }, t20i: { matches: 87, wickets: 71, economy: 7.62, bowlAvg: 26.80, bowlSr: 18.92 }, country: 'India' },
  { id: '22', name: 'Ishan Kishan', role: 'WK', basePrice: 2, ipl: { matches: 69, runs: 1790, avg: 29.02, sr: 132.05, fifties: 9, hundreds: 1 }, t20i: { matches: 34, runs: 862, avg: 28.73, sr: 128.36, fifties: 4, hundreds: 0 }, country: 'India' },
  { id: '23', name: 'Sanju Samson', role: 'WK', basePrice: 2, ipl: { matches: 114, runs: 3011, avg: 31.36, sr: 134.53, fifties: 16, hundreds: 3 }, t20i: { matches: 28, runs: 542, avg: 22.58, sr: 120.09, fifties: 2, hundreds: 0 }, country: 'India' },
  { id: '24', name: 'Ruturaj Gaikwad', role: 'BAT', basePrice: 2, ipl: { matches: 58, runs: 1792, avg: 33.74, sr: 131.23, fifties: 12, hundreds: 2 }, t20i: { matches: 17, runs: 461, avg: 30.73, sr: 130.41, fifties: 3, hundreds: 0 }, country: 'India' },
  { id: '25', name: 'Prithvi Shaw', role: 'BAT', basePrice: 2, ipl: { matches: 57, runs: 1734, avg: 32.70, sr: 144.12, fifties: 12, hundreds: 1 }, t20i: { matches: 18, runs: 475, avg: 26.38, sr: 138.54, fifties: 3, hundreds: 0 }, country: 'India' },
  { id: '26', name: 'Devdutt Padikkal', role: 'BAT', basePrice: 2, ipl: { matches: 34, runs: 1157, avg: 36.15, sr: 131.72, fifties: 9, hundreds: 1 }, t20i: { matches: 12, runs: 297, avg: 27.00, sr: 119.76, fifties: 1, hundreds: 0 }, country: 'India' },
  { id: '27', name: 'Venkatesh Iyer', role: 'AR', basePrice: 2, ipl: { matches: 28, runs: 641, avg: 27.86, sr: 132.43, wickets: 7, economy: 7.65 }, t20i: { matches: 15, runs: 221, avg: 17.76, sr: 114.06, wickets: 4, economy: 7.28 }, country: 'India' },
  { id: '28', name: 'Rahul Tripathi', role: 'BAT', basePrice: 2, ipl: { matches: 59, runs: 1570, avg: 29.81, sr: 138.72, fifties: 9, hundreds: 1 }, t20i: { matches: 14, runs: 262, avg: 23.81, sr: 122.43, fifties: 1, hundreds: 0 }, country: 'India' },
  { id: '29', name: 'Tilak Varma', role: 'BAT', basePrice: 2, ipl: { matches: 27, runs: 746, avg: 31.08, sr: 131.34, fifties: 4, hundreds: 0 }, t20i: { matches: 16, runs: 343, avg: 24.50, sr: 126.01, fifties: 2, hundreds: 0 }, country: 'India' },
  { id: '30', name: 'Washington Sundar', role: 'AR', basePrice: 2, ipl: { matches: 36, runs: 493, avg: 20.54, sr: 110.56, wickets: 25, economy: 7.22, bowlAvg: 26.40, bowlSr: 24.10 }, t20i: { matches: 26, runs: 198, avg: 14.85, sr: 98.51, wickets: 16, economy: 6.35, bowlAvg: 17.00, bowlSr: 15.50 }, country: 'India' },
];

// Premium players - 1.5 crore
export const premiumPlayers: Player[] = [
  { id: '31', name: 'David Warner', role: 'BAT', basePrice: 1.5, ipl: { matches: 184, runs: 5884, avg: 40.30, sr: 140.45 }, t20i: { matches: 106, runs: 3277, avg: 36.38, sr: 140.34 }, country: 'Australia' },
  { id: '32', name: 'Faf du Plessis', role: 'BAT', basePrice: 1.5, ipl: { matches: 156, runs: 4695, avg: 35.98, sr: 131.49 }, t20i: { matches: 70, runs: 1781, avg: 28.11, sr: 129.67 }, country: 'South Africa' },
  { id: '33', name: 'Steve Smith', role: 'BAT', basePrice: 1.5, ipl: { matches: 98, runs: 2778, avg: 33.90, sr: 135.99 }, t20i: { matches: 75, runs: 2053, avg: 31.58, sr: 140.45 }, country: 'Australia' },
  { id: '34', name: 'Glenn Maxwell', role: 'AR', basePrice: 1.5, ipl: { matches: 98, runs: 2361, avg: 27.69, sr: 150.44, wickets: 14 }, t20i: { matches: 89, runs: 2073, avg: 27.64, sr: 153.40, wickets: 25 }, country: 'Australia' },
  { id: '35', name: 'Pat Cummins', role: 'BOWL', basePrice: 1.5, ipl: { matches: 46, wickets: 45, economy: 8.26 }, t20i: { matches: 64, wickets: 55, economy: 7.58 }, country: 'Australia' },
  { id: '36', name: 'Mitchell Starc', role: 'BOWL', basePrice: 1.5, ipl: { matches: 75, wickets: 90, economy: 7.98 }, t20i: { matches: 62, wickets: 55, economy: 7.47 }, country: 'Australia' },
  { id: '37', name: 'Kane Williamson', role: 'BAT', basePrice: 1.5, ipl: { matches: 76, runs: 2083, avg: 34.72, sr: 123.59 }, t20i: { matches: 62, runs: 1823, avg: 33.24, sr: 121.86 }, country: 'New Zealand' },
  { id: '38', name: 'Trent Boult', role: 'BOWL', basePrice: 1.5, ipl: { matches: 62, wickets: 74, economy: 7.99 }, t20i: { matches: 44, wickets: 55, economy: 7.73 }, country: 'New Zealand' },
  { id: '39', name: 'Rashid Khan', role: 'BOWL', basePrice: 1.5, ipl: { matches: 76, wickets: 110, economy: 6.21 }, t20i: { matches: 56, wickets: 76, economy: 5.83 }, country: 'Afghanistan' },
  { id: '40', name: 'Andre Russell', role: 'AR', basePrice: 1.5, ipl: { matches: 109, runs: 2193, avg: 26.43, sr: 174.10, wickets: 67 }, t20i: { matches: 47, runs: 586, avg: 18.31, sr: 165.06, wickets: 31 }, country: 'West Indies' },
  { id: '41', name: 'Sunil Narine', role: 'AR', basePrice: 1.5, ipl: { matches: 112, runs: 1473, avg: 21.04, sr: 128.94, wickets: 120 }, t20i: { matches: 51, runs: 456, avg: 13.52, sr: 110.17, wickets: 45 }, country: 'West Indies' },
  { id: '42', name: 'Kieron Pollard', role: 'AR', basePrice: 1.5, ipl: { matches: 203, runs: 3417, avg: 28.22, sr: 137.98, wickets: 35 }, t20i: { matches: 90, runs: 1368, avg: 22.44, sr: 135.40, wickets: 16 }, country: 'West Indies' },
  { id: '43', name: 'Chris Gayle', role: 'BAT', basePrice: 1.5, ipl: { matches: 141, runs: 4954, avg: 40.11, sr: 149.70 }, t20i: { matches: 58, runs: 1899, avg: 38.76, sr: 145.42 }, country: 'West Indies' },
  { id: '44', name: 'AB de Villiers', role: 'BAT', basePrice: 1.5, ipl: { matches: 184, runs: 5162, avg: 39.70, sr: 151.69 }, t20i: { matches: 78, runs: 1672, avg: 26.46, sr: 134.87 }, country: 'South Africa' },
  { id: '45', name: 'Quinton de Kock', role: 'WK', basePrice: 1.5, ipl: { matches: 79, runs: 2338, avg: 32.46, sr: 140.68 }, t20i: { matches: 63, runs: 1768, avg: 30.48, sr: 136.70 }, country: 'South Africa' },
  { id: '46', name: 'Kagiso Rabada', role: 'BOWL', basePrice: 1.5, ipl: { matches: 63, wickets: 77, economy: 7.70 }, t20i: { matches: 53, wickets: 55, economy: 7.62 }, country: 'South Africa' },
  { id: '47', name: 'Lungi Ngidi', role: 'BOWL', basePrice: 1.5, ipl: { matches: 36, wickets: 45, economy: 7.98 }, t20i: { matches: 26, wickets: 30, economy: 7.81 }, country: 'South Africa' },
  { id: '48', name: 'Eoin Morgan', role: 'BAT', basePrice: 1.5, ipl: { matches: 84, runs: 1852, avg: 30.03, sr: 133.54 }, t20i: { matches: 96, runs: 2275, avg: 29.68, sr: 136.44 }, country: 'England' },
  { id: '49', name: 'Ben Stokes', role: 'AR', basePrice: 1.5, ipl: { matches: 71, runs: 1681, avg: 27.70, sr: 139.47, wickets: 43 }, t20i: { matches: 79, runs: 1388, avg: 23.84, sr: 136.58, wickets: 42 }, country: 'England' },
  { id: '50', name: 'Jos Buttler', role: 'WK', basePrice: 1.5, ipl: { matches: 84, runs: 2716, avg: 37.19, sr: 149.61 }, t20i: { matches: 62, runs: 1881, avg: 32.43, sr: 145.10 }, country: 'England' },
  { id: '51', name: 'Jofra Archer', role: 'BOWL', basePrice: 1.5, ipl: { matches: 29, wickets: 29, economy: 7.68 }, t20i: { matches: 29, wickets: 30, economy: 7.26 }, country: 'England' },
  { id: '52', name: 'Mark Wood', role: 'BOWL', basePrice: 1.5, ipl: { matches: 20, wickets: 19, economy: 8.52 }, t20i: { matches: 32, wickets: 37, economy: 7.91 }, country: 'England' },
  { id: '53', name: 'Adil Rashid', role: 'BOWL', basePrice: 1.5, ipl: { matches: 50, wickets: 56, economy: 7.12 }, t20i: { matches: 67, wickets: 65, economy: 7.11 }, country: 'England' },
  { id: '54', name: 'Moeen Ali', role: 'AR', basePrice: 1.5, ipl: { matches: 64, runs: 823, avg: 20.57, sr: 129.30, wickets: 46 }, t20i: { matches: 70, runs: 684, avg: 16.00, sr: 117.70, wickets: 44 }, country: 'England' },
  { id: '55', name: 'Jason Roy', role: 'BAT', basePrice: 1.5, ipl: { matches: 71, runs: 1831, avg: 29.53, sr: 140.20 }, t20i: { matches: 67, runs: 1670, avg: 27.83, sr: 138.01 }, country: 'England' },
  { id: '56', name: 'Chris Jordan', role: 'BOWL', basePrice: 1.5, ipl: { matches: 65, wickets: 61, economy: 7.97 }, t20i: { matches: 68, wickets: 54, economy: 8.04 }, country: 'England' },
  { id: '57', name: 'Sam Curran', role: 'AR', basePrice: 1.5, ipl: { matches: 40, runs: 670, avg: 23.92, sr: 135.76, wickets: 42 }, t20i: { matches: 37, runs: 510, avg: 18.21, sr: 129.47, wickets: 38 }, country: 'England' },
  { id: '58', name: 'Dawid Malan', role: 'BAT', basePrice: 1.5, ipl: { matches: 12, runs: 354, avg: 35.40, sr: 134.47 }, t20i: { matches: 37, runs: 1028, avg: 32.12, sr: 145.40 }, country: 'England' },
  { id: '59', name: 'Tabraiz Shamsi', role: 'BOWL', basePrice: 1.5, ipl: { matches: 24, wickets: 25, economy: 6.86 }, t20i: { matches: 36, wickets: 41, economy: 6.49 }, country: 'South Africa' },
  { id: '60', name: 'Mahendra Singh Dhoni', role: 'WK', basePrice: 1.5, ipl: { matches: 251, runs: 5082, avg: 38.06, sr: 136.54 }, t20i: { matches: 98, runs: 1617, avg: 36.73, sr: 127.09 }, country: 'India' },
  { id: '61', name: 'AB Devilliers', role: 'BAT', basePrice: 1.5, ipl: { matches: 184, runs: 5162, avg: 39.70, sr: 151.69 }, t20i: { matches: 78, runs: 1672, avg: 26.46, sr: 134.87 }, country: 'South Africa' },
  { id: '62', name: 'Marcus Stoinis', role: 'AR', basePrice: 1.5, ipl: { matches: 57, runs: 876, avg: 22.97, sr: 132.72, wickets: 27 }, t20i: { matches: 49, runs: 555, avg: 17.90, sr: 128.64, wickets: 20 }, country: 'Australia' },
  { id: '63', name: 'Nathan Ellis', role: 'BOWL', basePrice: 1.5, ipl: { matches: 20, wickets: 23, economy: 7.82 }, t20i: { matches: 18, wickets: 20, economy: 7.56 }, country: 'Australia' },
  { id: '64', name: 'Rovman Powell', role: 'BAT', basePrice: 1.5, ipl: { matches: 34, runs: 676, avg: 23.31, sr: 144.73 }, t20i: { matches: 28, runs: 538, avg: 22.42, sr: 134.16 }, country: 'West Indies' },
  { id: '65', name: 'Odean Smith', role: 'BOWL', basePrice: 1.5, ipl: { matches: 19, wickets: 18, economy: 8.85 }, t20i: { matches: 14, wickets: 14, economy: 8.42 }, country: 'West Indies' },
  { id: '66', name: 'Alzarri Joseph', role: 'BOWL', basePrice: 1.5, ipl: { matches: 30, wickets: 32, economy: 8.33 }, t20i: { matches: 36, wickets: 34, economy: 8.23 }, country: 'West Indies' },
  { id: '67', name: 'Romario Shepherd', role: 'AR', basePrice: 1.5, ipl: { matches: 24, runs: 212, avg: 14.13, sr: 105.47, wickets: 18 }, t20i: { matches: 22, runs: 127, avg: 9.77, sr: 95.49, wickets: 18 }, country: 'West Indies' },
  { id: '68', name: 'Nicholas Pooran', role: 'WK', basePrice: 1.5, ipl: { matches: 42, runs: 1008, avg: 26.53, sr: 143.47 }, t20i: { matches: 45, runs: 924, avg: 23.69, sr: 132.66 }, country: 'West Indies' },
  { id: '69', name: 'Shimron Hetmyer', role: 'BAT', basePrice: 1.5, ipl: { matches: 34, runs: 890, avg: 28.06, sr: 137.84 }, t20i: { matches: 33, runs: 789, avg: 27.20, sr: 135.50 }, country: 'West Indies' },
  { id: '70', name: 'Kyle Mayers', role: 'AR', basePrice: 1.5, ipl: { matches: 18, runs: 339, avg: 22.60, sr: 131.40, wickets: 5 }, t20i: { matches: 20, runs: 346, avg: 20.35, sr: 123.83, wickets: 4 }, country: 'West Indies' },
  { id: '71', name: 'Jason Holder', role: 'AR', basePrice: 1.5, ipl: { matches: 41, runs: 535, avg: 19.81, sr: 122.70, wickets: 28 }, t20i: { matches: 54, runs: 450, avg: 15.00, sr: 103.23, wickets: 41 }, country: 'West Indies' },
  { id: '72', name: '锁 Aaron Finch', role: 'BAT', basePrice: 1.5, ipl: { matches: 75, runs: 1736, avg: 27.71, sr: 133.10 }, t20i: { matches: 111, runs: 3114, avg: 32.44, sr: 142.87 }, country: 'Australia' },
  { id: '73', name: 'Daryl Mitchell', role: 'BAT', basePrice: 1.5, ipl: { matches: 28, runs: 663, avg: 27.62, sr: 128.79 }, t20i: { matches: 42, runs: 1051, avg: 30.91, sr: 125.90 }, country: 'New Zealand' },
  { id: '74', name: 'Tim Southee', role: 'BOWL', basePrice: 1.5, ipl: { matches: 44, wickets: 39, economy: 8.25 }, t20i: { matches: 55, wickets: 55, economy: 7.78 }, country: 'New Zealand' },
  { id: '75', name: 'Lockie Ferguson', role: 'BOWL', basePrice: 1.5, ipl: { matches: 24, wickets: 26, economy: 8.49 }, t20i: { matches: 31, wickets: 33, economy: 8.19 }, country: 'New Zealand' },
  { id: '76', name: 'Jimmy Neesham', role: 'AR', basePrice: 1.5, ipl: { matches: 38, runs: 398, avg: 17.30, sr: 125.79, wickets: 30 }, t20i: { matches: 47, runs: 328, avg: 12.61, sr: 115.43, wickets: 39 }, country: 'New Zealand' },
  { id: '77', name: 'Mitchell Santner', role: 'AR', basePrice: 1.5, ipl: { matches: 41, runs: 379, avg: 18.05, sr: 114.19, wickets: 31 }, t20i: { matches: 45, runs: 267, avg: 12.71, sr: 99.63, wickets: 42 }, country: 'New Zealand' },
  { id: '78', name: 'Rachin Ravindra', role: 'AR', basePrice: 1.5, ipl: { matches: 18, runs: 295, avg: 21.07, sr: 120.90, wickets: 11 }, t20i: { matches: 22, runs: 378, avg: 21.00, sr: 124.18, wickets: 15 }, country: 'New Zealand' },
  { id: '79', name: 'Faf Du Plessis', role: 'BAT', basePrice: 1.5, ipl: { matches: 156, runs: 4695, avg: 35.98, sr: 131.49 }, t20i: { matches: 70, runs: 1781, avg: 28.11, sr: 129.67 }, country: 'South Africa' },
  { id: '80', name: 'Reeza Hendricks', role: 'BAT', basePrice: 1.5, ipl: { matches: 52, runs: 1389, avg: 30.42, sr: 138.21 }, t20i: { matches: 29, runs: 623, avg: 24.92, sr: 127.45 }, country: 'South Africa' },
];

// Mid-tier - 1 crore
export const midTierPlayers: Player[] = [
  { id: '81', name: 'Mayank Agarwal', role: 'BAT', basePrice: 1, ipl: { matches: 82, runs: 2353, avg: 31.77, sr: 135.63 }, t20i: { matches: 16, runs: 347, avg: 23.13, sr: 125.54 }, country: 'India' },
  { id: '82', name: 'Hanuma Vihari', role: 'BAT', basePrice: 1, ipl: { matches: 35, runs: 824, avg: 26.58, sr: 125.65 }, t20i: { matches: 19, runs: 353, avg: 21.44, sr: 115.23 }, country: 'India' },
  { id: '83', name: 'Krishnappa Gowtham', role: 'AR', basePrice: 1, ipl: { matches: 40, runs: 469, avg: 17.37, sr: 119.85, wickets: 29 }, t20i: { matches: 9, runs: 76, avg: 15.20, sr: 100.00, wickets: 8 }, country: 'India' },
  { id: '84', name: 'Krunal Pandya', role: 'AR', basePrice: 1, ipl: { matches: 58, runs: 768, avg: 19.69, sr: 121.14, wickets: 46 }, t20i: { matches: 21, runs: 160, avg: 12.30, sr: 103.22, wickets: 9 }, country: 'India' },
  { id: '85', name: 'Shardul Thakur', role: 'BOWL', basePrice: 1, ipl: { matches: 47, wickets: 42, economy: 8.41 }, t20i: { matches: 26, wickets: 21, economy: 8.84 }, country: 'India' },
  { id: '86', name: 'Navdeep Saini', role: 'BOWL', basePrice: 1, ipl: { matches: 36, wickets: 36, economy: 8.22 }, t20i: { matches: 22, wickets: 18, economy: 8.61 }, country: 'India' },
  { id: '87', name: 'Kuldeep Sen', role: 'BOWL', basePrice: 1, ipl: { matches: 14, wickets: 16, economy: 8.30 }, t20i: { matches: 8, wickets: 6, economy: 9.28 }, country: 'India' },
  { id: '88', name: 'Mukesh Choudhary', role: 'BOWL', basePrice: 1, ipl: { matches: 22, wickets: 26, economy: 7.97 }, t20i: { matches: 5, wickets: 2, economy: 9.40 }, country: 'India' },
  { id: '89', name: 'Khaleel Ahmed', role: 'BOWL', basePrice: 1, ipl: { matches: 34, wickets: 34, economy: 8.21 }, t20i: { matches: 18, wickets: 18, economy: 8.42 }, country: 'India' },
  { id: '90', name: 'Chetan Sakariya', role: 'BOWL', basePrice: 1, ipl: { matches: 14, wickets: 11, economy: 8.54 }, t20i: { matches: 3, wickets: 1, economy: 8.33 }, country: 'India' },
  { id: '91', name: 'Vijay Shankar', role: 'AR', basePrice: 1, ipl: { matches: 45, runs: 623, avg: 17.86, sr: 122.30, wickets: 19 }, t20i: { matches: 23, runs: 268, avg: 17.86, sr: 115.52, wickets: 8 }, country: 'India' },
  { id: '92', name: 'Rohit Singh', role: 'AR', basePrice: 1, ipl: { matches: 12, runs: 128, avg: 16.00, sr: 110.34, wickets: 7 }, t20i: { matches: 5, runs: 18, avg: 6.00, sr: 66.67, wickets: 4 }, country: 'India' },
  { id: '93', name: 'Kunal Singh', role: 'AR', basePrice: 1, ipl: { matches: 5, runs: 68, avg: 17.00, sr: 113.33, wickets: 3 }, t20i: { matches: 2, runs: 15, avg: 15.00, sr: 107.14, wickets: 1 }, country: 'India' },
  { id: '94', name: 'Anmolpreet Singh', role: 'BAT', basePrice: 1, ipl: { matches: 8, runs: 170, avg: 21.25, sr: 133.86 }, t20i: { matches: 2, runs: 14, avg: 7.00, sr: 87.50 }, country: 'India' },
  { id: '95', name: 'Ruturaj Gaikwad', role: 'BAT', basePrice: 1, ipl: { matches: 58, runs: 1792, avg: 33.74, sr: 131.23 }, t20i: { matches: 17, runs: 461, avg: 30.73, sr: 130.41 }, country: 'India' },
  { id: '96', name: 'Mahipal Lomror', role: 'AR', basePrice: 1, ipl: { matches: 24, runs: 318, avg: 17.66, sr: 119.09, wickets: 9 }, t20i: { matches: 9, runs: 96, avg: 16.00, sr: 105.49, wickets: 3 }, country: 'India' },
  { id: '97', name: 'Riyan Parv', role: 'AR', basePrice: 1, ipl: { matches: 22, runs: 297, avg: 18.56, sr: 120.00, wickets: 12 }, t20i: { matches: 6, runs: 46, avg: 9.20, sr: 102.22, wickets: 4 }, country: 'India' },
  { id: '98', name: 'Vishnu Vinod', role: 'WK', basePrice: 1, ipl: { matches: 8, runs: 158, avg: 19.75, sr: 127.64 }, t20i: { matches: 4, runs: 69, avg: 17.25, sr: 130.19 }, country: 'India' },
  { id: '99', name: 'Harvik Desai', role: 'WK', basePrice: 1, ipl: { matches: 6, runs: 113, avg: 18.83, sr: 128.41 }, t20i: { matches: 2, runs: 36, avg: 18.00, sr: 120.00 }, country: 'India' },
  { id: '100', name: 'Aman Khan', role: 'BOWL', basePrice: 1, ipl: { matches: 10, wickets: 8, economy: 8.59 }, t20i: { matches: 4, wickets: 4, economy: 8.50 }, country: 'India' },
  { id: '101', name: 'Yash Dayal', role: 'BOWL', basePrice: 1, ipl: { matches: 12, wickets: 14, economy: 7.87 }, t20i: { matches: 4, wickets: 3, economy: 9.00 }, country: 'India' },
  { id: '102', name: 'Kumar Kartikeya', role: 'BOWL', basePrice: 1, ipl: { matches: 13, wickets: 12, economy: 7.61 }, t20i: { matches: 4, wickets: 2, economy: 8.25 }, country: 'India' },
  { id: '103', name: 'Ravi Bishnoi', role: 'BOWL', basePrice: 1, ipl: { matches: 26, wickets: 25, economy: 7.31 }, t20i: { matches: 11, wickets: 10, economy: 7.54 }, country: 'India' },
  { id: '104', name: 'Prasidh Krishna', role: 'BOWL', basePrice: 1, ipl: { matches: 36, wickets: 34, economy: 8.43 }, t20i: { matches: 14, wickets: 12, economy: 8.93 }, country: 'India' },
  { id: '105', name: 'Mohsin Khan', role: 'BOWL', basePrice: 1, ipl: { matches: 15, wickets: 18, economy: 6.92 }, t20i: { matches: 7, wickets: 6, economy: 7.71 }, country: 'India' },
  { id: '106', name: 'Shahrukh Khan', role: 'BAT', basePrice: 1, ipl: { matches: 18, runs: 320, avg: 22.85, sr: 133.61 }, t20i: { matches: 4, runs: 56, avg: 14.00, sr: 116.67 }, country: 'India' },
  { id: '107', name: 'Rahul Tripathi', role: 'BAT', basePrice: 1, ipl: { matches: 59, runs: 1570, avg: 29.81, sr: 138.72 }, t20i: { matches: 14, runs: 262, avg: 23.81, sr: 122.43 }, country: 'India' },
  { id: '108', name: 'Sarfaraz Khan', role: 'BAT', basePrice: 1, ipl: { matches: 14, runs: 456, avg: 38.00, sr: 148.54 }, t20i: { matches: 3, runs: 24, avg: 8.00, sr: 109.09 }, country: 'India' },
  { id: '109', name: 'Nitish Rana', role: 'BAT', basePrice: 1, ipl: { matches: 55, runs: 1306, avg: 27.20, sr: 131.07 }, t20i: { matches: 10, runs: 183, avg: 20.33, sr: 127.08 }, country: 'India' },
  { id: '110', name: 'Ricky Bhui', role: 'BAT', basePrice: 1, ipl: { matches: 15, runs: 329, avg: 23.50, sr: 129.92 }, t20i: { matches: 3, runs: 42, avg: 14.00, sr: 116.67 }, country: 'India' },
  { id: '111', name: 'Manish Pandey', role: 'BAT', basePrice: 1, ipl: { matches: 154, runs: 3794, avg: 30.11, sr: 122.67 }, t20i: { matches: 39, runs: 786, avg: 23.15, sr: 116.47 }, country: 'India' },
  { id: '112', name: 'Karun Nair', role: 'BAT', basePrice: 1, ipl: { matches: 48, runs: 1151, avg: 28.07, sr: 125.08 }, t20i: { matches: 8, runs: 181, avg: 22.62, sr: 121.21 }, country: 'India' },
  { id: '113', name: 'Kedu', role: 'BOWL', basePrice: 1, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '114', name: 'Anrich Nortje', role: 'BOWL', basePrice: 1, ipl: { matches: 35, wickets: 38, economy: 7.92 }, t20i: { matches: 29, wickets: 33, economy: 7.44 }, country: 'South Africa' },
  { id: '115', name: 'Dwayne Pretorius', role: 'AR', basePrice: 1, ipl: { matches: 18, runs: 184, avg: 15.33, sr: 117.95, wickets: 17 }, t20i: { matches: 23, runs: 180, avg: 18.00, sr: 106.55, wickets: 19 }, country: 'South Africa' },
  { id: '116', name: 'Heinrich Klaasen', role: 'WK', basePrice: 1, ipl: { matches: 22, runs: 562, avg: 28.10, sr: 142.43 }, t20i: { matches: 21, runs: 501, avg: 27.83, sr: 143.53 }, country: 'South Africa' },
  { id: '117', name: 'Gerald Coetzee', role: 'BOWL', basePrice: 1, ipl: { matches: 14, wickets: 15, economy: 8.43 }, t20i: { matches: 11, wickets: 11, economy: 8.52 }, country: 'South Africa' },
  { id: '118', name: 'Lizaad Williams', role: 'BOWL', basePrice: 1, ipl: { matches: 13, wickets: 12, economy: 8.38 }, t20i: { matches: 12, wickets: 10, economy: 8.47 }, country: 'South Africa' },
  { id: '119', name: 'Ottniel Baartman', role: 'BOWL', basePrice: 1, ipl: { matches: 9, wickets: 9, economy: 8.22 }, t20i: { matches: 5, wickets: 4, economy: 9.20 }, country: 'South Africa' },
  { id: '120', name: 'Nandre Burger', role: 'BOWL', basePrice: 1, ipl: { matches: 10, wickets: 11, economy: 8.01 }, t20i: { matches: 9, wickets: 8, economy: 8.41 }, country: 'South Africa' },
  { id: '121', name: 'Bjorn Fortuin', role: 'AR', basePrice: 1, ipl: { matches: 9, runs: 41, avg: 8.20, sr: 89.13, wickets: 7 }, t20i: { matches: 6, runs: 27, avg: 9.00, sr: 93.10, wickets: 4 }, country: 'South Africa' },
  { id: '122', name: 'Mohammad Nabi', role: 'AR', basePrice: 1, ipl: { matches: 41, runs: 515, avg: 18.39, sr: 110.33, wickets: 35 }, t20i: { matches: 67, runs: 803, avg: 14.35, sr: 102.30, wickets: 46 }, country: 'Afghanistan' },
  { id: '123', name: 'Naveen-ul-Haq', role: 'BOWL', basePrice: 1, ipl: { matches: 20, wickets: 17, economy: 7.68 }, t20i: { matches: 26, wickets: 22, economy: 7.21 }, country: 'Afghanistan' },
  { id: '124', name: 'Mujeeb Ur Rahman', role: 'BOWL', basePrice: 1, ipl: { matches: 14, wickets: 12, economy: 6.68 }, t20i: { matches: 38, wickets: 52, economy: 5.84 }, country: 'Afghanistan' },
  { id: '125', name: 'Fazalhaq Farooqi', role: 'BOWL', basePrice: 1, ipl: { matches: 8, wickets: 9, economy: 7.45 }, t20i: { matches: 15, wickets: 21, economy: 6.64 }, country: 'Afghanistan' },
  { id: '126', name: 'Azmatullah Omarzai', role: 'AR', basePrice: 1, ipl: { matches: 7, runs: 85, avg: 17.00, sr: 113.33, wickets: 4 }, t20i: { matches: 12, runs: 142, avg: 14.20, sr: 117.36, wickets: 9 }, country: 'Afghanistan' },
  { id: '127', name: 'Rahmanullah Gurbaz', role: 'WK', basePrice: 1, ipl: { matches: 16, runs: 350, avg: 25.00, sr: 132.58 }, t20i: { matches: 22, runs: 487, avg: 24.35, sr: 124.87 }, country: 'Afghanistan' },
  { id: '128', name: 'Ibrahim Zadran', role: 'BAT', basePrice: 1, ipl: { matches: 6, runs: 133, avg: 22.16, sr: 127.88 }, t20i: { matches: 16, runs: 389, avg: 27.78, sr: 117.37 }, country: 'Afghanistan' },
  { id: '129', name: 'Hashmatullah Shahidi', role: 'BAT', basePrice: 1, ipl: { matches: 5, runs: 72, avg: 14.40, sr: 106.85 }, t20i: { matches: 30, runs: 590, avg: 22.69, sr: 113.84 }, country: 'Afghanistan' },
  { id: '130', name: 'Rohit Paudel', role: 'BAT', basePrice: 1, ipl: { matches: 3, runs: 34, avg: 11.33, sr: 94.44 }, t20i: { matches: 16, runs: 263, avg: 17.53, sr: 111.44 }, country: 'Nepal' },
];

// Budget players - 50 lakh
export const budgetPlayers: Player[] = [
  { id: '131', name: 'Rashid Khan', role: 'BOWL', basePrice: 0.5, ipl: { matches: 76, wickets: 110, economy: 6.21 }, t20i: { matches: 56, wickets: 76, economy: 5.83 }, country: 'Afghanistan' },
  { id: '132', name: 'Prabhsimran Singh', role: 'WK', basePrice: 0.5, ipl: { matches: 12, runs: 246, avg: 20.50, sr: 132.97 }, t20i: { matches: 2, runs: 21, avg: 10.50, sr: 105.00 }, country: 'India' },
  { id: '133', name: 'Jitesh Sharma', role: 'WK', basePrice: 0.5, ipl: { matches: 18, runs: 365, avg: 23.31, sr: 141.47 }, t20i: { matches: 6, runs: 92, avg: 15.33, sr: 126.03 }, country: 'India' },
  { id: '134', name: 'Shahbaz Ahamad', role: 'AR', basePrice: 0.5, ipl: { matches: 14, runs: 172, avg: 17.20, sr: 126.76, wickets: 9 }, t20i: { matches: 5, runs: 46, avg: 9.20, sr: 117.95, wickets: 3 }, country: 'India' },
  { id: '135', name: 'Abhishek Sharma', role: 'AR', basePrice: 0.5, ipl: { matches: 32, runs: 519, avg: 19.96, sr: 125.36, wickets: 12 }, t20i: { matches: 8, runs: 88, avg: 12.57, sr: 105.76, wickets: 5 }, country: 'India' },
  { id: '136', name: 'Tanmay Agarwal', role: 'BAT', basePrice: 0.5, ipl: { matches: 6, runs: 128, avg: 21.33, sr: 128.00 }, t20i: { matches: 1, runs: 5, avg: 5.00, sr: 83.33 }, country: 'India' },
  { id: '137', name: 'Aneeshwar Gautam', role: 'AR', basePrice: 0.5, ipl: { matches: 4, runs: 32, avg: 8.00, sr: 94.11, wickets: 2 }, t20i: { matches: 1, runs: 0, avg: 0.00, sr: 0.00, wickets: 0 }, country: 'India' },
  { id: '138', name: 'Lovlita', role: 'BAT', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '139', name: 'Sai Sudharsan', role: 'BAT', basePrice: 0.5, ipl: { matches: 16, runs: 407, avg: 29.78, sr: 125.69 }, t20i: { matches: 2, runs: 28, avg: 14.00, sr: 116.67 }, country: 'India' },
  {id: '140', name: 'Rajvardhan Hangargekar', role: 'BOWL', basePrice: 0.5, ipl: { matches: 8, wickets: 4, economy: 9.37 }, t20i: { matches: 2, wickets: 0, economy: 11.00 }, country: 'India' },
  { id: '141', name: 'Mukesh', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '142', name: 'Raj', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '143', name: 'Himmat Singh', role: 'BAT', basePrice: 0.5, ipl: { matches: 6, runs: 87, avg: 14.50, sr: 110.13 }, t20i: { matches: 1, runs: 9, avg: 9.00, sr: 100.00 }, country: 'India' },
  { id: '144', name: 'Manav Suthar', role: 'BOWL', basePrice: 0.5, ipl: { matches: 3, wickets: 2, economy: 8.00 }, t20i: { matches: 1, wickets: 0, economy: 10.00 }, country: 'India' },
  { id: '145', name: 'Akash Singh', role: 'BOWL', basePrice: 0.5, ipl: { matches: 4, wickets: 2, economy: 10.20 }, t20i: { matches: 2, wickets: 0, economy: 12.00 }, country: 'India' },
  { id: '146', name: 'Aniruddha', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '147', name: 'Shorav', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '148', name: 'Kunal', role: 'BAT', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '149', name: 'Deepak', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '150', name: 'Sumit', role: 'BAT', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '151', name: 'Ashutosh', role: 'BAT', basePrice: 0.5, ipl: { matches: 4, runs: 67, avg: 16.75, sr: 120.00 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '152', name: 'Mandeep Singh', role: 'BAT', basePrice: 0.5, ipl: { matches: 46, runs: 1023, avg: 24.34, sr: 127.31 }, t20i: { matches: 13, runs: 186, avg: 15.50, sr: 112.72 }, country: 'India' },
  { id: '153', name: 'Rohan Kunal', role: 'BAT', basePrice: 0.5, ipl: { matches: 2, runs: 21, avg: 10.50, sr: 105.00 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '154', name: 'Vijay', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '155', name: 'Ari', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '156', name: 'Sandeep', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '157', name: 'Kartik', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '158', name: 'Prasidh', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '159', name: 'Aakarsh', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
  { id: '160', name: 'Yash', role: 'BOWL', basePrice: 0.5, ipl: { matches: 0, runs: 0, avg: 0, sr: 0 }, t20i: { matches: 0, runs: 0, avg: 0, sr: 0 }, country: 'India' },
];

export const allPlayers = [...topTierPlayers, ...premiumPlayers, ...midTierPlayers, ...budgetPlayers];

export function getRandomPlayers(count: number): Player[] {
  const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getPlayerById(id: string): Player | undefined {
  return allPlayers.find(p => p.id === id);
}