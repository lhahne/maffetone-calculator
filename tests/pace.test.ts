import { describe, expect, it, afterEach } from "bun:test";
import { render, cleanup, act } from "@testing-library/react";
import { PaceCalculator } from "../src/components/calculators/PaceCalculator";
import { convertPaceToKm, convertPaceToMiles } from "../src/scripts/pace-calculator";
import React from "react";
import { Window } from "happy-dom";

const window = new Window();
globalThis.window = window as any;
globalThis.document = window.document as any;
globalThis.navigator = window.navigator as any;
globalThis.HTMLElement = window.HTMLElement as any;

describe("pace calculator logic", () => {
  it("converts min/mile to min/km correctly", () => {
    expect(convertPaceToKm(10, 0)).toEqual({ minutes: 6, seconds: 13 });
    expect(convertPaceToKm(6, 0)).toEqual({ minutes: 3, seconds: 44 });
    expect(convertPaceToKm(8, 30)).toEqual({ minutes: 5, seconds: 17 });
  });

  it("converts min/km to min/mile correctly", () => {
    expect(convertPaceToMiles(5, 0)).toEqual({ minutes: 8, seconds: 3 });
    expect(convertPaceToMiles(4, 0)).toEqual({ minutes: 6, seconds: 26 });
  });

  it("handles edge cases", () => {
    expect(convertPaceToKm(0, 0)).toEqual({ minutes: 0, seconds: 0 });
    expect(convertPaceToMiles(0, 0)).toEqual({ minutes: 0, seconds: 0 });
  });
});

describe("pace calculator UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders both pace input sections", () => {
    const { getByText } = render(React.createElement(PaceCalculator));

    expect(getByText(/Pace per Mile/i)).toBeTruthy();
    expect(getByText(/Pace per Kilometer/i)).toBeTruthy();
  });

  it("displays initial values correctly", () => {
    const { container } = render(React.createElement(PaceCalculator));

    // Check for the 4 input fields
    const inputs = container.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBe(4);

    // Default: 8:00 min/mile = 4:58 min/km
    expect((inputs[0] as HTMLInputElement).value).toBe("8");
    expect((inputs[1] as HTMLInputElement).value).toBe("00");
    expect((inputs[2] as HTMLInputElement).value).toBe("4");
    expect((inputs[3] as HTMLInputElement).value).toBe("58");
  });

  it("shows conversion math explanation", () => {
    const { container } = render(React.createElement(PaceCalculator));

    const pageText = container.textContent;
    expect(pageText).toContain("Conversion Math");
    expect(pageText).toContain("1.609");
  });

  it("has Minutes and Seconds labels for inputs", () => {
    const { container } = render(React.createElement(PaceCalculator));

    const pageText = container.textContent;
    expect(pageText).toContain("Minutes");
    expect(pageText).toContain("Seconds");
  });

  it("renders bidirectional conversion indicator", () => {
    const { container } = render(React.createElement(PaceCalculator));

    const pageText = container.textContent;
    // The component has a ⇄ symbol for bidirectional conversion
    expect(pageText).toContain("⇄");
  });
});
