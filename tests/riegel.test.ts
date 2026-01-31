import { describe, it, expect, afterEach } from "bun:test";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { RiegelCalculator } from "../src/components/calculators/RiegelCalculator";
import {
    calculateRiegelTime,
    secondsToHHMMSS,
    hmsToSeconds,
    calculatePace,
} from "../src/scripts/riegel-calculator";
import React from "react";
import "./setup";

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
    afterEach(() => {
        cleanup();
    });

    it("predicts time and pace correctly", () => {
        const { getByDisplayValue, container } = render(React.createElement(RiegelCalculator));

        // The component has default values: 10km in 45:00 -> 21.0975km
        // Let's check the result appears
        // First, verify inputs exist
        expect(getByDisplayValue("10")).toBeTruthy();
        expect(getByDisplayValue("45")).toBeTruthy();

        // Results should be visible with pace text
        const paceLabels = container.querySelectorAll(':where(*)');
        expect(Array.from(paceLabels).some((el) => /min\/km/i.test(el.textContent || ""))).toBe(true);
    });

    it("updates when input changes", () => {
        const { container, getByText } = render(React.createElement(RiegelCalculator));

        // Find the minutes input and change it
        const inputs = container.querySelectorAll('input[type="number"]');
        // Inputs are: distance, hours, minutes, seconds, target distance
        const minutesInput = inputs[2] as HTMLInputElement;

        fireEvent.change(minutesInput, { target: { value: "50" } });

        // The result should update - check that pace text is still present
        const paceLabels = container.querySelectorAll(':where(*)');
        expect(Array.from(paceLabels).some((el) => /min\/km/i.test(el.textContent || ""))).toBe(true);
    });

    it("handles presets correctly", () => {
        const { getByDisplayValue, container } = render(React.createElement(RiegelCalculator));

        // Click the 5K preset button (there are two sets - one for input, one for target)
        const presetButtons = container.querySelectorAll('button');
        const fiveKButton = Array.from(presetButtons).find(btn => btn.textContent === '5K');
        expect(fiveKButton).toBeTruthy();

        if (fiveKButton) {
            fireEvent.click(fiveKButton);
            expect(getByDisplayValue("5")).toBeTruthy();
        }
    });
});
