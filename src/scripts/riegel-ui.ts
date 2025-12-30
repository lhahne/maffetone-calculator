import { calculateRiegelTime, secondsToHHMMSS, hmsToSeconds, calculatePace } from "./riegel-calculator";

export function setupRiegelCalculator(container: Document | HTMLElement = document) {
    const inputDist = container.querySelector('#input-distance') as HTMLInputElement | null;
    const inputH = container.querySelector('#input-h') as HTMLInputElement | null;
    const inputM = container.querySelector('#input-m') as HTMLInputElement | null;
    const inputS = container.querySelector('#input-s') as HTMLInputElement | null;
    const targetDist = container.querySelector('#target-distance') as HTMLInputElement | null;
    const resultTime = container.querySelector('#result-time') as HTMLElement | null;
    const resultPace = container.querySelector('#result-pace') as HTMLElement | null;

    if (!inputDist || !inputH || !inputM || !inputS || !targetDist || !resultTime || !resultPace) return;

    function updatePrediction() {
        const d1 = parseFloat(inputDist!.value);
        const d2 = parseFloat(targetDist!.value);
        const t1 = hmsToSeconds(inputH!.value, inputM!.value, inputS!.value);

        if (d1 > 0 && d2 > 0 && t1 > 0) {
            const t2 = calculateRiegelTime(d1, t1, d2);
            resultTime!.textContent = secondsToHHMMSS(t2);
            resultPace!.textContent = `${calculatePace(t2, d2)} min/km`;
        } else {
            resultTime!.textContent = "--:--:--";
            resultPace!.textContent = "--:-- min/km";
        }
    }

    [inputDist, inputH, inputM, inputS, targetDist].forEach(el => {
        el!.addEventListener('input', updatePrediction);
    });

    container.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            inputDist!.value = (btn as HTMLButtonElement).dataset.value!;
            updatePrediction();
        });
    });

    container.querySelectorAll('.target-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            targetDist!.value = (btn as HTMLButtonElement).dataset.value!;
            updatePrediction();
        });
    });

    // Initial calculation
    updatePrediction();
}
