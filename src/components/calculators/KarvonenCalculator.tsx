import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import { calculateMaxHR, calculateAllZones } from '../../scripts/karvonen-calculator';

export const KarvonenCalculator: React.FC = () => {
    const [age, setAge] = useState<string>('30');
    const [restingHr, setRestingHr] = useState<string>('60');
    const [useCustomMax, setUseCustomMax] = useState<boolean>(false);
    const [customMaxHr, setCustomMaxHr] = useState<string>('190');
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        const ageNum = parseInt(age, 10);
        const restingHrNum = parseInt(restingHr, 10);
        const customMaxHrNum = parseInt(customMaxHr, 10);

        let maxHr: number | null = null;
        let source = "";

        if (useCustomMax && !isNaN(customMaxHrNum) && customMaxHrNum > 0) {
            maxHr = customMaxHrNum;
            source = "(custom)";
        } else if (!isNaN(ageNum) && ageNum > 0) {
            maxHr = calculateMaxHR(ageNum);
            source = "(220 - age)";
        }

        if (maxHr && !isNaN(restingHrNum) && restingHrNum > 0) {
            const zones = calculateAllZones(maxHr, restingHrNum);
            if (zones) {
                setResults({ zones, maxHr, source });
            } else {
                setResults(null);
            }
        } else {
            setResults(null);
        }
    }, [age, restingHr, useCustomMax, customMaxHr]);

    const form = (
        <Card variant="glass" className="space-y-8">
            <Input
                id="age"
                label="What is your current age?"
                type="number"
                inputMode="numeric"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                unit="years"
                required
            />

            <Input
                id="resting-hr"
                label="What is your resting heart rate?"
                type="number"
                inputMode="numeric"
                min="30"
                max="120"
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                unit="bpm"
                required
            />

            <div className="space-y-4 pt-2">
                <Checkbox
                    id="use-custom-max"
                    label="I know my maximum heart rate"
                    checked={useCustomMax}
                    onChange={(e) => setUseCustomMax(e.target.checked)}
                />

                {useCustomMax && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <Input
                            id="max-hr-input"
                            label="Maximum Heart Rate"
                            type="number"
                            inputMode="numeric"
                            min="100"
                            max="250"
                            value={customMaxHr}
                            onChange={(e) => setCustomMaxHr(e.target.value)}
                            unit="bpm"
                            required
                        />
                    </div>
                )}
            </div>
        </Card>
    );

    const resultsView = (
        <Card variant="glass">
            <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                    Your Heart Rate Zones
                </p>
                {results && (
                    <span className="text-xs text-slate-400">
                        Max HR: {results.maxHr} <span className="opacity-60">{results.source}</span>
                    </span>
                )}
            </div>

            <div className="mt-6 space-y-4">
                {results ? (
                    results.zones.map((zone: any) => (
                        <div key={zone.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4 transition hover:border-white/20">
                            <div>
                                <span className="font-semibold text-white">{zone.name}</span>
                                <span className="text-slate-400 text-sm"> · {zone.label}</span>
                            </div>
                            <span className="text-lg font-semibold text-sky-300">{zone.hrMin}-{zone.hrMax} bpm</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                        Enter your age and resting heart rate to see your zones.
                    </p>
                )}
            </div>
        </Card>
    );

    const info = (
        <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">The Karvonen Formula</h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                The Karvonen formula is a more personalized way to calculate heart rate zones because it takes your
                <strong> Heart Rate Reserve (HRR)</strong> into account—the difference between your maximum and resting heart rate.
            </p>
            <div className="mt-4 rounded-xl bg-slate-900/40 p-4 text-xs font-mono text-sky-200">
                Target HR = ((Max HR − Resting HR) × %Intensity) + Resting HR
            </div>
        </Card>
    );

    return (
        <CalculatorLayout
            subtitle="Karvonen Formula"
            title="Personalized heart rate zones based on your fitness level."
            description="The Karvonen method uses your resting heart rate to calculate zones that are more accurate for your specific cardiovascular health."
            form={form}
            results={resultsView}
            info={info}
        />
    );
};
