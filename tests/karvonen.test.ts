import { describe, expect, it, afterEach } from "bun:test";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { KarvonenCalculator } from "../src/components/calculators/KarvonenCalculator";
import {
  calculateMaxHR,
  calculateKarvonenHR,
  calculateAllZones,
  zones,
} from "../src/scripts/karvonen-calculator";
import React from "react";
import { Window } from "happy-dom";

const window = new Window();
globalThis.window = window as any;
globalThis.document = window.document as any;
globalThis.navigator = window.navigator as any;
globalThis.HTMLElement = window.HTMLElement as any;

describe("karvonen calculator logic", () => {
  describe("calculateMaxHR", () => {
    it("calculates max HR using 220 - age", () => {
      expect(calculateMaxHR(40)).toBe(180);
      expect(calculateMaxHR(30)).toBe(190);
      expect(calculateMaxHR(50)).toBe(170);
    });

    it("returns null for invalid ages", () => {
      expect(calculateMaxHR(-1)).toBeNull();
      expect(calculateMaxHR(0)).toBeNull();
      expect(calculateMaxHR(Number.NaN)).toBeNull();
    });
  });

  describe("calculateKarvonenHR", () => {
    it("calculates target HR for given intensity", () => {
      expect(calculateKarvonenHR(180, 60, 0.70)).toBe(144);
      expect(calculateKarvonenHR(180, 60, 0.50)).toBe(120);
      expect(calculateKarvonenHR(180, 60, 1.00)).toBe(180);
    });
  });

  describe("calculateAllZones", () => {
    it("returns all 5 zones with HR ranges", () => {
      const result = calculateAllZones(180, 60);
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveLength(5);
        expect(result[0].name).toBe("Zone 1");
      }
    });
  });
});

describe("karvonen calculator UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("calculates zones when age and resting HR are entered", () => {
    const { getByLabelText, getByText } = render(React.createElement(KarvonenCalculator));

    const ageInput = getByLabelText(/What is your current age\?/i) as HTMLInputElement;
    const restingHrInput = getByLabelText(/What is your resting heart rate\?/i) as HTMLInputElement;

    fireEvent.change(ageInput, { target: { value: "30" } });
    fireEvent.change(restingHrInput, { target: { value: "60" } });

    expect(getByText(/120-132 bpm/i)).toBeTruthy();
    expect(getByText(/Max HR: 190/i)).toBeTruthy();
  });

  it("uses custom max HR when enabled", () => {
    const { getByLabelText, getByText } = render(React.createElement(KarvonenCalculator));

    const useCustomMax = getByLabelText(/I know my maximum heart rate/i) as HTMLInputElement;
    fireEvent.click(useCustomMax);

    const maxHrInput = getByLabelText(/Maximum Heart Rate/i) as HTMLInputElement;
    fireEvent.change(maxHrInput, { target: { value: "200" } });

    const ageInput = getByLabelText(/What is your current age\?/i) as HTMLInputElement;
    const restingHrInput = getByLabelText(/What is your resting heart rate\?/i) as HTMLInputElement;
    fireEvent.change(ageInput, { target: { value: "30" } });
    fireEvent.change(restingHrInput, { target: { value: "60" } });

    expect(getByText(/Max HR: 200/i)).toBeTruthy();
  });
});
