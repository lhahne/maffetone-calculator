import { describe, expect, it, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import {
    calculateRiegelTime,
    secondsToHHMMSS,
    hmsToSeconds,
    calculatePace,
} from "../src/scripts/riegel-calculator";
import { setupRiegelCalculator } from "../src/scripts/riegel-ui";

describe("Riegel Calculator Logic", () => {
    it("calculates predicted time correctly (5k to 10k)", () => {
        // 5k (5 km) in 20:00 (1200s)
        // T2 = 1200 * (10 / 5)^1.06 = 1200 * 2^1.06 ≈ 1200 * 2.0849 ≈ 2501.9s (~41:42)
        const t2 = calculateRiegelTime(5, 1200, 10);
        expect(t2).not.toBeNull();
        if (t2 !== null) {
            expect(t2).toBeCloseTo(2501.9, 1);
        }
    });

    it("returns null for invalid inputs", () => {
        expect(calculateRiegelTime(0, 1200, 10)).toBeNull();
        expect(calculateRiegelTime(5, 0, 10)).toBeNull();
        expect(calculateRiegelTime(5, 1200, -1)).toBeNull();
    });

    it("converts seconds to HH:MM:SS", () => {
        expect(secondsToHHMMSS(3661)).toBe("01:01:01");
        expect(secondsToHHMMSS(1200)).toBe("20:00");
        expect(secondsToHHMMSS(45)).toBe("00:45");
    });

    it("converts HH, MM, SS to seconds", () => {
        expect(hmsToSeconds(1, 1, 1)).toBe(3661);
        expect(hmsToSeconds(0, 20, 0)).toBe(1200);
    });

    it("calculates pace", () => {
        expect(calculatePace(1200, 5)).toBe("4:00");
        expect(calculatePace(2502, 10)).toBe("4:10"); // Approx
    });
});

describe("Riegel Calculator UI", () => {
    let window: Window;

    beforeEach(() => {
        window = new Window();
        globalThis.window = window as any;
        globalThis.document = window.document as any;

        document.body.innerHTML = `
            <input id="input-distance" value="5" />
            <input id="input-h" value="0" />
            <input id="input-m" value="20" />
            <input id="input-s" value="00" />
            <input id="target-distance" value="10" />
            <div id="result-time"></div>
            <div id="result-pace"></div>
            <button class="preset-btn" data-value="10">10k</button>
            <button class="target-preset-btn" data-value="21.1">HM</button>
        `;
    });

    it("predicts time and pace correctly", () => {
        setupRiegelCalculator();

        const resultTime = document.querySelector("#result-time") as HTMLElement;
        const resultPace = document.querySelector("#result-pace") as HTMLElement;

        // Initial check (5k in 20:00 -> 10k)
        expect(resultTime.textContent).toBe("41:42"); // 2502s
        expect(resultPace.textContent).toBe("4:10 min/km");
    });

    it("updates when input changes", () => {
        setupRiegelCalculator();

        const inputM = document.querySelector("#input-m") as HTMLInputElement;
        inputM.value = "25";
        inputM.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

        const resultTime = document.querySelector("#result-time") as HTMLElement;
        // 5k in 25:00 -> 10k is ~52:07
        expect(resultTime.textContent).toBe("52:07");
    });

    it("handles presets correctly", () => {
        setupRiegelCalculator();

        const presetBtn = document.querySelector(".preset-btn") as HTMLButtonElement;
        presetBtn.click();

        const inputDist = document.querySelector("#input-distance") as HTMLInputElement;
        expect(inputDist.value).toBe("10");

        const resultTime = document.querySelector("#result-time") as HTMLElement;
        // 10k in 20:00 -> 10k is 20:00
        expect(resultTime.textContent).toBe("20:00");
    });
});
