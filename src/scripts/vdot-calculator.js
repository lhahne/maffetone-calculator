export const raceDistances = [
  { id: "1500m", meters: 1500, label: "1500m" },
  { id: "5k", meters: 5000, label: "5K" },
  { id: "10k", meters: 10000, label: "10K" },
  { id: "half", meters: 21097.5, label: "Half Marathon" },
  { id: "marathon", meters: 42195, label: "Marathon" }
];

export const trainingZones = [
  { id: "easy", label: "Easy", description: "Aerobic base building, conversational pace", vo2Percent: [59, 74] },
  { id: "marathon", label: "Marathon", description: "Race pace for marathon training", vo2Percent: [75, 84] },
  { id: "threshold", label: "Threshold", description: "Tempo runs, lactate threshold", vo2Percent: [83, 88] },
  { id: "interval", label: "Interval", description: "VO₂max intervals", vo2Percent: [97, 100] },
  { id: "repetition", label: "Repetition", description: "Speed work, form and economy", vo2Percent: [105, 120] }
];

export function calculateVDOT(distanceMeters, timeMinutes) {
  if (!distanceMeters || !timeMinutes || distanceMeters <= 0 || timeMinutes <= 0) {
    return null;
  }

  const velocity = distanceMeters / timeMinutes;

  const vo2Demand = -4.60 + 0.182258 * velocity + 0.000104 * velocity * velocity;

  const percentVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  const vdot = vo2Demand / percentVO2max;

  return vdot;
}

export function vo2ToVelocity(vo2) {
  const a = 0.000104;
  const b = 0.182258;
  const c = -4.60 - vo2;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return null;
  }

  const velocity = (-b + Math.sqrt(discriminant)) / (2 * a);

  return velocity > 0 ? velocity : null;
}

export function velocityToPace(velocityMetersPerMin, unit = "km") {
  if (!velocityMetersPerMin || velocityMetersPerMin <= 0) {
    return null;
  }

  const metersPerUnit = unit === "km" ? 1000 : 1609.344;
  const paceSeconds = (metersPerUnit / velocityMetersPerMin) * 60;

  const totalSeconds = Math.round(paceSeconds);
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;

  return { min, sec, totalSeconds: paceSeconds };
}

export function calculateTrainingPaces(vdot, unit = "km") {
  if (!vdot || vdot <= 0) {
    return null;
  }

  const paces = {};

  for (const zone of trainingZones) {
    const [minPercent, maxPercent] = zone.vo2Percent;
    const minVO2 = vdot * (minPercent / 100);
    const maxVO2 = vdot * (maxPercent / 100);

    const minVelocity = vo2ToVelocity(minVO2);
    const maxVelocity = vo2ToVelocity(maxVO2);

    const minPace = velocityToPace(maxVelocity, unit);
    const maxPace = velocityToPace(minVelocity, unit);

    if (minPace && maxPace) {
      paces[zone.id] = {
        label: zone.label,
        description: zone.description,
        minPace: formatPace(minPace.min, minPace.sec),
        maxPace: formatPace(maxPace.min, maxPace.sec),
        minVelocity: maxVelocity,
        maxVelocity: minVelocity
      };
    }
  }

  return paces;
}

export function calculateRacePredictions(vdot) {
  if (!vdot || vdot <= 0) {
    return null;
  }

  const predictions = {};

  for (const race of raceDistances) {
    const velocity = vo2ToVelocity(vdot);

    if (velocity) {
      const timeMinutes = race.meters / velocity;
      const timeSeconds = timeMinutes * 60;

      predictions[race.id] = {
        label: race.label,
        meters: race.meters,
        timeSeconds,
        timeFormatted: secondsToHHMMSS(timeSeconds)
      };
    }
  }

  return predictions;
}

export function formatPace(min, sec) {
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function secondsToMMSS(totalSeconds) {
  if (totalSeconds === null || isNaN(totalSeconds)) return "--:--";

  const roundedSeconds = Math.round(totalSeconds);
  const min = Math.floor(roundedSeconds / 60);
  const sec = roundedSeconds % 60;

  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function secondsToHHMMSS(totalSeconds) {
  if (totalSeconds === null || isNaN(totalSeconds)) return "--:--:--";

  const roundedSeconds = Math.round(totalSeconds);
  const h = Math.floor(roundedSeconds / 3600);
  const m = Math.floor((roundedSeconds % 3600) / 60);
  const s = roundedSeconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function hmsToSeconds(h, m, s) {
  return (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
}

export function secondsToMinutes(totalSeconds) {
  if (totalSeconds === null || isNaN(totalSeconds)) return null;
  return totalSeconds / 60;
}
