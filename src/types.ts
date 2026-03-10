export interface ResourceCost {
  food: number;
  wood: number;
  stone: number;
  gold: number;
}

export interface UnitTierData {
  tier: number;
  name: string;
  trainingCost: ResourceCost;
  trainingTimeSeconds: number;
  researchCost?: ResourceCost;
  researchTimeSeconds?: number;
  requirements?: string[];
}

export type UnitType = 'infantry' | 'cavalry' | 'archer' | 'siege';

export interface CalculatorState {
  unitType: UnitType;
  targetTier: number;
  currentTier: number;
  amount: number;
  researchBuff: number; // percentage
  trainingBuff: number; // percentage
}
