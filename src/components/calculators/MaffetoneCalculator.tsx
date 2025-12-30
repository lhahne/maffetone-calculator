import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Radio } from '../ui/Radio';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import { adjustmentOptions, calculateMaffetoneRange, formatRange } from '../../scripts/calculator';

export const MaffetoneCalculator: React.FC = () => {
    const [age, setAge] = useState<string>('39');
    const [adjustment, setAdjustment] = useState<number>(0);
    const [range, setRange] = useState<any>(null);

    useEffect(() => {
        const ageNum = Number(age);
        if (ageNum > 0) {
            setRange(calculateMaffetoneRange(ageNum, adjustment));
        } else {
            setRange(null);
        }
    }, [age, adjustment]);

    const form = (
        <Card variant="glass" className="space-y-8">
            <Input
                id="age"
                label="What is your current age?"
                type="number"
                inputMode="numeric"
                min="1"
                max="120"
                placeholder="e.g. 34"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                unit="years"
                required
            />

            <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-white">
                    Which statement best describes your training status?
                </legend>
                <div className="grid gap-4">
                    {adjustmentOptions.map((option) => (
                        <Radio
                            key={option.id}
                            name="adjustment"
                            value={option.adjustment}
                            checked={adjustment === option.adjustment}
                            onChange={() => setAdjustment(option.adjustment)}
                            label={option.label}
                        />
                    ))}
                </div>
            </fieldset>
        </Card>
    );

    const results = (
        <Card variant="glass">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                Your target range
            </p>
            <div className="mt-6 space-y-3">
                <div className="text-4xl font-semibold text-white">
                    {range ? formatRange(range) : '--'}
                </div>
                <div className="text-sm text-slate-300">
                    Maximum aerobic heart rate: <span>{range ? `${Math.round(range.base)} bpm` : '--'}</span>
                </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
                {!range
                    ? 'Enter a valid age to see your range.'
                    : `Adjustment: ${adjustmentOptions.find(o => o.adjustment === adjustment)?.label}`}
            </p>
        </Card>
    );

    const info = (
        <>
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white">How to use it</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
                    <li>Warm up and keep your heart rate between the low and high numbers.</li>
                    <li>Stay at or below the maximum value for most aerobic workouts.</li>
                    <li>Reassess every few months as fitness and health improve.</li>
                </ul>
            </Card>
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white">References</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    <li>
                        <a
                            className="text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline"
                            href="https://philmaffetone.com/180-formula/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Dr. Phil Maffetone: The 180 Formula
                        </a>
                    </li>
                    <li>
                        <a
                            className="text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline"
                            href="https://philmaffetone.com/faq/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Maffetone Method FAQs
                        </a>
                    </li>
                    <li>
                        <a
                            className="text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline"
                            href="https://philmaffetone.com/the-maffetone-method/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Overview of the Maffetone Method
                        </a>
                    </li>
                </ul>
            </Card>
        </>
    );

    return (
        <CalculatorLayout
            subtitle="Maffetone 180 Formula"
            title="Find your aerobic heart-rate training zone in seconds."
            description="The 180 formula helps you build endurance by keeping your training within a personalized aerobic range. Answer the questions below to calculate your target heart-rate zone."
            form={form}
            results={results}
            info={info}
        />
    );
};
