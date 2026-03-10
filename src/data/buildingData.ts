import { ResourceCost } from '../types';

export interface BuildingLevel {
    level: number;
    upgradeCost: ResourceCost;
    upgradeTimeSeconds: number;
    power: number;
}

export interface BuildingData {
    id: string;
    nameEN: string;
    nameTR: string;
    icon: string;
    category: 'military' | 'economy' | 'defense';
    levels: BuildingLevel[];
}

// Based on Age of Empires Mobile community data
export const BUILDINGS: BuildingData[] = [
    {
        id: 'castle',
        nameEN: 'Castle',
        nameTR: 'Kale',
        icon: '🏰',
        category: 'military',
        levels: [
            { level: 1, upgradeCost: { food: 200, wood: 300, stone: 100, gold: 0 }, upgradeTimeSeconds: 120, power: 50 },
            { level: 2, upgradeCost: { food: 600, wood: 800, stone: 300, gold: 0 }, upgradeTimeSeconds: 600, power: 120 },
            { level: 3, upgradeCost: { food: 1500, wood: 2000, stone: 800, gold: 100 }, upgradeTimeSeconds: 1800, power: 300 },
            { level: 4, upgradeCost: { food: 4000, wood: 5500, stone: 2200, gold: 300 }, upgradeTimeSeconds: 5400, power: 700 },
            { level: 5, upgradeCost: { food: 10000, wood: 14000, stone: 5500, gold: 800 }, upgradeTimeSeconds: 14400, power: 1500 },
            { level: 6, upgradeCost: { food: 25000, wood: 35000, stone: 14000, gold: 2000 }, upgradeTimeSeconds: 36000, power: 3200 },
            { level: 7, upgradeCost: { food: 60000, wood: 85000, stone: 35000, gold: 5000 }, upgradeTimeSeconds: 72000, power: 6500 },
            { level: 8, upgradeCost: { food: 150000, wood: 210000, stone: 85000, gold: 12000 }, upgradeTimeSeconds: 144000, power: 13000 },
            { level: 9, upgradeCost: { food: 350000, wood: 500000, stone: 200000, gold: 30000 }, upgradeTimeSeconds: 288000, power: 26000 },
            { level: 10, upgradeCost: { food: 800000, wood: 1100000, stone: 450000, gold: 70000 }, upgradeTimeSeconds: 432000, power: 50000 },
            { level: 11, upgradeCost: { food: 1500000, wood: 2100000, stone: 850000, gold: 130000 }, upgradeTimeSeconds: 604800, power: 80000 },
            { level: 12, upgradeCost: { food: 2800000, wood: 3900000, stone: 1600000, gold: 250000 }, upgradeTimeSeconds: 864000, power: 120000 },
            { level: 13, upgradeCost: { food: 5000000, wood: 7000000, stone: 2800000, gold: 450000 }, upgradeTimeSeconds: 1209600, power: 180000 },
            { level: 14, upgradeCost: { food: 9000000, wood: 12600000, stone: 5100000, gold: 800000 }, upgradeTimeSeconds: 1728000, power: 270000 },
            { level: 15, upgradeCost: { food: 16000000, wood: 22400000, stone: 9000000, gold: 1400000 }, upgradeTimeSeconds: 2332800, power: 400000 },
            { level: 16, upgradeCost: { food: 28000000, wood: 39000000, stone: 16000000, gold: 2500000 }, upgradeTimeSeconds: 3024000, power: 580000 },
            { level: 17, upgradeCost: { food: 48000000, wood: 67000000, stone: 27000000, gold: 4200000 }, upgradeTimeSeconds: 3888000, power: 830000 },
            { level: 18, upgradeCost: { food: 80000000, wood: 112000000, stone: 45000000, gold: 7000000 }, upgradeTimeSeconds: 4924800, power: 1200000 },
            { level: 19, upgradeCost: { food: 130000000, wood: 182000000, stone: 73000000, gold: 11500000 }, upgradeTimeSeconds: 6220800, power: 1700000 },
            { level: 20, upgradeCost: { food: 210000000, wood: 294000000, stone: 118000000, gold: 18500000 }, upgradeTimeSeconds: 7776000, power: 2400000 },
            { level: 21, upgradeCost: { food: 320000000, wood: 448000000, stone: 180000000, gold: 28000000 }, upgradeTimeSeconds: 9676800, power: 3300000 },
            { level: 22, upgradeCost: { food: 480000000, wood: 672000000, stone: 270000000, gold: 42000000 }, upgradeTimeSeconds: 12009600, power: 4500000 },
            { level: 23, upgradeCost: { food: 700000000, wood: 980000000, stone: 392000000, gold: 61000000 }, upgradeTimeSeconds: 14774400, power: 6100000 },
            { level: 24, upgradeCost: { food: 1000000000, wood: 1400000000, stone: 560000000, gold: 87000000 }, upgradeTimeSeconds: 18144000, power: 8100000 },
            { level: 25, upgradeCost: { food: 1400000000, wood: 1960000000, stone: 784000000, gold: 122000000 }, upgradeTimeSeconds: 22118400, power: 10500000 },
        ],
    },
    {
        id: 'barracks',
        nameEN: 'Barracks',
        nameTR: 'Kışla',
        icon: '⚔️',
        category: 'military',
        levels: [
            { level: 1, upgradeCost: { food: 150, wood: 200, stone: 50, gold: 0 }, upgradeTimeSeconds: 60, power: 30 },
            { level: 2, upgradeCost: { food: 400, wood: 550, stone: 150, gold: 0 }, upgradeTimeSeconds: 300, power: 70 },
            { level: 3, upgradeCost: { food: 1000, wood: 1400, stone: 400, gold: 50 }, upgradeTimeSeconds: 900, power: 180 },
            { level: 4, upgradeCost: { food: 2600, wood: 3600, stone: 1100, gold: 150 }, upgradeTimeSeconds: 2700, power: 420 },
            { level: 5, upgradeCost: { food: 6500, wood: 9100, stone: 2800, gold: 400 }, upgradeTimeSeconds: 7200, power: 900 },
            { level: 6, upgradeCost: { food: 16000, wood: 22500, stone: 7000, gold: 1000 }, upgradeTimeSeconds: 18000, power: 1900 },
            { level: 7, upgradeCost: { food: 40000, wood: 56000, stone: 17500, gold: 2500 }, upgradeTimeSeconds: 36000, power: 3900 },
            { level: 8, upgradeCost: { food: 100000, wood: 140000, stone: 44000, gold: 6000 }, upgradeTimeSeconds: 72000, power: 7800 },
            { level: 9, upgradeCost: { food: 250000, wood: 350000, stone: 110000, gold: 15000 }, upgradeTimeSeconds: 144000, power: 15600 },
            { level: 10, upgradeCost: { food: 600000, wood: 840000, stone: 260000, gold: 36000 }, upgradeTimeSeconds: 216000, power: 30000 },
            { level: 15, upgradeCost: { food: 12000000, wood: 16800000, stone: 5200000, gold: 720000 }, upgradeTimeSeconds: 1166400, power: 250000 },
            { level: 20, upgradeCost: { food: 160000000, wood: 224000000, stone: 70000000, gold: 9600000 }, upgradeTimeSeconds: 3888000, power: 1500000 },
            { level: 25, upgradeCost: { food: 1100000000, wood: 1540000000, stone: 480000000, gold: 66000000 }, upgradeTimeSeconds: 11059200, power: 7000000 },
        ],
    },
    {
        id: 'academy',
        nameEN: 'Academy',
        nameTR: 'Akademi',
        icon: '📚',
        category: 'economy',
        levels: [
            { level: 1, upgradeCost: { food: 100, wood: 150, stone: 80, gold: 0 }, upgradeTimeSeconds: 90, power: 25 },
            { level: 2, upgradeCost: { food: 300, wood: 400, stone: 200, gold: 0 }, upgradeTimeSeconds: 450, power: 60 },
            { level: 3, upgradeCost: { food: 800, wood: 1100, stone: 500, gold: 50 }, upgradeTimeSeconds: 1200, power: 150 },
            { level: 4, upgradeCost: { food: 2000, wood: 2800, stone: 1200, gold: 150 }, upgradeTimeSeconds: 3600, power: 350 },
            { level: 5, upgradeCost: { food: 5000, wood: 7000, stone: 3000, gold: 400 }, upgradeTimeSeconds: 9000, power: 750 },
            { level: 6, upgradeCost: { food: 12000, wood: 17000, stone: 7500, gold: 1000 }, upgradeTimeSeconds: 21600, power: 1600 },
            { level: 7, upgradeCost: { food: 30000, wood: 42000, stone: 19000, gold: 2500 }, upgradeTimeSeconds: 43200, power: 3300 },
            { level: 8, upgradeCost: { food: 75000, wood: 105000, stone: 47000, gold: 6000 }, upgradeTimeSeconds: 86400, power: 6600 },
            { level: 9, upgradeCost: { food: 190000, wood: 266000, stone: 118000, gold: 15000 }, upgradeTimeSeconds: 172800, power: 13200 },
            { level: 10, upgradeCost: { food: 470000, wood: 658000, stone: 290000, gold: 37000 }, upgradeTimeSeconds: 259200, power: 25000 },
            { level: 15, upgradeCost: { food: 9500000, wood: 13300000, stone: 5900000, gold: 750000 }, upgradeTimeSeconds: 1382400, power: 200000 },
            { level: 20, upgradeCost: { food: 120000000, wood: 168000000, stone: 74000000, gold: 9500000 }, upgradeTimeSeconds: 4665600, power: 1200000 },
            { level: 25, upgradeCost: { food: 850000000, wood: 1190000000, stone: 525000000, gold: 67000000 }, upgradeTimeSeconds: 13305600, power: 5500000 },
        ],
    },
    {
        id: 'farm',
        nameEN: 'Farm',
        nameTR: 'Çiftlik',
        icon: '🌾',
        category: 'economy',
        levels: [
            { level: 1, upgradeCost: { food: 50, wood: 100, stone: 0, gold: 0 }, upgradeTimeSeconds: 30, power: 15 },
            { level: 2, upgradeCost: { food: 150, wood: 250, stone: 0, gold: 0 }, upgradeTimeSeconds: 120, power: 35 },
            { level: 3, upgradeCost: { food: 400, wood: 600, stone: 50, gold: 0 }, upgradeTimeSeconds: 360, power: 80 },
            { level: 4, upgradeCost: { food: 1000, wood: 1500, stone: 150, gold: 0 }, upgradeTimeSeconds: 900, power: 180 },
            { level: 5, upgradeCost: { food: 2500, wood: 3800, stone: 400, gold: 0 }, upgradeTimeSeconds: 2400, power: 400 },
            { level: 6, upgradeCost: { food: 6000, wood: 9200, stone: 1000, gold: 100 }, upgradeTimeSeconds: 5400, power: 850 },
            { level: 7, upgradeCost: { food: 15000, wood: 23000, stone: 2500, gold: 300 }, upgradeTimeSeconds: 10800, power: 1750 },
            { level: 8, upgradeCost: { food: 38000, wood: 57000, stone: 6000, gold: 800 }, upgradeTimeSeconds: 21600, power: 3500 },
            { level: 9, upgradeCost: { food: 95000, wood: 142000, stone: 15000, gold: 2000 }, upgradeTimeSeconds: 43200, power: 7000 },
            { level: 10, upgradeCost: { food: 235000, wood: 352000, stone: 37000, gold: 5000 }, upgradeTimeSeconds: 64800, power: 14000 },
            { level: 15, upgradeCost: { food: 4700000, wood: 7050000, stone: 750000, gold: 100000 }, upgradeTimeSeconds: 345600, power: 110000 },
            { level: 20, upgradeCost: { food: 60000000, wood: 90000000, stone: 9500000, gold: 1300000 }, upgradeTimeSeconds: 1166400, power: 650000 },
            { level: 25, upgradeCost: { food: 425000000, wood: 637000000, stone: 67000000, gold: 9200000 }, upgradeTimeSeconds: 3326400, power: 3000000 },
        ],
    },
    {
        id: 'wall',
        nameEN: 'Wall',
        nameTR: 'Sur',
        icon: '🧱',
        category: 'defense',
        levels: [
            { level: 1, upgradeCost: { food: 0, wood: 100, stone: 200, gold: 0 }, upgradeTimeSeconds: 60, power: 20 },
            { level: 2, upgradeCost: { food: 0, wood: 300, stone: 500, gold: 0 }, upgradeTimeSeconds: 300, power: 50 },
            { level: 3, upgradeCost: { food: 0, wood: 800, stone: 1200, gold: 0 }, upgradeTimeSeconds: 900, power: 120 },
            { level: 4, upgradeCost: { food: 0, wood: 2000, stone: 3000, gold: 100 }, upgradeTimeSeconds: 2700, power: 280 },
            { level: 5, upgradeCost: { food: 0, wood: 5000, stone: 7500, gold: 300 }, upgradeTimeSeconds: 7200, power: 600 },
            { level: 6, upgradeCost: { food: 0, wood: 12500, stone: 18800, gold: 750 }, upgradeTimeSeconds: 18000, power: 1300 },
            { level: 7, upgradeCost: { food: 0, wood: 31000, stone: 46500, gold: 1900 }, upgradeTimeSeconds: 36000, power: 2600 },
            { level: 8, upgradeCost: { food: 0, wood: 78000, stone: 117000, gold: 4800 }, upgradeTimeSeconds: 72000, power: 5200 },
            { level: 9, upgradeCost: { food: 0, wood: 195000, stone: 292000, gold: 12000 }, upgradeTimeSeconds: 144000, power: 10400 },
            { level: 10, upgradeCost: { food: 0, wood: 480000, stone: 720000, gold: 30000 }, upgradeTimeSeconds: 216000, power: 20000 },
            { level: 15, upgradeCost: { food: 0, wood: 9600000, stone: 14400000, gold: 600000 }, upgradeTimeSeconds: 1166400, power: 160000 },
            { level: 20, upgradeCost: { food: 0, wood: 128000000, stone: 192000000, gold: 8000000 }, upgradeTimeSeconds: 3888000, power: 1000000 },
            { level: 25, upgradeCost: { food: 0, wood: 880000000, stone: 1320000000, gold: 55000000 }, upgradeTimeSeconds: 11059200, power: 4500000 },
        ],
    },
    {
        id: 'hospital',
        nameEN: 'Hospital',
        nameTR: 'Hastane',
        icon: '🏥',
        category: 'military',
        levels: [
            { level: 1, upgradeCost: { food: 100, wood: 100, stone: 100, gold: 0 }, upgradeTimeSeconds: 60, power: 20 },
            { level: 2, upgradeCost: { food: 300, wood: 300, stone: 300, gold: 0 }, upgradeTimeSeconds: 300, power: 50 },
            { level: 3, upgradeCost: { food: 750, wood: 750, stone: 750, gold: 30 }, upgradeTimeSeconds: 900, power: 120 },
            { level: 4, upgradeCost: { food: 1900, wood: 1900, stone: 1900, gold: 80 }, upgradeTimeSeconds: 2700, power: 280 },
            { level: 5, upgradeCost: { food: 4800, wood: 4800, stone: 4800, gold: 200 }, upgradeTimeSeconds: 7200, power: 600 },
            { level: 6, upgradeCost: { food: 12000, wood: 12000, stone: 12000, gold: 500 }, upgradeTimeSeconds: 18000, power: 1300 },
            { level: 7, upgradeCost: { food: 30000, wood: 30000, stone: 30000, gold: 1300 }, upgradeTimeSeconds: 36000, power: 2600 },
            { level: 8, upgradeCost: { food: 75000, wood: 75000, stone: 75000, gold: 3200 }, upgradeTimeSeconds: 72000, power: 5200 },
            { level: 9, upgradeCost: { food: 188000, wood: 188000, stone: 188000, gold: 8000 }, upgradeTimeSeconds: 144000, power: 10400 },
            { level: 10, upgradeCost: { food: 470000, wood: 470000, stone: 470000, gold: 20000 }, upgradeTimeSeconds: 216000, power: 20000 },
            { level: 15, upgradeCost: { food: 9400000, wood: 9400000, stone: 9400000, gold: 400000 }, upgradeTimeSeconds: 1166400, power: 160000 },
            { level: 20, upgradeCost: { food: 125000000, wood: 125000000, stone: 125000000, gold: 5300000 }, upgradeTimeSeconds: 3888000, power: 1000000 },
            { level: 25, upgradeCost: { food: 860000000, wood: 860000000, stone: 860000000, gold: 37000000 }, upgradeTimeSeconds: 11059200, power: 4500000 },
        ],
    },
];
