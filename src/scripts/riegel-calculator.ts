/**
 * Riegel's Formula: T2 = T1 * (D2 / D1)^1.06
 */
export function calculateRiegelTime(d1: number, t1: number, d2: number): number | null {
    if (!d1 || !t1 || !d2 || d1 <= 0 || t1 <= 0 || d2 <= 0) {
        return null;
    }
    return t1 * Math.pow(d2 / d1, 1.06);
}

/**
 * Converts seconds to HH:MM:SS format
 */
export function secondsToHHMMSS(totalSeconds: number | null): string {
    if (totalSeconds === null || isNaN(totalSeconds)) return "--:--:--";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);

    const hh = h > 0 ? h.toString().padStart(2, '0') + ":" : "";
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');

    return `${hh}${mm}:${ss}`;
}

/**
 * Converts HH, MM, SS to total seconds
 */
export function hmsToSeconds(h: string | number, m: string | number, s: string | number): number {
    return (parseInt(h as string) || 0) * 3600 + (parseInt(m as string) || 0) * 60 + (parseInt(s as string) || 0);
}

/**
 * Calculates pace in min/km or min/mile
 */
export function calculatePace(seconds: number | null, distance: number): string {
    if (!seconds || !distance || distance <= 0) return "--:--";
    const paceSeconds = seconds / distance;
    const m = Math.floor(paceSeconds / 60);
    const s = Math.round(paceSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
