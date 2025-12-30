import { describe, expect, it } from "bun:test";
import { convertPaceToKm, convertPaceToMiles } from "../src/scripts/pace-calculator";

describe("pace calculator", () => {
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
