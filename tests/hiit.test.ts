import { describe, it, expect, afterEach } from "bun:test";
import { render, cleanup } from "@testing-library/react";
import { HiitCalculator } from "../src/components/calculators/HiitCalculator";
import {
  generateHiitWorkout,
  formatTime,
  getWorkoutStats,
  type HiitParameters,
} from "../src/scripts/hiit-calculator";
import React from "react";
import "./setup";

describe("HIIT Calculator Logic", () => {
  describe("generateHiitWorkout", () => {
    it("generates a beginner workout with correct structure", () => {
      const params: HiitParameters = {
        goal: 'beginner',
        totalDuration: 20,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        expect(workout.name).toBe("Beginner HIIT");
        expect(workout.intervals.length).toBeGreaterThan(0);
        expect(workout.intervals[0].type).toBe("warmup");
        expect(workout.intervals[workout.intervals.length - 1].type).toBe("cooldown");
        expect(workout.recommendations.length).toBeGreaterThan(0);
      }
    });

    it("generates a fat-burn workout", () => {
      const params: HiitParameters = {
        goal: 'fat-burn',
        totalDuration: 20,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        expect(workout.name).toBe("Fat Burning HIIT");
        expect(workout.totalDuration).toBeGreaterThan(0);
      }
    });

    it("generates an endurance workout", () => {
      const params: HiitParameters = {
        goal: 'endurance',
        totalDuration: 30,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        expect(workout.name).toBe("Endurance HIIT");
      }
    });

    it("generates a power workout", () => {
      const params: HiitParameters = {
        goal: 'power',
        totalDuration: 25,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        expect(workout.name).toBe("Power & Speed HIIT");
      }
    });

    it("returns null for invalid duration", () => {
      const params: HiitParameters = {
        goal: 'fat-burn',
        totalDuration: 0,
      };
      const workout = generateHiitWorkout(params);
      expect(workout).toBeNull();
    });

    it("returns null for duration too high", () => {
      const params: HiitParameters = {
        goal: 'fat-burn',
        totalDuration: 100,
      };
      const workout = generateHiitWorkout(params);
      expect(workout).toBeNull();
    });

    it("includes work and rest intervals", () => {
      const params: HiitParameters = {
        goal: 'fat-burn',
        totalDuration: 20,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        const workIntervals = workout.intervals.filter(i => i.type === 'work');
        const restIntervals = workout.intervals.filter(i => i.type === 'rest');
        expect(workIntervals.length).toBeGreaterThan(0);
        expect(restIntervals.length).toBeGreaterThan(0);
      }
    });

    it("respects custom work/rest ratio", () => {
      const params: HiitParameters = {
        goal: 'fat-burn',
        totalDuration: 20,
        workRestRatio: '2:1',
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        const workIntervals = workout.intervals.filter(i => i.type === 'work');
        const restIntervals = workout.intervals.filter(i => i.type === 'rest');
        
        if (workIntervals.length > 0 && restIntervals.length > 0) {
          const avgWork = workIntervals.reduce((sum, i) => sum + i.duration, 0) / (workIntervals.length || 1);
          const avgRest = restIntervals.reduce((sum, i) => sum + i.duration, 0) / (restIntervals.length || 1);
          
          // Check ratio is approximately 2:1
          const ratio = avgWork / avgRest;
          expect(ratio).toBeGreaterThan(1.5);
          expect(ratio).toBeLessThan(2.5);
        }
      }
    });
  });

  describe("formatTime", () => {
    it("formats seconds only", () => {
      expect(formatTime(45)).toBe("45s");
      expect(formatTime(30)).toBe("30s");
    });

    it("formats minutes only", () => {
      expect(formatTime(60)).toBe("1m");
      expect(formatTime(120)).toBe("2m");
      expect(formatTime(300)).toBe("5m");
    });

    it("formats minutes and seconds", () => {
      expect(formatTime(90)).toBe("1m 30s");
      expect(formatTime(125)).toBe("2m 5s");
    });
  });

  describe("getWorkoutStats", () => {
    it("calculates workout statistics correctly", () => {
      const params: HiitParameters = {
        goal: 'fat-burn',
        totalDuration: 20,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        const stats = getWorkoutStats(workout);
        
        expect(stats.intervals).toBeGreaterThan(0);
        expect(stats.totalWork).toBeGreaterThan(0);
        expect(stats.totalRest).toBeGreaterThan(0);
        expect(stats.ratio).toBeTruthy();
        expect(stats.ratio).toMatch(/^\d+:\d+$/);
      }
    });

    it("calculates correct interval count", () => {
      const params: HiitParameters = {
        goal: 'beginner',
        totalDuration: 15,
      };
      const workout = generateHiitWorkout(params);
      
      expect(workout).not.toBeNull();
      if (workout) {
        const stats = getWorkoutStats(workout);
        const workIntervals = workout.intervals.filter(i => i.type === 'work');
        
        expect(stats.intervals).toBe(workIntervals.length);
      }
    });
  });
});

describe("HIIT Calculator UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    const { container } = render(React.createElement(HiitCalculator));
    expect(container).toBeTruthy();
  });

  it("displays all goal options", () => {
    const { container } = render(React.createElement(HiitCalculator));
    
    const pageText = container.textContent;
    expect(pageText).toContain("New to HIIT");
    expect(pageText).toContain("Fat Burning");
    expect(pageText).toContain("Endurance");
    expect(pageText).toContain("Power & Speed");
  });

  it("has duration input field", () => {
    const { container } = render(React.createElement(HiitCalculator));
    
    const durationInput = container.querySelector('#total-duration') as HTMLInputElement;
    expect(durationInput).toBeTruthy();
    expect(durationInput.value).toBe("20");
  });

  it("displays workout after selecting goal", () => {
    const { container } = render(React.createElement(HiitCalculator));
    
    const pageText = container.textContent;
    // Default goal is 'fat-burn', so we should see the Fat Burning HIIT workout
    expect(pageText).toContain("Fat Burning HIIT");
    expect(pageText).toContain("Your HIIT Workout");
  });

  it("shows custom ratio checkbox", () => {
    const { container } = render(React.createElement(HiitCalculator));
    
    const checkbox = container.querySelector('#use-custom-ratio') as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(false);
  });

  it("displays workout timeline", () => {
    const { container } = render(React.createElement(HiitCalculator));
    
    const pageText = container.textContent;
    expect(pageText).toContain("Workout Timeline");
  });

  it("displays recommendations", () => {
    const { container } = render(React.createElement(HiitCalculator));
    
    const pageText = container.textContent;
    expect(pageText).toContain("Recommendations");
  });
});
