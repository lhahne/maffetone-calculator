import { describe, expect, it } from "bun:test";
import {
  calculateMaffetoneBase,
  calculateMaffetoneRange,
  formatRange,
} from "../src/scripts/calculator";

describe("calculator helpers", () => {
  it("returns null for invalid ages", () => {
    expect(calculateMaffetoneBase(-1, 0)).toBeNull();
    expect(calculateMaffetoneBase(0, 0)).toBeNull();
    expect(calculateMaffetoneBase(Number.NaN, 0)).toBeNull();
  });

  it("calculates the base Maffetone heart rate", () => {
    expect(calculateMaffetoneBase(40, 0)).toBe(140);
    expect(calculateMaffetoneBase(35, -5)).toBe(140);
    expect(calculateMaffetoneBase(50, 5)).toBe(135);
  });

  it("returns the training range", () => {
    expect(calculateMaffetoneRange(30, 0)).toEqual({
      base: 150,
      low: 140,
      high: 150,
    });
  });

  it("formats the range for display", () => {
    const range = { base: 150, low: 140.2, high: 150.4 };
    expect(formatRange(range)).toBe("140-150 bpm");
  });
});
