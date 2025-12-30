import { describe, expect, it, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import { setupMaffetoneCalculator } from "../src/scripts/maffetone-ui";

describe("Maffetone Calculator UI", () => {
  let window: Window;

  beforeEach(() => {
    window = new Window();
    globalThis.window = window as any;
    globalThis.document = window.document as any;

    document.body.innerHTML = `
      <form id="calculator-form">
        <input id="age" name="age" />
        <label><input type="radio" name="adjustment" value="-10" /></label>
        <label><input type="radio" name="adjustment" value="-5" /></label>
        <label><input type="radio" name="adjustment" value="0" checked /></label>
        <label><input type="radio" name="adjustment" value="5" /></label>
      </form>
      <div id="result" class="hidden">
        <div id="result-range"></div>
        <div id="result-base"></div>
      </div>
      <div id="result-note"></div>
    `;
  });

  it("updates the result when age is entered", async () => {
    setupMaffetoneCalculator();

    const ageInput = document.querySelector("#age") as HTMLInputElement;
    ageInput.value = "30";
    ageInput.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    const resultRange = document.querySelector("#result-range") as HTMLElement;
    const resultBase = document.querySelector("#result-base") as HTMLElement;

    expect(resultRange.textContent).toBe("140-150 bpm");
    expect(resultBase.textContent).toBe("150 bpm");
  });

  it("applies adjustments correctly", async () => {
    setupMaffetoneCalculator();

    const ageInput = document.querySelector("#age") as HTMLInputElement;
    ageInput.value = "30";

    const adjustmentRadio = document.querySelector("input[value='5']") as HTMLInputElement;
    adjustmentRadio.checked = true;

    document.querySelector("#calculator-form")?.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    const resultRange = document.querySelector("#result-range") as HTMLElement;
    expect(resultRange.textContent).toBe("145-155 bpm");
  });

  it("handles invalid age", async () => {
    setupMaffetoneCalculator();

    const ageInput = document.querySelector("#age") as HTMLInputElement;
    ageInput.value = "0";
    ageInput.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    const result = document.querySelector("#result") as HTMLElement;
    const resultNote = document.querySelector("#result-note") as HTMLElement;

    expect(result.classList.contains("hidden")).toBe(true);
    expect(resultNote.textContent).toBe("Enter a valid age to see your range.");
  });
});
