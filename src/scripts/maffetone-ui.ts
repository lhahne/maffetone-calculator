import {
    adjustmentOptions,
    calculateMaffetoneRange,
    formatRange,
} from "./calculator";

export function setupMaffetoneCalculator(container: Document | HTMLElement = document) {
    const ageInput = container.querySelector("#age") as HTMLInputElement | null;
    const form = container.querySelector("#calculator-form") as HTMLFormElement | null;
    const resultCard = container.querySelector("#result") as HTMLElement | null;
    const resultRange = container.querySelector("#result-range") as HTMLElement | null;
    const resultBase = container.querySelector("#result-base") as HTMLElement | null;
    const resultNote = container.querySelector("#result-note") as HTMLElement | null;
    const adjustmentRadios = container.querySelectorAll("input[name='adjustment']") as NodeListOf<HTMLInputElement>;

    if (!ageInput || !form || !resultCard || !resultRange || !resultBase || !resultNote) return;

    function getSelectedAdjustment(): number {
        const selected = Array.from(adjustmentRadios).find((radio) => radio.checked);
        return selected ? Number(selected.value) : 0;
    }

    function updateResults() {
        const age = Number(ageInput?.value);
        const adjustment = getSelectedAdjustment();
        const range = calculateMaffetoneRange(age, adjustment);

        if (!range) {
            resultCard?.classList.add("hidden");
            resultNote!.textContent = "Enter a valid age to see your range.";
            return;
        }

        resultCard?.classList.remove("hidden");
        resultRange!.textContent = formatRange(range);
        resultBase!.textContent = `${Math.round(range.base)} bpm`;

        const adjustmentLabel = adjustmentOptions.find(
            (option) => option.adjustment === adjustment,
        )?.label;
        resultNote!.textContent = adjustmentLabel
            ? `Adjustment: ${adjustmentLabel}`
            : "";
    }

    form.addEventListener("input", updateResults);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateResults();
    });

    updateResults();
}
