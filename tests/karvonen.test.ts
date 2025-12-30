import { describe, expect, it, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import {
  calculateMaxHR,
  calculateKarvonenHR,
  calculateAllZones,
  zones,
} from "../src/scripts/karvonen-calculator";
import { setupKarvonenCalculator } from "../src/scripts/karvonen-ui";

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
      // ((180 - 60) * 0.70) + 60 = 84 + 60 = 144
      expect(calculateKarvonenHR(180, 60, 0.70)).toBe(144);

      // ((180 - 60) * 0.50) + 60 = 60 + 60 = 120
      expect(calculateKarvonenHR(180, 60, 0.50)).toBe(120);

      // ((180 - 60) * 1.00) + 60 = 120 + 60 = 180
      expect(calculateKarvonenHR(180, 60, 1.00)).toBe(180);
    });

    it("rounds to nearest integer", () => {
      // ((180 - 65) * 0.55) + 65 = 63.25 + 65 = 128.25 → 128
      expect(calculateKarvonenHR(180, 65, 0.55)).toBe(128);
    });
  });

  describe("calculateAllZones", () => {
    it("returns all 5 zones with HR ranges", () => {
      const result = calculateAllZones(180, 60);

      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveLength(5);
        expect(result[0].name).toBe("Zone 1");
        expect(result[0].label).toBe("Recovery");
        expect(result[4].name).toBe("Zone 5");
        expect(result[4].label).toBe("VO2max");
      }
    });

    it("calculates correct HR ranges for each zone", () => {
      const result = calculateAllZones(180, 60);
      // HRR = 180 - 60 = 120

      expect(result).not.toBeNull();
      if (result) {
        // Zone 1: 50-60% → (120 * 0.5) + 60 = 120, (120 * 0.6) + 60 = 132
        expect(result[0].hrMin).toBe(120);
        expect(result[0].hrMax).toBe(132);

        // Zone 3: 70-80% → (120 * 0.7) + 60 = 144, (120 * 0.8) + 60 = 156
        expect(result[2].hrMin).toBe(144);
        expect(result[2].hrMax).toBe(156);

        // Zone 5: 90-100% → (120 * 0.9) + 60 = 168, (120 * 1.0) + 60 = 180
        expect(result[4].hrMin).toBe(168);
        expect(result[4].hrMax).toBe(180);
      }
    });

    it("returns null for invalid inputs", () => {
      expect(calculateAllZones(Number.NaN, 60)).toBeNull();
      expect(calculateAllZones(180, Number.NaN)).toBeNull();
    });
  });

  describe("zones constant", () => {
    it("has 5 zones with correct structure", () => {
      expect(zones).toHaveLength(5);
      zones.forEach(zone => {
        expect(zone).toHaveProperty("name");
        expect(zone).toHaveProperty("label");
        expect(zone).toHaveProperty("min");
        expect(zone).toHaveProperty("max");
      });
    });

    it("has correct intensity ranges", () => {
      expect(zones[0].min).toBe(0.50);
      expect(zones[0].max).toBe(0.60);
      expect(zones[4].min).toBe(0.90);
      expect(zones[4].max).toBe(1.00);
    });
  });
});

describe("karvonen calculator UI", () => {
  let window: Window;

  beforeEach(() => {
    window = new Window();
    globalThis.window = window as any;
    globalThis.document = window.document as any;

    document.body.innerHTML = `
      <form id="karvonen-form">
        <input id="age" name="age" />
        <input id="resting-hr" name="resting-hr" />
        <input type="checkbox" id="use-custom-max" name="use-custom-max" />
        <div id="custom-max-container" class="hidden">
            <input id="max-hr" name="max-hr" />
        </div>
      </form>
      <div id="results-card">
        <div id="results-placeholder"></div>
        <div id="zones-container" class="hidden"></div>
      </div>
      <div id="max-hr-display" class="hidden">
        <span id="max-hr-value"></span>
        <span id="max-hr-source"></span>
      </div>
    `;
  });

  it("calculates zones when age and resting HR are entered", () => {
    setupKarvonenCalculator();

    const ageInput = document.querySelector("#age") as HTMLInputElement;
    const restingHrInput = document.querySelector("#resting-hr") as HTMLInputElement;

    ageInput.value = "30";
    restingHrInput.value = "60";

    ageInput.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    const zonesContainer = document.querySelector("#zones-container") as HTMLElement;
    const maxHrValue = document.querySelector("#max-hr-value") as HTMLElement;

    expect(zonesContainer.classList.contains("hidden")).toBe(false);
    expect(maxHrValue.textContent).toBe("190");
    expect(zonesContainer.innerHTML).toContain("Zone 1");
  });

  it("uses custom max HR when enabled", () => {
    setupKarvonenCalculator();

    const ageInput = document.querySelector("#age") as HTMLInputElement;
    const restingHrInput = document.querySelector("#resting-hr") as HTMLInputElement;
    const useCustomMax = document.querySelector("#use-custom-max") as HTMLInputElement;
    const maxHrInput = document.querySelector("#max-hr") as HTMLInputElement;

    ageInput.value = "30";
    restingHrInput.value = "60";
    useCustomMax.checked = true;
    maxHrInput.value = "200";

    useCustomMax.dispatchEvent(new window.Event("change", { bubbles: true }) as any);
    maxHrInput.dispatchEvent(new window.Event("input", { bubbles: true }) as any);

    const maxHrValue = document.querySelector("#max-hr-value") as HTMLElement;
    const maxHrSource = document.querySelector("#max-hr-source") as HTMLElement;

    expect(maxHrValue.textContent).toBe("200");
    expect(maxHrSource.textContent).toBe("(custom)");
  });
});
