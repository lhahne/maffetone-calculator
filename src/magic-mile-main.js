import { initNav } from './nav.js';
import { calculateMagicMilePredictions, secondsToMMSS, secondsToHHMMSS, msToSeconds } from './magic-mile-calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();

    const inputM = document.getElementById('input-m');
    const inputS = document.getElementById('input-s');

    // Result elements
    const result5kTime = document.getElementById('result-5k-time');
    const result5kPace = document.getElementById('result-5k-pace');
    const result10kTime = document.getElementById('result-10k-time');
    const result10kPace = document.getElementById('result-10k-pace');
    const result10mileTime = document.getElementById('result-10mile-time');
    const result10milePace = document.getElementById('result-10mile-pace');
    const resultHalfTime = document.getElementById('result-half-time');
    const resultHalfPace = document.getElementById('result-half-pace');
    const resultMarathonTime = document.getElementById('result-marathon-time');
    const resultMarathonPace = document.getElementById('result-marathon-pace');

    function updatePredictions() {
        const magicMileSeconds = msToSeconds(inputM.value, inputS.value);

        if (magicMileSeconds > 0) {
            const predictions = calculateMagicMilePredictions(magicMileSeconds);

            // 5K
            result5kTime.textContent = secondsToHHMMSS(predictions['5k'].totalTime);
            result5kPace.textContent = `${secondsToMMSS(predictions['5k'].pacePerMile)} /mi`;

            // 10K
            result10kTime.textContent = secondsToHHMMSS(predictions['10k'].totalTime);
            result10kPace.textContent = `${secondsToMMSS(predictions['10k'].pacePerMile)} /mi`;

            // 10 Mile
            result10mileTime.textContent = secondsToHHMMSS(predictions['10mile'].totalTime);
            result10milePace.textContent = `${secondsToMMSS(predictions['10mile'].pacePerMile)} /mi`;

            // Half Marathon
            resultHalfTime.textContent = secondsToHHMMSS(predictions['halfMarathon'].totalTime);
            resultHalfPace.textContent = `${secondsToMMSS(predictions['halfMarathon'].pacePerMile)} /mi`;

            // Marathon
            resultMarathonTime.textContent = secondsToHHMMSS(predictions['marathon'].totalTime);
            resultMarathonPace.textContent = `${secondsToMMSS(predictions['marathon'].pacePerMile)} /mi`;
        } else {
            // Reset all results
            result5kTime.textContent = "--:--";
            result5kPace.textContent = "--:-- /mi";
            result10kTime.textContent = "--:--";
            result10kPace.textContent = "--:-- /mi";
            result10mileTime.textContent = "--:--:--";
            result10milePace.textContent = "--:-- /mi";
            resultHalfTime.textContent = "--:--:--";
            resultHalfPace.textContent = "--:-- /mi";
            resultMarathonTime.textContent = "--:--:--";
            resultMarathonPace.textContent = "--:-- /mi";
        }
    }

    [inputM, inputS].forEach(el => {
        el.addEventListener('input', updatePredictions);
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            inputM.value = btn.dataset.m;
            inputS.value = btn.dataset.s;
            updatePredictions();
        });
    });

    // Initial calculation
    updatePredictions();
});
