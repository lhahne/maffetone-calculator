import { describe, expect, it, afterEach } from "bun:test";
import { render, cleanup, act } from "@testing-library/react";
import { MaffetoneCalculator } from "../src/components/calculators/MaffetoneCalculator";
import React from "react";
import { Window } from "happy-dom";

const window = new Window();
globalThis.window = window as any;
globalThis.document = window.document as any;
globalThis.navigator = window.navigator as any;
globalThis.HTMLElement = window.HTMLElement as any;

// Helper to properly set input values and trigger React's onChange
function setInputValue(input: HTMLInputElement, value: string) {
  // Get the native value setter from HTMLInputElement prototype
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    (window as any).HTMLInputElement.prototype,
    'value'
  )?.set;

  // If we have the native setter, use it to properly set the value
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    // Fallback: directly set value
    input.value = value;
  }

  // Dispatch both input and change events for maximum compatibility
  input.dispatchEvent(new (window as any).InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  input.dispatchEvent(new (window as any).Event('change', { bubbles: true }));
}

describe("Maffetone Calculator UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("displays result with default age", () => {
    const { container } = render(React.createElement(MaffetoneCalculator));

    const pageText = container.textContent;
    // Default age is 39 with 0 adjustment: base = 180 - 39 = 141, range = 131-141 bpm
    expect(pageText).toContain("131-141 bpm");
    expect(pageText).toContain("141 bpm");
  });

  it("renders age input that can be changed", async () => {
    const { container } = render(React.createElement(MaffetoneCalculator));

    const ageInput = container.querySelector('#age') as HTMLInputElement;
    expect(ageInput).toBeTruthy();
    expect(ageInput.value).toBe("39"); // Default age

    await act(async () => {
      setInputValue(ageInput, "30");
    });

    // The input value should have changed
    expect(ageInput.value).toBe("30");
  });

  it("applies adjustments when radio is clicked", async () => {
    const { container } = render(React.createElement(MaffetoneCalculator));

    // Find the +5 adjustment radio button by value
    const adjustmentRadio = container.querySelector('input[value="5"]') as HTMLInputElement;
    expect(adjustmentRadio).toBeTruthy();

    await act(async () => {
      adjustmentRadio.click();
    });

    // Check that the radio was selected
    expect(adjustmentRadio.checked).toBe(true);

    // The adjustment text should be visible in the result section
    const pageText = container.textContent;
    expect(pageText).toContain("Training for 2+ years without injury and improving");
  });

  it("shows form elements for user input", () => {
    const { container, getByText } = render(React.createElement(MaffetoneCalculator));

    // Verify all form elements are rendered
    expect(getByText(/What is your current age\?/i)).toBeTruthy();
    expect(getByText(/Which statement best describes your training status\?/i)).toBeTruthy();
    expect(getByText(/Your target range/i)).toBeTruthy();

    // Check that adjustment options are available
    expect(container.querySelector('input[value="-10"]')).toBeTruthy();
    expect(container.querySelector('input[value="-5"]')).toBeTruthy();
    expect(container.querySelector('input[value="0"]')).toBeTruthy();
    expect(container.querySelector('input[value="5"]')).toBeTruthy();
  });
});
