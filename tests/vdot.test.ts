import { expect, test, describe, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import { calculateVDOT, predictRaceTime, getTrainingPaces } from "../src/scripts/vdot-calculator";
import { setupVDOTCalculator } from "../src/scripts/vdot-ui";

describe("VDOT Calculator Logic", () => {
    test("calculates VDOT for 10k in 50:00", () => {
        const vdot = calculateVDOT(10000, 50 * 60);
        expect(vdot).toBeCloseTo(40.0, 1);
    });

    test("calculates VDOT for 5k in 20:00", () => {
        const vdot = calculateVDOT(5000, 20 * 60);
        expect(vdot).toBeCloseTo(49.8, 1);
    });

    test("predicts race time for 5k given 10k time", () => {
        const vdot = calculateVDOT(10000, 50 * 60); // 40.0
        const predicted5kSeconds = predictRaceTime(vdot, 5000);
        // Daniels formula for VDOT 40.0 5k is ~24:06
        expect(predicted5kSeconds / 60).toBeCloseTo(24.1, 0.1);
    });

    test("getTrainingPaces returns reasonable values", () => {
        const vdot = 40.7; // 10k in 50:00
        const paces = getTrainingPaces(vdot);
        expect(paces.length).toBe(5);
        expect(paces[0].name).toBe("Easy (E)");
        // E pace for VDOT 40.7 is roughly 5:45 - 6:20 min/km?
        // Let's check 70% VDOT
        const ePace = paces[0].paceSecondsPerKm / 60;
        expect(ePace).toBeGreaterThan(5);
        expect(ePace).toBeLessThan(7);
    });
});

describe("VDOT Calculator UI", () => {
    let window: Window;

    beforeEach(() => {
        window = new Window();
        globalThis.window = window as any;
        globalThis.document = window.document as any;

        document.body.innerHTML = `
            <input id="input-distance" value="10" />
            <input id="input-h" value="0" />
            <input id="input-m" value="50" />
            <input id="input-s" value="00" />
            <div id="vdot-score"></div>
            <table id="training-paces-body"></table>
            <div id="race-predictions"></div>
            <button class="preset-btn" data-value="5">5k</button>
        `;
    });

    test("calculates VDOT and populates UI", () => {
        setupVDOTCalculator();

        const vdotDisplay = document.querySelector("#vdot-score") as HTMLElement;
        const pacesBody = document.querySelector("#training-paces-body") as HTMLElement;
        const predictions = document.querySelector("#race-predictions") as HTMLElement;

        expect(vdotDisplay.textContent).toBe("40.0");
        expect(pacesBody.innerHTML).toContain("Easy (E)");
        expect(predictions.innerHTML).toContain("5K");
    });

    test("updates when preset is clicked", () => {
        setupVDOTCalculator();

        const presetBtn = document.querySelector(".preset-btn") as HTMLButtonElement;
        presetBtn.click();

        const vdotDisplay = document.querySelector("#vdot-score") as HTMLElement;
        const inputDist = document.querySelector("#input-distance") as HTMLInputElement;

        expect(inputDist.value).toBe("5");
        // 5k in 50:00 -> VDOT is much lower
        expect(parseFloat(vdotDisplay.textContent || "0")).toBeLessThan(30);
    });
});
