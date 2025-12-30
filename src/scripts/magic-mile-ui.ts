import { calculateMagicMilePredictions, secondsToMMSS, secondsToHHMMSS, msToSeconds } from "./magic-mile-calculator";

export function setupMagicMileCalculator(container: Document | HTMLElement = document) {
    const inputM = container.querySelector('#input-m') as HTMLInputElement | null;
    const inputS = container.querySelector('#input-s') as HTMLInputElement | null;

    if (!inputM || !inputS) return;

    // Result elements
    const result5kTime = container.querySelector('#result-5k-time') as HTMLElement | null;
    const result5kPace = container.querySelector('#result-5k-pace') as HTMLElement | null;
    const result10kTime = container.querySelector('#result-10k-time') as HTMLElement | null;
    const result10kPace = container.querySelector('#result-10k-pace') as HTMLElement | null;
    const result10mileTime = container.querySelector('#result-10mile-time') as HTMLElement | null;
    const result10milePace = container.querySelector('#result-10mile-pace') as HTMLElement | null;
    const resultHalfTime = container.querySelector('#result-half-time') as HTMLElement | null;
    const resultHalfPace = container.querySelector('#result-half-pace') as HTMLElement | null;
    const resultMarathonTime = container.querySelector('#result-marathon-time') as HTMLElement | null;
    const resultMarathonPace = container.querySelector('#result-marathon-pace') as HTMLElement | null;

    if (!result5kTime || !result5kPace || !result10kTime || !result10kPace || !result10mileTime || !result10milePace || !resultHalfTime || !resultHalfPace || !resultMarathonTime || !resultMarathonPace) return;

    function updatePredictions() {
        const magicMileSeconds = msToSeconds(inputM!.value, inputS!.value);

        if (magicMileSeconds > 0) {
            const predictions = calculateMagicMilePredictions(magicMileSeconds);

            if (!predictions) return;

            // 5K
            result5kTime!.textContent = secondsToHHMMSS(predictions['5k'].totalTime ?? null);
            result5kPace!.textContent = `${secondsToMMSS(predictions['5k'].pacePerMile ?? null)} /mi`;

            // 10K
            result10kTime!.textContent = secondsToHHMMSS(predictions['10k'].totalTime ?? null);
            result10kPace!.textContent = `${secondsToMMSS(predictions['10k'].pacePerMile ?? null)} /mi`;

            // 10 Mile
            result10mileTime!.textContent = secondsToHHMMSS(predictions['10mile'].totalTime ?? null);
            result10milePace!.textContent = `${secondsToMMSS(predictions['10mile'].pacePerMile ?? null)} /mi`;

            // Half Marathon
            resultHalfTime!.textContent = secondsToHHMMSS(predictions['halfMarathon'].totalTime ?? null);
            resultHalfPace!.textContent = `${secondsToMMSS(predictions['halfMarathon'].pacePerMile ?? null)} /mi`;

            // Marathon
            resultMarathonTime!.textContent = secondsToHHMMSS(predictions['marathon'].totalTime ?? null);
            resultMarathonPace!.textContent = `${secondsToMMSS(predictions['marathon'].pacePerMile ?? null)} /mi`;
        } else {
            // Reset all results
            result5kTime!.textContent = "--:--";
            result5kPace!.textContent = "--:-- /mi";
            result10kTime!.textContent = "--:--";
            result10kPace!.textContent = "--:-- /mi";
            result10mileTime!.textContent = "--:--:--";
            result10milePace!.textContent = "--:-- /mi";
            resultHalfTime!.textContent = "--:--:--";
            resultHalfPace!.textContent = "--:-- /mi";
            resultMarathonTime!.textContent = "--:--:--";
            resultMarathonPace!.textContent = "--:-- /mi";
        }
    }

    [inputM, inputS].forEach(el => {
        el!.addEventListener('input', updatePredictions);
    });

    container.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const b = btn as HTMLButtonElement;
            inputM!.value = b.dataset.m!;
            inputS!.value = b.dataset.s!;
            updatePredictions();
        });
    });

    // Initial calculation
    updatePredictions();
}
