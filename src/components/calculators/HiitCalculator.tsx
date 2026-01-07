import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Radio } from '../ui/Radio';
import { Checkbox } from '../ui/Checkbox';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import {
    generateHiitWorkout,
    formatTime,
    getWorkoutStats,
    type HiitWorkout,
    type HiitParameters,
} from '../../scripts/hiit-calculator';

export const HiitCalculator: React.FC = () => {
    const [goal, setGoal] = useState<HiitParameters['goal']>('fat-burn');
    const [totalDuration, setTotalDuration] = useState<string>('20');
    const [useCustomRatio, setUseCustomRatio] = useState<boolean>(false);
    const [workRestRatio, setWorkRestRatio] = useState<string>('1:1');
    const [workout, setWorkout] = useState<HiitWorkout | null>(null);

    useEffect(() => {
        const duration = parseInt(totalDuration, 10);

        if (!isNaN(duration) && duration > 0) {
            const params: HiitParameters = {
                goal,
                totalDuration: duration,
                workRestRatio: useCustomRatio ? workRestRatio : undefined,
            };

            const generatedWorkout = generateHiitWorkout(params);
            setWorkout(generatedWorkout);
        } else {
            setWorkout(null);
        }
    }, [goal, totalDuration, useCustomRatio, workRestRatio]);

    const form = (
        <Card variant="glass" className="space-y-8">
            <div className="space-y-4">
                <label className="text-lg font-semibold text-white">
                    What's your primary goal?
                </label>
                <div className="space-y-3">
                    <Radio
                        id="goal-beginner"
                        name="goal"
                        value="beginner"
                        checked={goal === 'beginner'}
                        onChange={(e) => setGoal(e.target.value as HiitParameters['goal'])}
                        label="New to HIIT - Build foundation and learn proper form"
                    />
                    <Radio
                        id="goal-fat-burn"
                        name="goal"
                        value="fat-burn"
                        checked={goal === 'fat-burn'}
                        onChange={(e) => setGoal(e.target.value as HiitParameters['goal'])}
                        label="Fat Burning - Maximize calorie burn and fat oxidation"
                    />
                    <Radio
                        id="goal-endurance"
                        name="goal"
                        value="endurance"
                        checked={goal === 'endurance'}
                        onChange={(e) => setGoal(e.target.value as HiitParameters['goal'])}
                        label="Endurance - Build cardiovascular stamina"
                    />
                    <Radio
                        id="goal-power"
                        name="goal"
                        value="power"
                        checked={goal === 'power'}
                        onChange={(e) => setGoal(e.target.value as HiitParameters['goal'])}
                        label="Power & Speed - Explosive performance (advanced)"
                    />
                </div>
            </div>

            <Input
                id="total-duration"
                label="How much time do you have?"
                type="number"
                inputMode="numeric"
                min="10"
                max="60"
                value={totalDuration}
                onChange={(e) => setTotalDuration(e.target.value)}
                unit="minutes"
                required
            />

            <div className="space-y-4 pt-2">
                <Checkbox
                    id="use-custom-ratio"
                    label="Customize work/rest ratio"
                    checked={useCustomRatio}
                    onChange={(e) => setUseCustomRatio(e.target.checked)}
                />

                {useCustomRatio && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                        <label className="text-sm font-semibold text-white block">
                            Select Work:Rest Ratio
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {['2:1', '1:1', '1:2', '3:1'].map((ratio) => (
                                <button
                                    key={ratio}
                                    type="button"
                                    onClick={() => setWorkRestRatio(ratio)}
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                        workRestRatio === ratio
                                            ? 'border-sky-400 bg-sky-400/10 text-sky-300'
                                            : 'border-white/10 bg-slate-900/50 text-slate-300 hover:border-white/20'
                                    }`}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">
                            Higher work ratio = more intense, Higher rest ratio = better recovery
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );

    const resultsView = (
        <Card variant="glass">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300 mb-6">
                Your HIIT Workout
            </p>

            {workout ? (
                <div className="space-y-6">
                    {/* Workout Header */}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-white">{workout.name}</h3>
                        <p className="text-sm text-slate-300">{workout.description}</p>
                    </div>

                    {/* Workout Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        {(() => {
                            const stats = getWorkoutStats(workout);
                            return (
                                <>
                                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                                            Total Time
                                        </p>
                                        <p className="text-lg font-semibold text-sky-300">
                                            {Math.round(workout.totalDuration)} min
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                                            Intervals
                                        </p>
                                        <p className="text-lg font-semibold text-sky-300">
                                            {stats.intervals}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                                            Work Time
                                        </p>
                                        <p className="text-lg font-semibold text-sky-300">
                                            {formatTime(stats.totalWork)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                                            Work:Rest
                                        </p>
                                        <p className="text-lg font-semibold text-sky-300">
                                            {stats.ratio}
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Interval Timeline */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                            Workout Timeline
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {workout.intervals.map((interval, idx) => {
                                const getIntervalStyle = () => {
                                    switch (interval.type) {
                                        case 'warmup':
                                            return 'border-yellow-500/30 bg-yellow-900/20';
                                        case 'work':
                                            return 'border-sky-500/30 bg-sky-900/20';
                                        case 'rest':
                                            return 'border-slate-500/30 bg-slate-800/20';
                                        case 'cooldown':
                                            return 'border-blue-500/30 bg-blue-900/20';
                                        default:
                                            return 'border-white/10 bg-slate-900/50';
                                    }
                                };

                                const getIntervalEmoji = () => {
                                    switch (interval.type) {
                                        case 'warmup':
                                            return '🔥';
                                        case 'work':
                                            return '💪';
                                        case 'rest':
                                            return '😮‍💨';
                                        case 'cooldown':
                                            return '🧘';
                                        default:
                                            return '';
                                    }
                                };

                                return (
                                    <div
                                        key={idx}
                                        className={`rounded-lg border p-3 ${getIntervalStyle()}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getIntervalEmoji()}</span>
                                                <span className="font-medium text-white capitalize">
                                                    {interval.type}
                                                    {interval.type === 'work' || interval.type === 'rest'
                                                        ? ` ${workout.intervals.filter((i, index) => index <= idx && i.type === interval.type).length}`
                                                        : ''}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-sky-300">
                                                {formatTime(interval.duration)}
                                            </span>
                                        </div>
                                        {interval.intensity && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                {interval.intensity}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-slate-400 text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                    Select your goal and duration to generate a HIIT workout.
                </p>
            )}
        </Card>
    );

    const info = workout ? (
        <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>
            <ul className="space-y-2 text-sm text-slate-300">
                {workout.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-2">
                        <span className="text-sky-400">•</span>
                        <span>{rec}</span>
                    </li>
                ))}
            </ul>
        </Card>
    ) : (
        <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About HIIT Training</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
                High-Intensity Interval Training (HIIT) alternates between short bursts of intense
                activity and periods of rest or lower-intensity exercise. This efficient training
                method improves cardiovascular fitness, burns calories, and can be completed in
                less time than traditional cardio.
            </p>
        </Card>
    );

    return (
        <CalculatorLayout
            subtitle="Interval Training"
            title="Generate a personalized HIIT workout based on your goals."
            description="Enter your fitness goal and available time to create a customized high-intensity interval training session with warmup, work intervals, and cooldown."
            form={form}
            results={resultsView}
            info={info}
        />
    );
};
