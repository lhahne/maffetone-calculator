import { describe, expect, it } from "bun:test";
import { Window } from "happy-dom";

describe("calculator UI", () => {
  it("updates the result when valid inputs are provided", async () => {
    const window = new Window();
    globalThis.window = window;
    globalThis.document = window.document;

    document.body.innerHTML = `
      <form id="calculator-form">
        <input id="age" name="age" />
        <label>
          <input type="radio" name="adjustment" value="0" checked />
        </label>
      </form>
      <div id="result" class="hidden"></div>
      <div id="result-range"></div>
      <div id="result-base"></div>
      <div id="result-note"></div>
    `;

    await import("../src/main.js");

    const ageInput = document.querySelector("#age");
    ageInput.value = "32";
    document
      .querySelector("#calculator-form")
      .dispatchEvent(new window.Event("input", { bubbles: true }));

    const result = document.querySelector("#result");
    const resultRange = document.querySelector("#result-range");
    const resultBase = document.querySelector("#result-base");

    expect(result.classList.contains("hidden")).toBe(false);
    expect(resultRange.textContent).toBe("138-148 bpm");
    expect(resultBase.textContent).toBe("148 bpm");
  });
});
