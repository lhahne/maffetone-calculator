import { calculateMaxHR, calculateAllZones } from "./karvonen-calculator";

export function setupKarvonenCalculator(container: Document | HTMLElement = document) {
    const form = container.querySelector("#karvonen-form") as HTMLFormElement | null;
    const ageInput = container.querySelector("#age") as HTMLInputElement | null;
    const restingHrInput = container.querySelector("#resting-hr") as HTMLInputElement | null;
    const useCustomMaxCheckbox = container.querySelector("#use-custom-max") as HTMLInputElement | null;
    const customMaxContainer = container.querySelector("#custom-max-container") as HTMLElement | null;
    const maxHrInput = container.querySelector("#max-hr") as HTMLInputElement | null;
    const resultsPlaceholder = container.querySelector("#results-placeholder") as HTMLElement | null;
    const zonesContainer = container.querySelector("#zones-container") as HTMLElement | null;
    const maxHrDisplay = container.querySelector("#max-hr-display") as HTMLElement | null;
    const maxHrValue = container.querySelector("#max-hr-value") as HTMLElement | null;
    const maxHrSource = container.querySelector("#max-hr-source") as HTMLElement | null;

    if (!form || !ageInput || !restingHrInput || !useCustomMaxCheckbox || !customMaxContainer || !maxHrInput || !resultsPlaceholder || !zonesContainer || !maxHrDisplay || !maxHrValue || !maxHrSource) return;

    function updateResults() {
        const age = parseInt(ageInput!.value, 10);
        const restingHr = parseInt(restingHrInput!.value, 10);
        const useCustomMax = useCustomMaxCheckbox!.checked;
        const customMaxHr = parseInt(maxHrInput!.value, 10);

        // Determine max HR
        let maxHr: number | null;
        let source: string;
        if (useCustomMax && Number.isFinite(customMaxHr) && customMaxHr > 0) {
            maxHr = customMaxHr;
            source = "(custom)";
        } else if (Number.isFinite(age) && age > 0) {
            maxHr = calculateMaxHR(age);
            source = "(220 - age)";
        } else {
            maxHr = null;
            source = "";
        }

        // Calculate zones
        if (maxHr && Number.isFinite(restingHr) && restingHr > 0) {
            const zones = calculateAllZones(maxHr, restingHr);

            if (zones) {
                resultsPlaceholder!.classList.add("hidden");
                zonesContainer!.classList.remove("hidden");
                maxHrDisplay!.classList.remove("hidden");

                zonesContainer!.innerHTML = zones.map(zone => `
          <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <div>
              <span class="font-semibold text-white">${zone.name}</span>
              <span class="text-slate-400"> · ${zone.label}</span>
            </div>
            <span class="text-lg font-semibold text-sky-300">${zone.hrMin}-${zone.hrMax} bpm</span>
          </div>
        `).join("");

                maxHrValue!.textContent = maxHr.toString();
                maxHrSource!.textContent = source;
            }
        } else {
            resultsPlaceholder!.classList.remove("hidden");
            zonesContainer!.classList.add("hidden");
            maxHrDisplay!.classList.add("hidden");
        }
    }

    function toggleCustomMax() {
        if (useCustomMaxCheckbox!.checked) {
            customMaxContainer!.classList.remove("hidden");
        } else {
            customMaxContainer!.classList.add("hidden");
        }
        updateResults();
    }

    // Event listeners
    ageInput.addEventListener("input", updateResults);
    restingHrInput.addEventListener("input", updateResults);
    useCustomMaxCheckbox.addEventListener("change", toggleCustomMax);
    maxHrInput.addEventListener("input", updateResults);

    // Initial state
    updateResults();
}
