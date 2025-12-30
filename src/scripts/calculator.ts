export interface AdjustmentOption {
  id: string;
  label: string;
  adjustment: number;
}

export interface MaffetoneRange {
  base: number;
  low: number;
  high: number;
}

export const adjustmentOptions: AdjustmentOption[] = [
  {
    id: "recovering",
    label: "Recovering from a major illness, injury, or on medication",
    adjustment: -10,
  },
  {
    id: "struggling",
    label: "Recently injured, inconsistent training, or not improving",
    adjustment: -5,
  },
  {
    id: "steady",
    label: "Healthy, training consistently, and making steady progress",
    adjustment: 0,
  },
  {
    id: "seasoned",
    label: "Training for 2+ years without injury and improving",
    adjustment: 5,
  },
];

export function calculateMaffetoneBase(age: number, adjustment: number): number | null {
  if (!Number.isFinite(age) || age <= 0) {
    return null;
  }

  return 180 - age + adjustment;
}

export function calculateMaffetoneRange(age: number, adjustment: number): MaffetoneRange | null {
  const base = calculateMaffetoneBase(age, adjustment);
  if (base === null) {
    return null;
  }

  return {
    base,
    low: base - 10,
    high: base,
  };
}

export function formatRange(range: MaffetoneRange | null): string | null {
  if (!range) {
    return null;
  }

  return `${Math.round(range.low)}-${Math.round(range.high)} bpm`;
}
