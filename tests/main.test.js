import { beforeEach, describe, expect, it } from "bun:test";
import { Window } from "happy-dom";

describe("calculator UI", () => {
  const loadMain = async () => {
    await import(`../src/main.js?cache-bust=${Date.now()}`);
  };

  beforeEach(() => {
    const window = new Window();
    globalThis.window = window;
    globalThis.document = window.document;

    document.body.innerHTML = `
      <form id="calculator-form">
        <input id="age" name="age" />
        <label>
          <input type="radio" name="adjustment" value="0" checked />
        </label>
        <label>
          <input type="radio" name="adjustment" value="-5" />
        </label>
      </form>
      <div id="result" class="hidden"></div>
      <div id="result-range"></div>
      <div id="result-base"></div>
      <div id="result-note"></div>
    `;
  });

  it("updates the result when valid inputs are provided", async () => {
    await loadMain();

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

  it("hides the result and shows a note for invalid ages", async () => {
    await loadMain();

    const ageInput = document.querySelector("#age");
    ageInput.value = "";
    document
      .querySelector("#calculator-form")
      .dispatchEvent(new window.Event("input", { bubbles: true }));

    const result = document.querySelector("#result");
    const resultNote = document.querySelector("#result-note");

    expect(result.classList.contains("hidden")).toBe(true);
    expect(resultNote.textContent).toBe("Enter a valid age to see your range.");
  });

  it("updates the adjustment note when the selection changes", async () => {
    await loadMain();

    const ageInput = document.querySelector("#age");
    ageInput.value = "40";
    document.querySelector("input[value='-5']").checked = true;
    document
      .querySelector("#calculator-form")
      .dispatchEvent(new window.Event("input", { bubbles: true }));

    const resultNote = document.querySelector("#result-note");
    const resultBase = document.querySelector("#result-base");

    expect(resultNote.textContent).toBe(
      "Adjustment: Recently injured, inconsistent training, or not improving",
    );
    expect(resultBase.textContent).toBe("135 bpm");
  });
});
