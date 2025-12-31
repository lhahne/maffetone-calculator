import { describe, it, expect, afterEach } from "bun:test";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { VdotCalculator } from "../src/components/calculators/VdotCalculator";
import { calculateVDOT, predictRaceTime, getTrainingPaces } from "../src/scripts/vdot-calculator";
import React from "react";
import "./setup";

describe("VDOT Calculator Logic", () => {
    it("calculates VDOT for 10k in 50:00", () => {
        const vdot = calculateVDOT(10000, 50 * 60);
        expect(vdot).toBeCloseTo(40.0, 1);
    });

    it("calculates VDOT for 5k in 20:00", () => {
        const vdot = calculateVDOT(5000, 20 * 60);
        expect(vdot).toBeCloseTo(49.8, 1);
    });

    it("predicts race time for 5k given 10k time", () => {
        const vdot = calculateVDOT(10000, 50 * 60); // 40.0
        const predicted5kSeconds = predictRaceTime(vdot, 5000);
        // Daniels formula for VDOT 40.0 5k is ~24:06
        expect(predicted5kSeconds / 60).toBeCloseTo(24.1, 0.1);
    });

    it("getTrainingPaces returns reasonable values", () => {
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
    afterEach(() => {
        cleanup();
    });

    it("calculates VDOT and populates UI", () => {
        const { container } = render(React.createElement(VdotCalculator));

        // The component has default values: 5km in 20:00
        // Check page content for expected elements
        const pageText = container.textContent;

        // Check that VDOT score is displayed - should be around 49.8 for 5k in 20:00
        expect(pageText).toContain("49");

        // Check that training paces table exists
        expect(pageText).toContain("Easy (E)");

        // Check that race predictions exist
        expect(pageText).toContain("5K");
        expect(pageText).toContain("Marathon");
    });

    it("updates when preset is clicked", async () => {
        const { getByDisplayValue, container } = render(React.createElement(VdotCalculator));

        // Find and click the 10K preset button
        const presetButtons = container.querySelectorAll('button');
        const tenKButton = Array.from(presetButtons).find(btn => btn.textContent === '10K');
        expect(tenKButton).toBeTruthy();

        if (tenKButton) {
            await act(async () => {
                fireEvent.click(tenKButton);
            });

            // Distance should now be 10
            expect(getByDisplayValue("10")).toBeTruthy();

            // VDOT should change - 10k in 20:00 would give a much higher VDOT
            const pageText = container.textContent;
            // 10k in 20:00 is very fast, VDOT should be very high
            expect(pageText).toContain("Easy (E)");
        }
    });
});
