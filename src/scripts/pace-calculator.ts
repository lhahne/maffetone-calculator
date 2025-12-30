export const MILES_TO_KM = 1.609344;

export interface Pace {
  minutes: number;
  seconds: number;
}

export function convertPaceToKm(minutes: number | string, seconds: number | string): Pace {
  const totalMinPerMile = (Number(minutes) || 0) + (Number(seconds) || 0) / 60;
  if (totalMinPerMile <= 0) return { minutes: 0, seconds: 0 };

  const totalMinPerKm = totalMinPerMile / MILES_TO_KM;

  let resMin = Math.floor(totalMinPerKm);
  let resSec = Math.round((totalMinPerKm - resMin) * 60);

  if (resSec === 60) {
    resMin += 1;
    resSec = 0;
  }

  return { minutes: resMin, seconds: resSec };
}

export function convertPaceToMiles(minutes: number | string, seconds: number | string): Pace {
  const totalMinPerKm = (Number(minutes) || 0) + (Number(seconds) || 0) / 60;
  if (totalMinPerKm <= 0) return { minutes: 0, seconds: 0 };

  const totalMinPerMile = totalMinPerKm * MILES_TO_KM;

  let resMin = Math.floor(totalMinPerMile);
  let resSec = Math.round((totalMinPerMile - resMin) * 60);

  if (resSec === 60) {
    resMin += 1;
    resSec = 0;
  }

  return { minutes: resMin, seconds: resSec };
}
