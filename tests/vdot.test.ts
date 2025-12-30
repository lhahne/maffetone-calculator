import { expect, test, describe } from "bun:test";
import { calculateVDOT, predictRaceTime, getTrainingPaces } from "../src/scripts/vdot-calculator";

describe("VDOT Calculator", () => {
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
