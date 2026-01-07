// HIIT Workout Generator

export interface HiitParameters {
  goal: 'fat-burn' | 'endurance' | 'power' | 'beginner';
  totalDuration: number; // in minutes
  workRestRatio?: string; // e.g., "2:1", "1:1", "1:2"
}

export interface HiitInterval {
  type: 'work' | 'rest' | 'warmup' | 'cooldown';
  duration: number; // in seconds
  intensity?: string;
}

export interface HiitWorkout {
  name: string;
  description: string;
  totalDuration: number; // in minutes
  intervals: HiitInterval[];
  recommendations: string[];
}

interface WorkoutPreset {
  name: string;
  description: string;
  workDuration: number; // in seconds
  restDuration: number;
  warmupDuration: number;
  cooldownDuration: number;
  intensity: string;
  recommendations: string[];
}

const WORKOUT_PRESETS: Record<HiitParameters['goal'], WorkoutPreset> = {
  'beginner': {
    name: 'Beginner HIIT',
    description: 'A gentle introduction to high-intensity interval training with longer rest periods',
    workDuration: 20,
    restDuration: 40,
    warmupDuration: 300, // 5 minutes
    cooldownDuration: 300, // 5 minutes
    intensity: '60-70% max effort',
    recommendations: [
      'Focus on learning proper form rather than speed',
      'Start with 2-3 sessions per week',
      'Gradually decrease rest time as fitness improves',
      'Stay well hydrated before, during, and after',
      'Listen to your body and take extra rest if needed',
    ],
  },
  'fat-burn': {
    name: 'Fat Burning HIIT',
    description: 'Optimized for maximum calorie burn and fat oxidation',
    workDuration: 30,
    restDuration: 30,
    warmupDuration: 300, // 5 minutes
    cooldownDuration: 180, // 3 minutes
    intensity: '75-85% max effort',
    recommendations: [
      'Perform on an empty stomach or 2-3 hours after eating',
      'Maintain intensity in the "uncomfortable but sustainable" zone',
      'Combine with strength training 2x per week',
      'Ensure 48 hours recovery between HIIT sessions',
      'Monitor heart rate to stay in fat-burning zone',
    ],
  },
  'endurance': {
    name: 'Endurance HIIT',
    description: 'Build cardiovascular endurance with longer work intervals',
    workDuration: 60,
    restDuration: 30,
    warmupDuration: 300, // 5 minutes
    cooldownDuration: 300, // 5 minutes
    intensity: '70-80% max effort',
    recommendations: [
      'Pace yourself to maintain consistent intensity',
      'Focus on breathing rhythm during work intervals',
      'Perform 2-3 sessions per week for best results',
      'Complement with long, slow distance training',
      'Track progress by monitoring heart rate recovery',
    ],
  },
  'power': {
    name: 'Power & Speed HIIT',
    description: 'Maximum intensity bursts for explosive power development',
    workDuration: 20,
    restDuration: 60,
    warmupDuration: 420, // 7 minutes
    cooldownDuration: 300, // 5 minutes
    intensity: '90-100% max effort',
    recommendations: [
      'Go all-out during work intervals - maximum effort',
      'Use the full rest period for complete recovery',
      'Limit to 1-2 sessions per week due to intensity',
      'Requires solid fitness base - not for beginners',
      'Perfect for athletes training for explosive sports',
    ],
  },
};

export function generateHiitWorkout(params: HiitParameters): HiitWorkout | null {
  const { goal, totalDuration } = params;

  if (!goal || totalDuration <= 0 || totalDuration > 60) {
    return null;
  }

  const preset = WORKOUT_PRESETS[goal];
  const totalSeconds = totalDuration * 60;

  // Handle custom work/rest ratio if provided
  let workDuration = preset.workDuration;
  let restDuration = preset.restDuration;

  if (params.workRestRatio) {
    const [work, rest] = params.workRestRatio.split(':').map(Number);
    if (work > 0 && rest > 0) {
      // Calculate durations based on ratio and goal
      const baseUnit = goal === 'endurance' || goal === 'fat-burn' ? 30 : 20;
      workDuration = baseUnit * work;
      restDuration = baseUnit * rest;
    }
  }

  const warmupDuration = preset.warmupDuration;
  const cooldownDuration = preset.cooldownDuration;

  // Calculate available time for intervals
  const intervalTime = totalSeconds - warmupDuration - cooldownDuration;

  if (intervalTime <= 0) {
    return null;
  }

  // Calculate number of complete intervals
  const intervalCycle = workDuration + restDuration;
  const numIntervals = Math.floor(intervalTime / intervalCycle);

  if (numIntervals < 1) {
    return null;
  }

  // Build the workout
  const intervals: HiitInterval[] = [];

  // Warmup
  intervals.push({
    type: 'warmup',
    duration: warmupDuration,
    intensity: 'Easy pace - prepare your body',
  });

  // Work/Rest intervals
  for (let i = 0; i < numIntervals; i++) {
    intervals.push({
      type: 'work',
      duration: workDuration,
      intensity: preset.intensity,
    });

    // Don't add rest after the last work interval
    if (i < numIntervals - 1) {
      intervals.push({
        type: 'rest',
        duration: restDuration,
        intensity: 'Active recovery or complete rest',
      });
    }
  }

  // Cooldown
  intervals.push({
    type: 'cooldown',
    duration: cooldownDuration,
    intensity: 'Easy pace - bring heart rate down',
  });

  // Calculate actual total duration
  const actualDuration = intervals.reduce((sum, interval) => sum + interval.duration, 0) / 60;

  return {
    name: preset.name,
    description: preset.description,
    totalDuration: actualDuration,
    intervals,
    recommendations: preset.recommendations,
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs}s`;
}

export function getWorkoutStats(workout: HiitWorkout): {
  totalWork: number;
  totalRest: number;
  intervals: number;
  ratio: string;
} {
  const workIntervals = workout.intervals.filter(i => i.type === 'work');
  const restIntervals = workout.intervals.filter(i => i.type === 'rest');

  const totalWork = workIntervals.reduce((sum, i) => sum + i.duration, 0);
  const totalRest = restIntervals.reduce((sum, i) => sum + i.duration, 0);

  const avgWork = totalWork / (workIntervals.length || 1);
  const avgRest = totalRest / (restIntervals.length || 1);

  const gcd = (a: number, b: number): number => {
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    return absB === 0 ? absA : gcd(absB, absA % absB);
  };
  const roundedWork = Math.round(avgWork);
  const roundedRest = Math.round(avgRest);
  
  // Handle edge cases where avgRest might be 0
  let workRatio = 1;
  let restRatio = 1;
  
  if (roundedWork > 0 && roundedRest > 0) {
    const divisor = gcd(roundedWork, roundedRest);
    workRatio = roundedWork / divisor;
    restRatio = roundedRest / divisor;
  } else if (roundedWork > 0) {
    // Only work intervals exist
    workRatio = 1;
    restRatio = 0;
  }

  return {
    totalWork: Math.round(totalWork),
    totalRest: Math.round(totalRest),
    intervals: workIntervals.length,
    ratio: `${workRatio}:${restRatio}`,
  };
}
