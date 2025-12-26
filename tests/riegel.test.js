import { describe, expect, it } from "bun:test";
import {
    calculateRiegelTime,
    secondsToHHMMSS,
    hmsToSeconds,
    calculatePace,
} from "../src/riegel-calculator.js";

describe("Riegel Calculator Logic", () => {
    it("calculates predicted time correctly (5k to 10k)", () => {
        // 5k (5 km) in 20:00 (1200s)
        // T2 = 1200 * (10 / 5)^1.06 = 1200 * 2^1.06 ≈ 1200 * 2.0849 ≈ 2501.9s (~41:42)
        const t2 = calculateRiegelTime(5, 1200, 10);
        expect(t2).toBeCloseTo(2501.9, 1);
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
