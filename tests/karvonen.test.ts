import { describe, expect, it, afterEach } from "bun:test";
import { render, cleanup, act } from "@testing-library/react";
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

  it("displays zones with default values", () => {
    const { container } = render(React.createElement(KarvonenCalculator));

    const pageText = container.textContent;
    // Default: age=30, resting=60, Max HR = 190
    expect(pageText).toContain("Zone 1");
    expect(pageText).toContain("Max HR:");
    expect(pageText).toContain("190");
    expect(pageText).toContain("220 - age");
  });

  it("renders all input fields", () => {
    const { container } = render(React.createElement(KarvonenCalculator));

    const ageInput = container.querySelector('#age') as HTMLInputElement;
    const restingHrInput = container.querySelector('#resting-hr') as HTMLInputElement;
    const customMaxCheckbox = container.querySelector('#use-custom-max') as HTMLInputElement;

    expect(ageInput).toBeTruthy();
    expect(ageInput.value).toBe("30");
    expect(restingHrInput).toBeTruthy();
    expect(restingHrInput.value).toBe("60");
    expect(customMaxCheckbox).toBeTruthy();
    expect(customMaxCheckbox.checked).toBe(false);
  });

  it("shows custom max HR input when checkbox is clicked", async () => {
    const { container } = render(React.createElement(KarvonenCalculator));

    // Initially, the max HR input should not be visible
    let maxHrInput = container.querySelector('#max-hr-input');
    expect(maxHrInput).toBeFalsy();

    // Click the checkbox to enable custom max HR
    const useCustomMax = container.querySelector('#use-custom-max') as HTMLInputElement;

    await act(async () => {
      useCustomMax.click();
    });

    // Now the max HR input should be visible
    maxHrInput = container.querySelector('#max-hr-input');
    expect(maxHrInput).toBeTruthy();
    expect((maxHrInput as HTMLInputElement).value).toBe("190");
  });

  it("displays all 5 heart rate zones", () => {
    const { container } = render(React.createElement(KarvonenCalculator));

    const pageText = container.textContent;
    expect(pageText).toContain("Zone 1");
    expect(pageText).toContain("Zone 2");
    expect(pageText).toContain("Zone 3");
    expect(pageText).toContain("Zone 4");
    expect(pageText).toContain("Zone 5");
    expect(pageText).toContain("Recovery");
    expect(pageText).toContain("VO2max");
  });
});
