/**
 * Jack Daniels' VDOT Formula Calculations
 */

/**
 * Calculates Oxygen Cost (VO2) for a given speed (velocity)
 * VO2 = -4.60 + 0.182258 * v + 0.000104 * v^2
 * @param v velocity in meters per minute
 */
export function calculateVO2(v: number): number {
    return -4.60 + 0.182258 * v + 0.000104 * Math.pow(v, 2);
}

/**
 * Calculates percentage of VO2max sustained for a given time
 * %VO2max = 0.8 + 0.1894393 * exp(-0.012778 * t) + 0.2989558 * exp(-0.1932605 * t)
 * @param t time in minutes
 */
export function calculatePercentVO2max(t: number): number {
    return 0.8 + 0.1894393 * Math.exp(-0.012778 * t) + 0.2989558 * Math.exp(-0.1932605 * t);
}

/**
 * Calculates VDOT from distance (meters) and time (seconds)
 */
export function calculateVDOT(distanceMeters: number, timeSeconds: number): number {
    const t = timeSeconds / 60; // time in minutes
    const v = distanceMeters / t; // velocity in m/min
    const vo2 = calculateVO2(v);
    const percentVO2max = calculatePercentVO2max(t);
    return vo2 / percentVO2max;
}

/**
 * Solves for speed (v) given target VO2
 * Uses quadratic formula: 0.000104*v^2 + 0.182258*v - (4.60 + targetVO2) = 0
 */
export function velocityForVO2(targetVO2: number): number {
    const a = 0.000104;
    const b = 0.182258;
    const c = -(4.60 + targetVO2);
    // x = (-b + sqrt(b^2 - 4ac)) / 2a
    return (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
}

/**
 * Predicts race time (seconds) for a distance (meters) using a VDOT score
 * Solves VDOT * %VO2max(t) - VO2(D/t) = 0 for t
 */
export function predictRaceTime(vdot: number, distanceMeters: number): number {
    // Initial guess: assume the runner can maintain current speed or some reasonable pace
    // Let's use a simple binary search or Newton's method
    let t = 10; // minutes, initial guess
    for (let i = 0; i < 20; i++) {
        const v = distanceMeters / t;
        const vo2 = calculateVO2(v);
        const p = calculatePercentVO2max(t);
        const f = vdot * p - vo2;

        // Derivative (approximate or exact)
        // d/dt (calculatePercentVO2max(t)) = -0.012778 * 0.1894393 * exp(...) - 0.1932605 * 0.2989558 * exp(...)
        // d/dt (calculateVO2(D/t)) = d/dv (VO2(v)) * dv/dt = (0.182258 + 2 * 0.000104 * v) * (-D/t^2)
        const dp = -0.012778 * 0.1894393 * Math.exp(-0.012778 * t) - 0.1932605 * 0.2989558 * Math.exp(-0.1932605 * t);
        const dv = 0.182258 + 2 * 0.000104 * v;
        const df = vdot * dp - dv * (-distanceMeters / Math.pow(t, 2));

        const dt = f / df;
        t = t - dt;
        if (Math.abs(dt) < 0.00001) break;
    }
    return t * 60;
}

export interface TrainingPace {
    name: string;
    description: string;
    vdotPercent: number;
    paceSecondsPerKm: number;
}

export function getTrainingPaces(vdot: number): TrainingPace[] {
    const paces = [
        { name: "Easy (E)", description: "Aerobic development, recovery", vdotPercent: 0.70 },
        { name: "Marathon (M)", description: "Marathon goal pace", vdotPercent: 0.80 },
        { name: "Threshold (T)", description: "Lactate threshold", vdotPercent: 0.88 },
        { name: "Interval (I)", description: "VO2max development", vdotPercent: 0.98 },
        { name: "Repetition (R)", description: "Economy and speed", vdotPercent: 1.10 }
    ];

    return paces.map(p => {
        const targetVO2 = vdot * p.vdotPercent;
        const velocity = velocityForVO2(targetVO2);
        const paceSecondsPerKm = 1000 / velocity * 60;
        return {
            ...p,
            paceSecondsPerKm
        };
    });
}

// Helpers duplicated from riegel for now to avoid cross-imports if preferred, 
// but it's better to be consistent.
export function formatTime(totalSeconds: number): string {
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.round(totalSeconds % 60);

    if (s === 60) {
        s = 0;
        m += 1;
    }
    if (m === 60) {
        m = 0;
        h += 1;
    }

    const hh = h > 0 ? h + ":" : "";
    let mmStr = m.toString();
    if (h > 0 && m < 10) mmStr = "0" + m;
    const ssStr = s.toString().padStart(2, '0');

    return `${hh}${mmStr}:${ssStr}`;
}

export function formatPace(secondsPerKm: number): string {
    let m = Math.floor(secondsPerKm / 60);
    let s = Math.round(secondsPerKm % 60);

    if (s === 60) {
        s = 0;
        m += 1;
    }

    return `${m}:${s.toString().padStart(2, '0')}`;
}
