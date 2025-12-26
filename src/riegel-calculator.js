/**
 * Riegel's Formula: T2 = T1 * (D2 / D1)^1.06
 * 
 * @param {number} d1 - Recent race distance
 * @param {number} t1 - Recent race time in seconds
 * @param {number} d2 - Target race distance
 * @returns {number} Estimated race time in seconds
 */
export function calculateRiegelTime(d1, t1, d2) {
    if (!d1 || !t1 || !d2 || d1 <= 0 || t1 <= 0 || d2 <= 0) {
        return null;
    }
    return t1 * Math.pow(d2 / d1, 1.06);
}

/**
 * Converts seconds to HH:MM:SS format
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function secondsToHHMMSS(totalSeconds) {
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
 * @param {number} h 
 * @param {number} m 
 * @param {number} s 
 * @returns {number}
 */
export function hmsToSeconds(h, m, s) {
    return (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
}

/**
 * Calculates pace in min/km or min/mile
 * @param {number} seconds 
 * @param {number} distance 
 * @returns {string}
 */
export function calculatePace(seconds, distance) {
    if (!seconds || !distance || distance <= 0) return "--:--";
    const paceSeconds = seconds / distance;
    const m = Math.floor(paceSeconds / 60);
    const s = Math.round(paceSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
