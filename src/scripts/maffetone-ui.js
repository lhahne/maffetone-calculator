import {
    adjustmentOptions,
    calculateMaffetoneRange,
    formatRange,
} from "./calculator.js";

export function setupMaffetoneCalculator(container = document) {
    const ageInput = container.querySelector("#age");
    const form = container.querySelector("#calculator-form");
    const resultCard = container.querySelector("#result");
    const resultRange = container.querySelector("#result-range");
    const resultBase = container.querySelector("#result-base");
    const resultNote = container.querySelector("#result-note");
    const adjustmentRadios = container.querySelectorAll("input[name='adjustment']");

    if (!ageInput || !form || !resultRange || !resultBase || !resultNote) return;

    function getSelectedAdjustment() {
        const selected = Array.from(adjustmentRadios).find((radio) => radio.checked);
        return selected ? Number(selected.value) : 0;
    }

    function updateResults() {
        const age = Number(ageInput.value);
        const adjustment = getSelectedAdjustment();
        const range = calculateMaffetoneRange(age, adjustment);

        if (!range) {
            resultCard.classList.add("hidden");
            resultNote.textContent = "Enter a valid age to see your range.";
            return;
        }

        resultCard.classList.remove("hidden");
        resultRange.textContent = formatRange(range);
        resultBase.textContent = `${Math.round(range.base)} bpm`;

        const adjustmentLabel = adjustmentOptions.find(
            (option) => option.adjustment === adjustment,
        )?.label;
        resultNote.textContent = adjustmentLabel
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
