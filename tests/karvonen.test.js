import {
  calculateMaxHR,
  calculateKarvonenHR,
  calculateAllZones,
  zones,
} from "../src/scripts/karvonen-calculator.js";

describe("karvonen calculator", () => {
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

      expect(result).toHaveLength(5);
      expect(result[0].name).toBe("Zone 1");
      expect(result[0].label).toBe("Recovery");
      expect(result[4].name).toBe("Zone 5");
      expect(result[4].label).toBe("VO2max");
    });

    it("calculates correct HR ranges for each zone", () => {
      const result = calculateAllZones(180, 60);
      // HRR = 180 - 60 = 120

      // Zone 1: 50-60% → (120 * 0.5) + 60 = 120, (120 * 0.6) + 60 = 132
      expect(result[0].hrMin).toBe(120);
      expect(result[0].hrMax).toBe(132);

      // Zone 3: 70-80% → (120 * 0.7) + 60 = 144, (120 * 0.8) + 60 = 156
      expect(result[2].hrMin).toBe(144);
      expect(result[2].hrMax).toBe(156);

      // Zone 5: 90-100% → (120 * 0.9) + 60 = 168, (120 * 1.0) + 60 = 180
      expect(result[4].hrMin).toBe(168);
      expect(result[4].hrMax).toBe(180);
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
