// Script to generate crop_yield.csv
const fs = require('fs');
const path = require('path');

const states = [
  { name: 'Punjab', baseRain: 650, baseFert: 240, basePest: 18, fertMultiplier: 1.2 },
  { name: 'Haryana', baseRain: 580, baseFert: 210, basePest: 16, fertMultiplier: 1.15 },
  { name: 'Uttar Pradesh', baseRain: 950, baseFert: 180, basePest: 14, fertMultiplier: 1.05 },
  { name: 'Madhya Pradesh', baseRain: 1050, baseFert: 120, basePest: 10, fertMultiplier: 0.9 },
  { name: 'Maharashtra', baseRain: 1100, baseFert: 140, basePest: 13, fertMultiplier: 0.95 },
  { name: 'Gujarat', baseRain: 820, baseFert: 150, basePest: 12, fertMultiplier: 0.98 },
  { name: 'Tamil Nadu', baseRain: 980, baseFert: 190, basePest: 15, fertMultiplier: 1.1 },
  { name: 'Andhra Pradesh', baseRain: 920, baseFert: 200, basePest: 17, fertMultiplier: 1.12 },
  { name: 'Karnataka', baseRain: 1150, baseFert: 160, basePest: 11, fertMultiplier: 1.0 },
  { name: 'West Bengal', baseRain: 1600, baseFert: 170, basePest: 14, fertMultiplier: 1.08 },
  { name: 'Bihar', baseRain: 1200, baseFert: 150, basePest: 12, fertMultiplier: 0.95 },
  { name: 'Rajasthan', baseRain: 450, baseFert: 80, basePest: 7, fertMultiplier: 0.8 },
  { name: 'Kerala', baseRain: 2800, baseFert: 130, basePest: 9, fertMultiplier: 1.0 },
  { name: 'Odisha', baseRain: 1450, baseFert: 110, basePest: 10, fertMultiplier: 0.92 },
  { name: 'Assam', baseRain: 2200, baseFert: 95, basePest: 8, fertMultiplier: 0.88 }
];

const crops = [
  { name: 'Rice', seasons: ['Kharif', 'Summer', 'Whole Year'], baseYield: 3.8, rainOpt: 1400, fertSens: 0.4 },
  { name: 'Wheat', seasons: ['Rabi'], baseYield: 4.2, rainOpt: 700, fertSens: 0.45 },
  { name: 'Maize', seasons: ['Kharif', 'Rabi'], baseYield: 3.2, rainOpt: 800, fertSens: 0.35 },
  { name: 'Cotton', seasons: ['Kharif'], baseYield: 2.1, rainOpt: 750, fertSens: 0.3 },
  { name: 'Sugarcane', seasons: ['Whole Year'], baseYield: 72.0, rainOpt: 1500, fertSens: 0.5 },
  { name: 'Soybean', seasons: ['Kharif'], baseYield: 2.4, rainOpt: 900, fertSens: 0.28 },
  { name: 'Groundnut', seasons: ['Kharif', 'Rabi'], baseYield: 2.0, rainOpt: 650, fertSens: 0.25 },
  { name: 'Pulses', seasons: ['Kharif', 'Rabi', 'Zaid'], baseYield: 1.2, rainOpt: 600, fertSens: 0.2 },
  { name: 'Mustard', seasons: ['Rabi'], baseYield: 1.6, rainOpt: 550, fertSens: 0.22 },
  { name: 'Barley', seasons: ['Rabi'], baseYield: 2.8, rainOpt: 500, fertSens: 0.26 },
  { name: 'Jute', seasons: ['Kharif'], baseYield: 2.7, rainOpt: 1600, fertSens: 0.3 }
];

const rows = [
  'Year,State,Crop,Season,Area,Production,Annual_Rainfall,Fertilizer,Pesticide,Yield'
];

let seed = 42;
function pseudoRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

for (let i = 0; i < 1250; i++) {
  const stateObj = states[Math.floor(pseudoRandom() * states.length)];
  const cropObj = crops[Math.floor(pseudoRandom() * crops.length)];
  const season = cropObj.seasons[Math.floor(pseudoRandom() * cropObj.seasons.length)];
  const year = 2005 + Math.floor(pseudoRandom() * 19); // 2005 to 2023

  const isSugarcane = cropObj.name === 'Sugarcane';
  const area = Math.round(isSugarcane ? 1200 + pseudoRandom() * 45000 : 2500 + pseudoRandom() * 120000);

  const rainVariation = 0.75 + pseudoRandom() * 0.5;
  const annualRainfall = +(stateObj.baseRain * rainVariation).toFixed(1);

  const fertPerHa = +(stateObj.baseFert * (0.8 + pseudoRandom() * 0.4) * stateObj.fertMultiplier).toFixed(1);
  const fertilizer = Math.round(fertPerHa * area);

  const pestPerHa = +(stateObj.basePest * (0.8 + pseudoRandom() * 0.4)).toFixed(2);
  const pesticide = Math.round(pestPerHa * area);

  const rainDiff = Math.abs(annualRainfall - cropObj.rainOpt) / cropObj.rainOpt;
  const rainPenalty = Math.max(0.65, 1.0 - rainDiff * 0.35);

  const fertFactor = 0.8 + (fertPerHa / 200) * cropObj.fertSens;
  const techTrend = 1.0 + (year - 2005) * 0.012;
  const randomNoise = 0.92 + pseudoRandom() * 0.16;

  let yieldVal = cropObj.baseYield * rainPenalty * fertFactor * techTrend * randomNoise;
  yieldVal = +yieldVal.toFixed(2);

  const production = Math.round(area * yieldVal);

  rows.push(`${year},${stateObj.name},${cropObj.name},${season},${area},${production},${annualRainfall},${fertilizer},${pesticide},${yieldVal}`);
}

const targetDir = path.join(__dirname, 'dataset');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'crop_yield.csv'), rows.join('\n'), 'utf8');
console.log(`Generated crop_yield.csv with ${rows.length - 1} records!`);
