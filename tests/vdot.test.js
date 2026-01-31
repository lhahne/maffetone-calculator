import { describe, expect, it } from "bun:test";
import {
  calculateVDOT,
  calculateTrainingPaces,
  calculateRacePredictions,
  vo2ToVelocity,
  velocityToPace,
  formatPace,
  secondsToMMSS,
  secondsToHHMMSS,
  hmsToSeconds
} from "../src/scripts/vdot-calculator.js";

describe("VDOT calculator", () => {
  it("calculates VDOT from race performance", () => {
    const vdot = calculateVDOT(10000, 45);
    expect(vdot).toBeCloseTo(45.3, 1);
  });

  it("calculates VDOT for 5K race", () => {
    const vdot = calculateVDOT(5000, 22.5);
    expect(vdot).toBeCloseTo(43.4, 1);
  });

  it("returns null for invalid inputs", () => {
    expect(calculateVDOT(0, 45)).toBeNull();
    expect(calculateVDOT(10000, 0)).toBeNull();
    expect(calculateVDOT(-10000, 45)).toBeNull();
    expect(calculateVDOT(10000, -45)).toBeNull();
  });
});

describe("VO2 to velocity conversion", () => {
  it("converts VO2 to velocity", () => {
    const velocity = vo2ToVelocity(50);
    expect(velocity).toBeGreaterThan(200);
  });

  it("returns null for negative VO2", () => {
    expect(vo2ToVelocity(-10)).toBeNull();
  });
});

describe("Velocity to pace conversion", () => {
  it("converts velocity to pace per km", () => {
    const pace = velocityToPace(250, "km");
    expect(pace).not.toBeNull();
    expect(pace.min).toBe(4);
    expect(pace.sec).toBe(0);
  });

  it("converts velocity to pace per mile", () => {
    const pace = velocityToPace(160.9344, "mile");
    expect(pace).not.toBeNull();
    expect(pace.min).toBe(10);
    expect(pace.sec).toBe(0);
  });

  it("returns null for invalid velocity", () => {
    expect(velocityToPace(0, "km")).toBeNull();
    expect(velocityToPace(-100, "km")).toBeNull();
  });
});

describe("Training paces", () => {
  it("calculates training paces for a VDOT score", () => {
    const paces = calculateTrainingPaces(50, "km");
    expect(paces).not.toBeNull();
    expect(paces.easy).toBeDefined();
    expect(paces.marathon).toBeDefined();
    expect(paces.threshold).toBeDefined();
    expect(paces.interval).toBeDefined();
    expect(paces.repetition).toBeDefined();
  });

  it("returns null for invalid VDOT", () => {
    expect(calculateTrainingPaces(0, "km")).toBeNull();
    expect(calculateTrainingPaces(-10, "km")).toBeNull();
  });

  it("training paces are in correct order (fastest to slowest)", () => {
    const paces = calculateTrainingPaces(50, "km");
    const easyPaceMin = paces.easy.minPace;
    const repetitionPaceMin = paces.repetition.minPace;
    expect(easyPaceMin).not.toBe(repetitionPaceMin);
  });
});

describe("Race predictions", () => {
  it("calculates race predictions for a VDOT score", () => {
    const predictions = calculateRacePredictions(50);
    expect(predictions).not.toBeNull();
    expect(predictions["5k"]).toBeDefined();
    expect(predictions["10k"]).toBeDefined();
    expect(predictions["half"]).toBeDefined();
    expect(predictions["marathon"]).toBeDefined();
  });

  it("returns null for invalid VDOT", () => {
    expect(calculateRacePredictions(0)).toBeNull();
    expect(calculateRacePredictions(-10)).toBeNull();
  });

  it("predicted times increase with distance", () => {
    const predictions = calculateRacePredictions(50);
    const fiveKTime = predictions["5k"].timeSeconds;
    const tenKTime = predictions["10k"].timeSeconds;
    expect(tenKTime).toBeGreaterThan(fiveKTime);
  });
});

describe("Utility functions", () => {
  it("formats pace correctly", () => {
    expect(formatPace(5, 30)).toBe("5:30");
    expect(formatPace(4, 5)).toBe("4:05");
  });

  it("converts seconds to MM:SS format", () => {
    expect(secondsToMMSS(330)).toBe("5:30");
    expect(secondsToMMSS(245)).toBe("4:05");
    expect(secondsToMMSS(null)).toBe("--:--");
  });

  it("converts seconds to HH:MM:SS format", () => {
    expect(secondsToHHMMSS(330)).toBe("5:30");
    expect(secondsToHHMMSS(3665)).toBe("1:01:05");
    expect(secondsToHHMMSS(null)).toBe("--:--:--");
  });

  it("converts HH:MM:SS to seconds", () => {
    expect(hmsToSeconds(1, 5, 30)).toBe(3930);
    expect(hmsToSeconds(0, 5, 30)).toBe(330);
    expect(hmsToSeconds("0", "5", "30")).toBe(330);
  });
});
