import { describe, expect, it, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import { convertPaceToKm, convertPaceToMiles } from "../src/scripts/pace-calculator";
import { setupPaceCalculator } from "../src/scripts/pace-ui";

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
  let window: Window;

  beforeEach(() => {
    window = new Window();
    globalThis.window = window as any;
    globalThis.document = window.document as any;

    document.body.innerHTML = `
      <form id="pace-form">
        <input id="mile-min" value="10" />
        <input id="mile-sec" value="00" />
        <input id="km-min" value="0" />
        <input id="km-sec" value="00" />
      </form>
    `;
  });

  it("converts mile to km in UI", () => {
    setupPaceCalculator();

    const mileMin = document.querySelector("#mile-min") as HTMLInputElement;
    const kmMin = document.querySelector("#km-min") as HTMLInputElement;
    const kmSec = document.querySelector("#km-sec") as HTMLInputElement;

    mileMin.value = "8";
    mileMin.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    // 8 min/mile = 4:58 min/km
    expect(kmMin.value).toBe("4");
    expect(kmSec.value).toBe("58");
  });

  it("converts km to mile in UI", () => {
    setupPaceCalculator();

    const kmMin = document.querySelector("#km-min") as HTMLInputElement;
    const kmSec = document.querySelector("#km-sec") as HTMLInputElement;
    const mileMin = document.querySelector("#mile-min") as HTMLInputElement;
    const mileSec = document.querySelector("#mile-sec") as HTMLInputElement;

    kmMin.value = "5";
    kmMin.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    // 5 min/km = 8:03 min/mile
    expect(mileMin.value).toBe("8");
    expect(mileSec.value).toBe("03");
  });
});
