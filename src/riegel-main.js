import { initNav } from './nav.js';
import { calculateRiegelTime, secondsToHHMMSS, hmsToSeconds, calculatePace } from './riegel-calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();

    const inputDist = document.getElementById('input-distance');
    const inputH = document.getElementById('input-h');
    const inputM = document.getElementById('input-m');
    const inputS = document.getElementById('input-s');
    const targetDist = document.getElementById('target-distance');
    const resultTime = document.getElementById('result-time');
    const resultPace = document.getElementById('result-pace');

    function updatePrediction() {
        const d1 = parseFloat(inputDist.value);
        const d2 = parseFloat(targetDist.value);
        const t1 = hmsToSeconds(inputH.value, inputM.value, inputS.value);

        if (d1 > 0 && d2 > 0 && t1 > 0) {
            const t2 = calculateRiegelTime(d1, t1, d2);
            resultTime.textContent = secondsToHHMMSS(t2);
            resultPace.textContent = `${calculatePace(t2, d2)} min/km`;
        } else {
            resultTime.textContent = "--:--:--";
            resultPace.textContent = "--:-- min/km";
        }
    }

    [inputDist, inputH, inputM, inputS, targetDist].forEach(el => {
        el.addEventListener('input', updatePrediction);
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            inputDist.value = btn.dataset.value;
            updatePrediction();
        });
    });

    document.querySelectorAll('.target-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            targetDist.value = btn.dataset.value;
            updatePrediction();
        });
    });

    // Initial calculation
    updatePrediction();
});
