import { UnitTierData, UnitType } from '../types';

export const UNIT_DATA: Record<UnitType, UnitTierData[]> = {
  infantry: [
    { tier: 1, name: 'T1 Infantry', trainingCost: { food: 100, wood: 0, stone: 0, gold: 0 }, trainingTimeSeconds: 60 },
    { tier: 2, name: 'T2 Infantry', trainingCost: { food: 250, wood: 50, stone: 0, gold: 0 }, trainingTimeSeconds: 150 },
    { tier: 3, name: 'T3 Infantry', trainingCost: { food: 600, wood: 150, stone: 50, gold: 0 }, trainingTimeSeconds: 400 },
    { tier: 4, name: 'T4 Infantry', trainingCost: { food: 1500, wood: 400, stone: 150, gold: 50 }, trainingTimeSeconds: 1200 },
    { tier: 5, name: 'T5 Infantry', trainingCost: { food: 4000, wood: 1200, stone: 500, gold: 200 }, trainingTimeSeconds: 3600 },
    { tier: 6, name: 'T6 Infantry', trainingCost: { food: 12000, wood: 4000, stone: 1800, gold: 800 }, trainingTimeSeconds: 10800 },
    { tier: 7, name: 'T7 Infantry', trainingCost: { food: 35000, wood: 12000, stone: 6000, gold: 2500 }, trainingTimeSeconds: 32400 },
    { tier: 8, name: 'T8 Infantry', trainingCost: { food: 100000, wood: 35000, stone: 18000, gold: 8000 }, trainingTimeSeconds: 97200 },
  ],
  cavalry: [
    { tier: 1, name: 'T1 Cavalry', trainingCost: { food: 120, wood: 20, stone: 0, gold: 0 }, trainingTimeSeconds: 72 },
    { tier: 2, name: 'T2 Cavalry', trainingCost: { food: 300, wood: 80, stone: 0, gold: 0 }, trainingTimeSeconds: 180 },
    { tier: 3, name: 'T3 Cavalry', trainingCost: { food: 750, wood: 200, stone: 80, gold: 0 }, trainingTimeSeconds: 480 },
    { tier: 4, name: 'T4 Cavalry', trainingCost: { food: 1800, wood: 500, stone: 200, gold: 80 }, trainingTimeSeconds: 1440 },
    { tier: 5, name: 'T5 Cavalry', trainingCost: { food: 5000, wood: 1500, stone: 600, gold: 300 }, trainingTimeSeconds: 4320 },
    { tier: 6, name: 'T6 Cavalry', trainingCost: { food: 15000, wood: 5000, stone: 2200, gold: 1000 }, trainingTimeSeconds: 12960 },
    { tier: 7, name: 'T7 Cavalry', trainingCost: { food: 45000, wood: 15000, stone: 7500, gold: 3500 }, trainingTimeSeconds: 38880 },
    { tier: 8, name: 'T8 Cavalry', trainingCost: { food: 130000, wood: 45000, stone: 22000, gold: 10000 }, trainingTimeSeconds: 116640 },
  ],
  archer: [
    { tier: 1, name: 'T1 Archer', trainingCost: { food: 80, wood: 40, stone: 0, gold: 0 }, trainingTimeSeconds: 54 },
    { tier: 2, name: 'T2 Archer', trainingCost: { food: 200, wood: 120, stone: 0, gold: 0 }, trainingTimeSeconds: 135 },
    { tier: 3, name: 'T3 Archer', trainingCost: { food: 500, wood: 300, stone: 40, gold: 0 }, trainingTimeSeconds: 360 },
    { tier: 4, name: 'T4 Archer', trainingCost: { food: 1200, wood: 800, stone: 120, gold: 40 }, trainingTimeSeconds: 1080 },
    { tier: 5, name: 'T5 Archer', trainingCost: { food: 3500, wood: 2500, stone: 400, gold: 150 }, trainingTimeSeconds: 3240 },
    { tier: 6, name: 'T6 Archer', trainingCost: { food: 10000, wood: 8000, stone: 1500, gold: 600 }, trainingTimeSeconds: 9720 },
    { tier: 7, name: 'T7 Archer', trainingCost: { food: 30000, wood: 25000, stone: 5000, gold: 2000 }, trainingTimeSeconds: 29160 },
    { tier: 8, name: 'T8 Archer', trainingCost: { food: 90000, wood: 75000, stone: 15000, gold: 7000 }, trainingTimeSeconds: 87480 },
  ],
  siege: [
    { tier: 1, name: 'T1 Siege', trainingCost: { food: 50, wood: 100, stone: 50, gold: 0 }, trainingTimeSeconds: 90 },
    { tier: 2, name: 'T2 Siege', trainingCost: { food: 150, wood: 300, stone: 150, gold: 0 }, trainingTimeSeconds: 225 },
    { tier: 3, name: 'T3 Siege', trainingCost: { food: 400, wood: 800, stone: 400, gold: 50 }, trainingTimeSeconds: 600 },
    { tier: 4, name: 'T4 Siege', trainingCost: { food: 1000, wood: 2000, stone: 1000, gold: 200 }, trainingTimeSeconds: 1800 },
    { tier: 5, name: 'T5 Siege', trainingCost: { food: 3000, wood: 6000, stone: 3000, gold: 800 }, trainingTimeSeconds: 5400 },
    { tier: 6, name: 'T6 Siege', trainingCost: { food: 9000, wood: 18000, stone: 9000, gold: 2500 }, trainingTimeSeconds: 16200 },
    { tier: 7, name: 'T7 Siege', trainingCost: { food: 25000, wood: 50000, stone: 25000, gold: 8000 }, trainingTimeSeconds: 48600 },
    { tier: 8, name: 'T8 Siege', trainingCost: { food: 75000, wood: 150000, stone: 75000, gold: 25000 }, trainingTimeSeconds: 145800 },
  ],
};
