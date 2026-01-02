import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';

interface Exercise {
    name: string;
    duration: number; // in seconds
    isRest: boolean;
}

export const ExerciseTimer: React.FC = () => {
    const exercises: Exercise[] = [
        { name: 'Goblet Squats', duration: 40, isRest: false },
        { name: 'Rest', duration: 20, isRest: true },
        { name: 'Push-ups', duration: 40, isRest: false },
        { name: 'Rest', duration: 20, isRest: true },
        { name: 'Kettlebell Deadlifts', duration: 40, isRest: false },
        { name: 'Rest', duration: 20, isRest: true },
        { name: 'Dead Hang', duration: 40, isRest: false },
        { name: 'Rest', duration: 20, isRest: true },
        { name: 'Plank', duration: 40, isRest: false },
        { name: 'Rest', duration: 20, isRest: true },
    ];

    const totalRounds = 2;

    const [currentRound, setCurrentRound] = useState(1);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(exercises[0].duration);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const currentExercise = exercises[currentExerciseIndex];
    const nextExerciseIndex = currentExerciseIndex + 1;
    const nextExercise = nextExerciseIndex < exercises.length ? exercises[nextExerciseIndex] : null;

    useEffect(() => {
        if (isRunning && !isComplete) {
            intervalRef.current = window.setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        // Move to next exercise
                        const nextIndex = currentExerciseIndex + 1;

                        if (nextIndex >= exercises.length) {
                            // Completed a round
                            if (currentRound >= totalRounds) {
                                // Workout complete
                                setIsComplete(true);
                                setIsRunning(false);
                                return 0;
                            } else {
                                // Start next round
                                setCurrentRound(currentRound + 1);
                                setCurrentExerciseIndex(0);
                                return exercises[0].duration;
                            }
                        } else {
                            setCurrentExerciseIndex(nextIndex);
                            return exercises[nextIndex].duration;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, currentExerciseIndex, currentRound, isComplete, exercises]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsComplete(false);
        setCurrentRound(1);
        setCurrentExerciseIndex(0);
        setTimeRemaining(exercises[0].duration);
    };

    const getTotalTime = () => {
        const timePerRound = exercises.reduce((acc, ex) => acc + ex.duration, 0);
        return (timePerRound * totalRounds) / 60;
    };

    const getProgress = () => {
        const totalExercises = exercises.length * totalRounds;
        const completedExercises = (currentRound - 1) * exercises.length + currentExerciseIndex;
        const currentProgress = (exercises[currentExerciseIndex].duration - timeRemaining) / exercises[currentExerciseIndex].duration;
        return ((completedExercises + currentProgress) / totalExercises) * 100;
    };

    return (
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-14 pt-24">
            <header className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                    STRENGTH TRAINING
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                    10-Minute Strength Routine
                </h1>
                <p className="max-w-2xl text-lg text-slate-300">
                    A quick and effective strength routine. Complete this workout 2x per week for optimal results.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Timer Display */}
                <Card>
                    <div className="space-y-6">
                        {/* Round Indicator */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Round {currentRound} of {totalRounds}
                            </span>
                            <span className="text-sm font-medium text-sky-400">
                                {getTotalTime()} min total
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgress()}%` }}
                            />
                        </div>

                        {/* Current Exercise */}
                        <div className="text-center py-8">
                            {isComplete ? (
                                <div className="space-y-4">
                                    <div className="text-6xl">🎉</div>
                                    <h2 className="text-3xl font-bold text-white">
                                        Workout Complete!
                                    </h2>
                                    <p className="text-slate-400">Great job! See you next session.</p>
                                </div>
                            ) : (
                                <>
                                    <div className={`text-sm font-semibold uppercase tracking-wide mb-2 ${currentExercise.isRest ? 'text-yellow-400' : 'text-sky-400'}`}>
                                        {currentExercise.isRest ? 'Rest' : 'Exercise'}
                                    </div>
                                    <h2 className="text-5xl font-bold text-white mb-6">
                                        {currentExercise.name}
                                    </h2>
                                    <div className={`text-8xl font-bold mb-4 ${timeRemaining <= 5 && !currentExercise.isRest ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                        {timeRemaining}
                                    </div>
                                    <div className="text-sm text-slate-400">seconds</div>
                                </>
                            )}
                        </div>

                        {/* Next Exercise Preview */}
                        {!isComplete && nextExercise && (
                            <div className="border-t border-slate-700 pt-4">
                                <p className="text-sm text-slate-400 mb-1">Up next:</p>
                                <p className="text-lg font-medium text-white">
                                    {nextExercise.name}
                                </p>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex gap-3 pt-4">
                            {!isRunning && !isComplete && (
                                <button
                                    onClick={handleStart}
                                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                                >
                                    {currentRound === 1 && currentExerciseIndex === 0 && timeRemaining === exercises[0].duration ? 'Start' : 'Resume'}
                                </button>
                            )}
                            {isRunning && (
                                <button
                                    onClick={handlePause}
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                                >
                                    Pause
                                </button>
                            )}
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Workout Info */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-4">Exercise List</h3>
                        <div className="space-y-3">
                            {exercises.filter(ex => !ex.isRest).map((exercise, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg transition ${
                                        currentExercise === exercise && !isComplete
                                            ? 'bg-sky-900/50 border border-sky-500'
                                            : 'bg-slate-800/50'
                                    }`}
                                >
                                    <span className="font-medium text-white">{exercise.name}</span>
                                    <span className="text-sm text-slate-400">{exercise.duration}s</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-4">Workout Details</h3>
                        <div className="space-y-3 text-slate-300">
                            <div className="flex justify-between">
                                <span>Work Interval:</span>
                                <span className="font-semibold text-white">40 seconds</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rest Interval:</span>
                                <span className="font-semibold text-white">20 seconds</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rounds:</span>
                                <span className="font-semibold text-white">2</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frequency:</span>
                                <span className="font-semibold text-white">2x per week</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-700 pt-3">
                                <span>Total Time:</span>
                                <span className="font-semibold text-sky-400">{getTotalTime()} minutes</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-semibold text-white mb-3">Tips</h3>
                        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                            <li>Focus on proper form over speed</li>
                            <li>Use challenging but manageable weights</li>
                            <li>Keep rest periods active (light movement)</li>
                            <li>Stay hydrated throughout the workout</li>
                            <li>Schedule 48-72 hours between sessions</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </main>
    );
};
