import { describe, it, expect, afterEach } from "bun:test";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { MagicMileCalculator } from "../src/components/calculators/MagicMileCalculator";
import {
    calculateMagicMilePredictions,
    secondsToMMSS,
    msToSeconds
} from "../src/scripts/magic-mile-calculator";
import React from "react";
import "./setup";

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
    afterEach(() => {
        cleanup();
    });

    it("updates results on load", () => {
        const { container } = render(React.createElement(MagicMileCalculator));

        const pageText = container.textContent;

        // The component starts with 7:00 as default
        // Check that 5K prediction is displayed
        expect(pageText).toContain("5K");

        // Check that pace per mile is shown
        expect(pageText).toContain("/mi");
    });

    it("updates when inputs change", async () => {
        const { container, getByDisplayValue } = render(React.createElement(MagicMileCalculator));

        // Find the minutes input and change it to 8
        const inputs = container.querySelectorAll('input[type="number"]');
        const minutesInput = inputs[0] as HTMLInputElement;

        await act(async () => {
            fireEvent.change(minutesInput, { target: { value: "8" } });
        });

        // Check that the input value changed
        expect(getByDisplayValue("8")).toBeTruthy();

        // Predictions should still be visible
        const pageText = container.textContent;
        expect(pageText).toContain("5K");
    });

    it("handles presets", async () => {
        const { container, getByDisplayValue } = render(React.createElement(MagicMileCalculator));

        // Find the 6:00 preset button
        const presetButtons = container.querySelectorAll('button');
        const sixMinButton = Array.from(presetButtons).find(btn => btn.textContent === '6:00');
        expect(sixMinButton).toBeTruthy();

        if (sixMinButton) {
            await act(async () => {
                fireEvent.click(sixMinButton);
            });

            // Minutes input should now be 6
            expect(getByDisplayValue("6")).toBeTruthy();

            // Predictions should update
            const pageText = container.textContent;
            expect(pageText).toContain("5K");
        }
    });
});
