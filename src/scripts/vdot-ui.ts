import {
    calculateVDOT,
    predictRaceTime,
    getTrainingPaces,
    formatTime,
    formatPace,
} from "./vdot-calculator";
import { hmsToSeconds } from "./riegel-calculator";

export function setupVDOTCalculator(container: Document | HTMLElement = document) {
    const inputDist = container.querySelector(
        "#input-distance",
    ) as HTMLInputElement | null;
    const inputH = container.querySelector(
        "#input-h",
    ) as HTMLInputElement | null;
    const inputM = container.querySelector(
        "#input-m",
    ) as HTMLInputElement | null;
    const inputS = container.querySelector(
        "#input-s",
    ) as HTMLInputElement | null;
    const vdotDisplay = container.querySelector("#vdot-score") as HTMLElement | null;
    const trainingPacesBody = container.querySelector(
        "#training-paces-body",
    ) as HTMLElement | null;
    const racePredictions = container.querySelector("#race-predictions") as HTMLElement | null;

    if (
        !inputDist ||
        !inputH ||
        !inputM ||
        !inputS ||
        !vdotDisplay ||
        !trainingPacesBody ||
        !racePredictions
    )
        return;

    const commonDistances = [
        { name: "5K", distance: 5000 },
        { name: "10K", distance: 10000 },
        { name: "Half Marathon", distance: 21097.5 },
        { name: "Marathon", distance: 42195 },
    ];

    function updateResults() {
        const distanceMeters = parseFloat(inputDist!.value) * 1000;
        const timeSeconds = hmsToSeconds(
            inputH!.value,
            inputM!.value,
            inputS!.value,
        );

        if (distanceMeters > 0 && timeSeconds > 0) {
            const vdot = calculateVDOT(distanceMeters, timeSeconds);
            vdotDisplay!.textContent = vdot.toFixed(1);

            // Update Training Paces
            const paces = getTrainingPaces(vdot);
            trainingPacesBody!.innerHTML = paces
                .map(
                    (p) => `
                <tr class="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4 font-medium text-white">${p.name}</td>
                    <td class="px-6 py-4 text-emerald-400 font-mono text-lg">${formatPace(p.paceSecondsPerKm)}</td>
                    <td class="px-6 py-4 text-slate-400 text-sm">${p.description}</td>
                </tr>
            `,
                )
                .join("");

            // Update Race Predictions
            racePredictions!.innerHTML = commonDistances
                .map((d) => {
                    const predictedSeconds = predictRaceTime(
                        vdot,
                        d.distance,
                    );
                    return `
                    <div class="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-2">
                        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${d.name}</p>
                        <p class="text-2xl font-bold text-white">${formatTime(predictedSeconds)}</p>
                        <p class="text-xs text-slate-400">${formatPace(predictedSeconds / (d.distance / 1000))} min/km</p>
                    </div>
                `;
                })
                .join("");
        } else {
            vdotDisplay!.textContent = "--.-";
            trainingPacesBody!.innerHTML = "";
            racePredictions!.innerHTML = "";
        }
    }

    [inputDist, inputH, inputM, inputS].forEach((el) => {
        el!.addEventListener("input", updateResults);
    });

    container.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            inputDist!.value = (btn as HTMLButtonElement).dataset.value!;
            updateResults();
        });
    });

    // Initial update
    updateResults();
}
