// This is a plain JS version for the server to require
// It mirrors lib/players.ts

const topTierPlayers = [
  { id: '1', name: 'Virat Kohli', role: 'BAT', basePrice: 2, ipl: { matches: 237, runs: 7413, avg: 37.42, sr: 130.27 }, t20i: { matches: 115, runs: 4018, avg: 36.89, sr: 138.22 }, country: 'India' },
  { id: '2', name: 'Jasprit Bumrah', role: 'BOWL', basePrice: 2, ipl: { matches: 132, wickets: 165, economy: 7.43 }, t20i: { matches: 89, wickets: 96, economy: 6.68 }, country: 'India' },
  { id: '3', name: 'Rohit Sharma', role: 'BAT', basePrice: 2, ipl: { matches: 243, runs: 6213, avg: 30.66, sr: 130.08 }, t20i: { matches: 159, runs: 4312, avg: 32.54, sr: 135.42 }, country: 'India' },
  { id: '4', name: 'MS Dhoni', role: 'WK', basePrice: 2, ipl: { matches: 251, runs: 5082, avg: 38.06, sr: 136.54 }, t20i: { matches: 98, runs: 1617, avg: 36.73, sr: 127.09 }, country: 'India' },
  { id: '5', name: 'Hardik Pandya', role: 'AR', basePrice: 2, ipl: { matches: 118, runs: 2624, avg: 26.78, sr: 144.54, wickets: 47 }, t20i: { matches: 89, runs: 1404, avg: 25.07, sr: 135.46, wickets: 55 }, country: 'India' },
  { id: '6', name: 'Ravindra Jadeja', role: 'AR', basePrice: 2, ipl: { matches: 213, runs: 3111, avg: 26.16, sr: 126.87, wickets: 160 }, t20i: { matches: 74, runs: 816, avg: 22.66, sr: 118.26, wickets: 83 }, country: 'India' },
  { id: '7', name: 'KL Rahul', role: 'WK', basePrice: 2, ipl: { matches: 132, runs: 3896, avg: 34.60, sr: 135.86 }, t20i: { matches: 72, runs: 2263, avg: 35.98, sr: 140.58 }, country: 'India' },
  { id: '8', name: 'Shubman Gill', role: 'BAT', basePrice: 2, ipl: { matches: 74, runs: 2298, avg: 34.87, sr: 137.22 }, t20i: { matches: 37, runs: 1263, avg: 36.08, sr: 144.79 }, country: 'India' },
  { id: '9', name: 'Mohammed Shami', role: 'BOWL', basePrice: 2, ipl: { matches: 116, wickets: 127, economy: 8.10 }, t20i: { matches: 61, wickets: 55, economy: 8.62 }, country: 'India' },
  { id: '10', name: 'Mohammed Siraj', role: 'BOWL', basePrice: 2, ipl: { matches: 83, wickets: 94, economy: 7.84 }, t20i: { matches: 41, wickets: 35, economy: 8.41 }, country: 'India' },
  { id: '11', name: 'Shreyas Iyer', role: 'BAT', basePrice: 2, ipl: { matches: 109, runs: 3438, avg: 35.44, sr: 135.42 }, t20i: { matches: 62, runs: 1733, avg: 30.22, sr: 127.38 }, country: 'India' },
  { id: '12', name: 'Rishabh Pant', role: 'WK', basePrice: 2, ipl: { matches: 84, runs: 2538, avg: 34.02, sr: 147.53 }, t20i: { matches: 66, runs: 1574, avg: 26.23, sr: 125.99 }, country: 'India' },
  { id: '13', name: 'Suryakumar Yadav', role: 'BAT', basePrice: 2, ipl: { matches: 79, runs: 2156, avg: 31.24, sr: 140.12 }, t20i: { matches: 51, runs: 1652, avg: 38.88, sr: 173.55 }, country: 'India' },
  { id: '14', name: 'Axar Patel', role: 'AR', basePrice: 2, ipl: { matches: 111, runs: 1659, avg: 24.39, sr: 122.56, wickets: 94 }, t20i: { matches: 60, runs: 584, avg: 18.25, sr: 108.36, wickets: 52 }, country: 'India' },
  { id: '15', name: 'Shivam Dube', role: 'AR', basePrice: 2, ipl: { matches: 62, runs: 1329, avg: 28.70, sr: 143.28, wickets: 8 }, t20i: { matches: 32, runs: 528, avg: 22.00, sr: 128.70, wickets: 7 }, country: 'India' },
  { id: '16', name: 'Arshdeep Singh', role: 'BOWL', basePrice: 2, ipl: { matches: 62, wickets: 61, economy: 7.90 }, t20i: { matches: 37, wickets: 46, economy: 8.04 }, country: 'India' },
  { id: '17', name: 'Yuzvendra Chahal', role: 'BOWL', basePrice: 2, ipl: { matches: 105, wickets: 138, economy: 7.52 }, t20i: { matches: 59, wickets: 66, economy: 8.18 }, country: 'India' },
  { id: '18', name: 'Kuldeep Yadav', role: 'BOWL', basePrice: 2, ipl: { matches: 77, wickets: 88, economy: 7.72 }, t20i: { matches: 33, wickets: 43, economy: 7.66 }, country: 'India' },
  { id: '19', name: 'Bhuvneshwar Kumar', role: 'BOWL', basePrice: 2, ipl: { matches: 154, wickets: 152, economy: 7.35 }, t20i: { matches: 87, wickets: 71, economy: 7.62 }, country: 'India' },
  { id: '20', name: 'Ishan Kishan', role: 'WK', basePrice: 2, ipl: { matches: 69, runs: 1790, avg: 29.02, sr: 132.05 }, t20i: { matches: 34, runs: 862, avg: 28.73, sr: 128.36 }, country: 'India' },
  { id: '21', name: 'Sanju Samson', role: 'WK', basePrice: 2, ipl: { matches: 114, runs: 3011, avg: 31.36, sr: 134.53 }, t20i: { matches: 28, runs: 542, avg: 22.58, sr: 120.09 }, country: 'India' },
  { id: '22', name: 'Ruturaj Gaikwad', role: 'BAT', basePrice: 2, ipl: { matches: 58, runs: 1792, avg: 33.74, sr: 131.23 }, t20i: { matches: 17, runs: 461, avg: 30.73, sr: 130.41 }, country: 'India' },
  { id: '23', name: 'Tilak Varma', role: 'BAT', basePrice: 2, ipl: { matches: 27, runs: 746, avg: 31.08, sr: 131.34 }, t20i: { matches: 16, runs: 343, avg: 24.50, sr: 126.01 }, country: 'India' },
  { id: '24', name: 'Washington Sundar', role: 'AR', basePrice: 2, ipl: { matches: 36, runs: 493, avg: 20.54, sr: 110.56, wickets: 25 }, t20i: { matches: 26, runs: 198, avg: 14.85, sr: 98.51, wickets: 16 }, country: 'India' },
  { id: '25', name: 'Rahul Tripathi', role: 'BAT', basePrice: 2, ipl: { matches: 59, runs: 1570, avg: 29.81, sr: 138.72 }, t20i: { matches: 14, runs: 262, avg: 23.81, sr: 122.43 }, country: 'India' },
  { id: '26', name: 'Prithvi Shaw', role: 'BAT', basePrice: 2, ipl: { matches: 57, runs: 1734, avg: 32.70, sr: 144.12 }, t20i: { matches: 18, runs: 475, avg: 26.38, sr: 138.54 }, country: 'India' },
  { id: '27', name: 'Devdutt Padikkal', role: 'BAT', basePrice: 2, ipl: { matches: 34, runs: 1157, avg: 36.15, sr: 131.72 }, t20i: { matches: 12, runs: 297, avg: 27.00, sr: 119.76 }, country: 'India' },
  { id: '28', name: 'Venkatesh Iyer', role: 'AR', basePrice: 2, ipl: { matches: 28, runs: 641, avg: 27.86, sr: 132.43, wickets: 7 }, t20i: { matches: 15, runs: 221, avg: 17.76, sr: 114.06, wickets: 4 }, country: 'India' },
  { id: '29', name: 'T Natarajan', role: 'BOWL', basePrice: 2, ipl: { matches: 35, wickets: 38, economy: 7.98 }, t20i: { matches: 28, wickets: 31, economy: 7.75 }, country: 'India' },
  { id: '30', name: 'Deepak Chahar', role: 'BOWL', basePrice: 2, ipl: { matches: 42, wickets: 44, economy: 7.89 }, t20i: { matches: 21, wickets: 18, economy: 8.37 }, country: 'India' },
];

// Simplified mid tier and budget players - 60 more for variety
const midTierPlayers = [
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
  { id: '47', name: 'Eoin Morgan', role: 'BAT', basePrice: 1.5, ipl: { matches: 84, runs: 1852, avg: 30.03, sr: 133.54 }, t20i: { matches: 96, runs: 2275, avg: 29.68, sr: 136.44 }, country: 'England' },
  { id: '48', name: 'Ben Stokes', role: 'AR', basePrice: 1.5, ipl: { matches: 71, runs: 1681, avg: 27.70, sr: 139.47, wickets: 43 }, t20i: { matches: 79, runs: 1388, avg: 23.84, sr: 136.58, wickets: 42 }, country: 'England' },
  { id: '49', name: 'Jos Buttler', role: 'WK', basePrice: 1.5, ipl: { matches: 84, runs: 2716, avg: 37.19, sr: 149.61 }, t20i: { matches: 62, runs: 1881, avg: 32.43, sr: 145.10 }, country: 'England' },
  { id: '50', name: 'Jofra Archer', role: 'BOWL', basePrice: 1.5, ipl: { matches: 29, wickets: 29, economy: 7.68 }, t20i: { matches: 29, wickets: 30, economy: 7.26 }, country: 'England' },
];

// Budget players - 50 lakh
const budgetPlayers = [
  { id: '51', name: 'Mayank Agarwal', role: 'BAT', basePrice: 1, ipl: { matches: 82, runs: 2353, avg: 31.77, sr: 135.63 }, t20i: { matches: 16, runs: 347, avg: 23.13, sr: 125.54 }, country: 'India' },
  { id: '52', name: 'Manish Pandey', role: 'BAT', basePrice: 1, ipl: { matches: 154, runs: 3794, avg: 30.11, sr: 122.67 }, t20i: { matches: 39, runs: 786, avg: 23.15, sr: 116.47 }, country: 'India' },
  { id: '53', name: 'Karun Nair', role: 'BAT', basePrice: 1, ipl: { matches: 48, runs: 1151, avg: 28.07, sr: 125.08 }, t20i: { matches: 8, runs: 181, avg: 22.62, sr: 121.21 }, country: 'India' },
  { id: '54', name: 'Shardul Thakur', role: 'BOWL', basePrice: 1, ipl: { matches: 47, wickets: 42, economy: 8.41 }, t20i: { matches: 26, wickets: 21, economy: 8.84 }, country: 'India' },
  { id: '55', name: 'Navdeep Saini', role: 'BOWL', basePrice: 1, ipl: { matches: 36, wickets: 36, economy: 8.22 }, t20i: { matches: 22, wickets: 18, economy: 8.61 }, country: 'India' },
  { id: '56', name: 'Khaleel Ahmed', role: 'BOWL', basePrice: 1, ipl: { matches: 34, wickets: 34, economy: 8.21 }, t20i: { matches: 18, wickets: 18, economy: 8.42 }, country: 'India' },
  { id: '57', name: 'Krunal Pandya', role: 'AR', basePrice: 1, ipl: { matches: 58, runs: 768, avg: 19.69, sr: 121.14, wickets: 46 }, t20i: { matches: 21, runs: 160, avg: 12.30, sr: 103.22, wickets: 9 }, country: 'India' },
  { id: '58', name: 'Vijay Shankar', role: 'AR', basePrice: 1, ipl: { matches: 45, runs: 623, avg: 17.86, sr: 122.30, wickets: 19 }, t20i: { matches: 23, runs: 268, avg: 17.86, sr: 115.52, wickets: 8 }, country: 'India' },
  { id: '59', name: 'Nitish Rana', role: 'BAT', basePrice: 1, ipl: { matches: 55, runs: 1306, avg: 27.20, sr: 131.07 }, t20i: { matches: 10, runs: 183, avg: 20.33, sr: 127.08 }, country: 'India' },
  { id: '60', name: 'Ravi Bishnoi', role: 'BOWL', basePrice: 1, ipl: { matches: 26, wickets: 25, economy: 7.31 }, t20i: { matches: 11, wickets: 10, economy: 7.54 }, country: 'India' },
  { id: '61', name: 'Anrich Nortje', role: 'BOWL', basePrice: 1, ipl: { matches: 35, wickets: 38, economy: 7.92 }, t20i: { matches: 29, wickets: 33, economy: 7.44 }, country: 'South Africa' },
  { id: '62', name: 'Heinrich Klaasen', role: 'WK', basePrice: 1, ipl: { matches: 22, runs: 562, avg: 28.10, sr: 142.43 }, t20i: { matches: 21, runs: 501, avg: 27.83, sr: 143.53 }, country: 'South Africa' },
  { id: '63', name: 'Mohammad Nabi', role: 'AR', basePrice: 1, ipl: { matches: 41, runs: 515, avg: 18.39, sr: 110.33, wickets: 35 }, t20i: { matches: 67, runs: 803, avg: 14.35, sr: 102.30, wickets: 46 }, country: 'Afghanistan' },
  { id: '64', name: 'Naveen-ul-Haq', role: 'BOWL', basePrice: 1, ipl: { matches: 20, wickets: 17, economy: 7.68 }, t20i: { matches: 26, wickets: 22, economy: 7.21 }, country: 'Afghanistan' },
  { id: '65', name: 'Mujeeb Ur Rahman', role: 'BOWL', basePrice: 1, ipl: { matches: 14, wickets: 12, economy: 6.68 }, t20i: { matches: 38, wickets: 52, economy: 5.84 }, country: 'Afghanistan' },
  { id: '66', name: 'Rahmanullah Gurbaz', role: 'WK', basePrice: 1, ipl: { matches: 16, runs: 350, avg: 25.00, sr: 132.58 }, t20i: { matches: 22, runs: 487, avg: 24.35, sr: 124.87 }, country: 'Afghanistan' },
  { id: '67', name: 'Marcus Stoinis', role: 'AR', basePrice: 1, ipl: { matches: 57, runs: 876, avg: 22.97, sr: 132.72, wickets: 27 }, t20i: { matches: 49, runs: 555, avg: 17.90, sr: 128.64, wickets: 20 }, country: 'Australia' },
  { id: '68', name: 'Nathan Ellis', role: 'BOWL', basePrice: 1, ipl: { matches: 20, wickets: 23, economy: 7.82 }, t20i: { matches: 18, wickets: 20, economy: 7.56 }, country: 'Australia' },
  { id: '69', name: 'Nicholas Pooran', role: 'WK', basePrice: 1, ipl: { matches: 42, runs: 1008, avg: 26.53, sr: 143.47 }, t20i: { matches: 45, runs: 924, avg: 23.69, sr: 132.66 }, country: 'West Indies' },
  { id: '70', name: 'Rovman Powell', role: 'BAT', basePrice: 1, ipl: { matches: 34, runs: 676, avg: 23.31, sr: 144.73 }, t20i: { matches: 28, runs: 538, avg: 22.42, sr: 134.16 }, country: 'West Indies' },
];

const allPlayers = [...topTierPlayers, ...midTierPlayers, ...budgetPlayers];

function getRandomPlayers(count) {
  const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { getRandomPlayers, allPlayers };