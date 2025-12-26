/**
 * Jeff Galloway's Magic Mile Calculator
 * 
 * Based on the Magic Mile, a one-mile time trial used to predict race paces.
 * 
 * Formulas (per mile pace):
 * - 5K: Magic Mile + 33 seconds
 * - 10K: Magic Mile × 1.15
 * - 10 Mile: Magic Mile × 1.175
 * - Half Marathon: Magic Mile × 1.2
 * - Marathon: Magic Mile × 1.3
 */

/**
 * Calculates predicted race paces based on Magic Mile time
 * @param {number} magicMileSeconds - Magic Mile time in seconds
 * @returns {object} Object containing predicted paces and times for each distance
 */
export function calculateMagicMilePredictions(magicMileSeconds) {
    if (!magicMileSeconds || magicMileSeconds <= 0) {
        return null;
    }

    // Distances in miles
    const distances = {
        '5k': 3.10686,
        '10k': 6.21371,
        '10mile': 10,
        'halfMarathon': 13.1094,
        'marathon': 26.2188
    };

    // Per-mile pace multipliers/additions
    const predictions = {
        '5k': {
            pacePerMile: magicMileSeconds + 33,
            distance: distances['5k'],
            label: '5K'
        },
        '10k': {
            pacePerMile: magicMileSeconds * 1.15,
            distance: distances['10k'],
            label: '10K'
        },
        '10mile': {
            pacePerMile: magicMileSeconds * 1.175,
            distance: distances['10mile'],
            label: '10 Mile'
        },
        'halfMarathon': {
            pacePerMile: magicMileSeconds * 1.2,
            distance: distances['halfMarathon'],
            label: 'Half Marathon'
        },
        'marathon': {
            pacePerMile: magicMileSeconds * 1.3,
            distance: distances['marathon'],
            label: 'Marathon'
        }
    };

    // Calculate total race times
    for (const key in predictions) {
        predictions[key].totalTime = predictions[key].pacePerMile * predictions[key].distance;
        // Convert pace to per km as well
        predictions[key].pacePerKm = predictions[key].pacePerMile / 1.60934;
    }

    return predictions;
}

/**
 * Converts seconds to MM:SS format (for pace)
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function secondsToMMSS(totalSeconds) {
    if (totalSeconds === null || isNaN(totalSeconds)) return "--:--";

    const m = Math.floor(totalSeconds / 60);
    const s = Math.round(totalSeconds % 60);

    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Converts seconds to HH:MM:SS format (for race times)
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function secondsToHHMMSS(totalSeconds) {
    if (totalSeconds === null || isNaN(totalSeconds)) return "--:--:--";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Converts MM, SS to total seconds
 * @param {number} m 
 * @param {number} s 
 * @returns {number}
 */
export function msToSeconds(m, s) {
    return (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
}
