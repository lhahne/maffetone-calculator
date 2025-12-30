import { describe, expect, it, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import {
    calculateMagicMilePredictions,
    secondsToMMSS,
    secondsToHHMMSS,
    msToSeconds
} from "../src/scripts/magic-mile-calculator";
import { setupMagicMileCalculator } from "../src/scripts/magic-mile-ui";

describe("Magic Mile Calculator Logic", () => {
    it("calculates predictions correctly for 7:00 mile", () => {
        const seconds = 420; // 7 minutes
        const predictions = calculateMagicMilePredictions(seconds);

        expect(predictions).not.toBeNull();
        if (predictions) {
            // 5K = Magic Mile + 33s = 7:33/mi
            expect(predictions["5k"].pacePerMile).toBeCloseTo(453);
            // 10K = Magic Mile * 1.15 = 483s (8:03/mi)
            expect(predictions["10k"].pacePerMile).toBeCloseTo(483);
            // Marathon = Magic Mile * 1.3 = 546s (9:06/mi)
            expect(predictions["marathon"].pacePerMile).toBeCloseTo(546);
        }
    });

    it("converts ms to seconds", () => {
        expect(msToSeconds(7, 0)).toBe(420);
        expect(msToSeconds(10, 30)).toBe(630);
    });

    it("converts seconds to MM:SS", () => {
        expect(secondsToMMSS(420)).toBe("7:00");
        expect(secondsToMMSS(453)).toBe("7:33");
    });
});

describe("Magic Mile Calculator UI", () => {
    let window: Window;

    beforeEach(() => {
        window = new Window();
        globalThis.window = window as any;
        globalThis.document = window.document as any;

        document.body.innerHTML = `
            <input id="input-m" value="7" />
            <input id="input-s" value="00" />
            <div id="result-5k-time"></div>
            <div id="result-5k-pace"></div>
            <div id="result-10k-time"></div>
            <div id="result-10k-pace"></div>
            <div id="result-10mile-time"></div>
            <div id="result-10mile-pace"></div>
            <div id="result-half-time"></div>
            <div id="result-half-pace"></div>
            <div id="result-marathon-time"></div>
            <div id="result-marathon-pace"></div>
            <button class="preset-btn" data-m="6" data-s="00">6:00</button>
        `;
    });

    it("updates results on load", () => {
        setupMagicMileCalculator();
        const result5kPace = document.querySelector("#result-5k-pace") as HTMLElement;
        expect(result5kPace.textContent).toBe("7:33 /mi");
    });

    it("updates when inputs change", () => {
        setupMagicMileCalculator();
        const inputM = document.querySelector("#input-m") as HTMLInputElement;
        inputM.value = "8";
        inputM.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

        const result5kPace = document.querySelector("#result-5k-pace") as HTMLElement;
        // 8:00 + 33s = 8:33
        expect(result5kPace.textContent).toBe("8:33 /mi");
    });

    it("handles presets", () => {
        setupMagicMileCalculator();
        const presetBtn = document.querySelector(".preset-btn") as HTMLButtonElement;
        presetBtn.click();

        const inputM = document.querySelector("#input-m") as HTMLInputElement;
        expect(inputM.value).toBe("6");

        const result5kPace = document.querySelector("#result-5k-pace") as HTMLElement;
        // 6:00 + 33s = 6:33
        expect(result5kPace.textContent).toBe("6:33 /mi");
    });
});
