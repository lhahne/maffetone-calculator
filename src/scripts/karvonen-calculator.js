// Zone definitions
export const zones = [
  { name: "Zone 1", label: "Recovery", min: 0.50, max: 0.60 },
  { name: "Zone 2", label: "Endurance", min: 0.60, max: 0.70 },
  { name: "Zone 3", label: "Tempo", min: 0.70, max: 0.80 },
  { name: "Zone 4", label: "Threshold", min: 0.80, max: 0.90 },
  { name: "Zone 5", label: "VO2max", min: 0.90, max: 1.00 },
];

export function calculateMaxHR(age) {
  if (!Number.isFinite(age) || age <= 0) {
    return null;
  }
  return 220 - age;
}

export function calculateKarvonenHR(maxHR, restingHR, intensity) {
  return Math.round(((maxHR - restingHR) * intensity) + restingHR);
}

export function calculateAllZones(maxHR, restingHR) {
  if (!Number.isFinite(maxHR) || !Number.isFinite(restingHR)) {
    return null;
  }
  return zones.map(zone => ({
    ...zone,
    hrMin: calculateKarvonenHR(maxHR, restingHR, zone.min),
    hrMax: calculateKarvonenHR(maxHR, restingHR, zone.max),
  }));
}
