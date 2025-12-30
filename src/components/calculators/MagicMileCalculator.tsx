import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import { calculateMagicMilePredictions, secondsToMMSS, secondsToHHMMSS, msToSeconds } from '../../scripts/magic-mile-calculator';

export const MagicMileCalculator: React.FC = () => {
    const [min, setMin] = useState<string>('7');
    const [sec, setSec] = useState<string>('00');
    const [predictions, setPredictions] = useState<any>(null);

    useEffect(() => {
        const totalSeconds = msToSeconds(min, sec);
        if (totalSeconds > 0) {
            setPredictions(calculateMagicMilePredictions(totalSeconds));
        } else {
            setPredictions(null);
        }
    }, [min, sec]);

    const presets = [
        { m: '6', s: '00' },
        { m: '7', s: '00' },
        { m: '8', s: '00' },
        { m: '9', s: '00' },
        { m: '10', s: '00' },
    ];

    const form = (
        <>
            <Card variant="glass" className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Your Magic Mile Time</h2>
                <p className="text-sm text-slate-400">
                    Run 1 mile at a hard, sustainable pace — not an all-out sprint.
                </p>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        Time (MM:SS)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={min}
                            min="0"
                            max="59"
                            onChange={(e) => setMin(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-center text-2xl text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                        />
                        <span className="text-2xl text-slate-500">:</span>
                        <input
                            type="number"
                            value={sec}
                            min="0"
                            max="59"
                            onChange={(e) => setSec(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-center text-2xl text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {presets.map((p) => (
                        <button
                            key={`${p.m}:${p.s}`}
                            onClick={() => { setMin(p.m); setSec(p.s); }}
                            className="px-3 py-1 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-slate-300"
                        >
                            {p.m}:{p.s}
                        </button>
                    ))}
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white">How to Run Your Magic Mile</h2>
                <ul className="mt-3 text-sm text-slate-300 leading-relaxed space-y-2">
                    <li>• Warm up with a slow 1-mile jog</li>
                    <li>• Do a few short accelerations</li>
                    <li>• Run hard but don't sprint — you should feel like you couldn't run more than 100m further</li>
                    <li>• Keep your pace even throughout</li>
                    <li>• Re-test every 2 weeks during training</li>
                </ul>
            </Card>
        </>
    );

    const results = (
        <Card variant="glass" className="ring-1 ring-purple-400/30">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
                Race Predictions
            </p>

            <div className="mt-6 space-y-4">
                {[
                    { key: '5k', label: '5K', dist: '3.1 mi' },
                    { key: '10k', label: '10K', dist: '6.2 mi' },
                    { key: '10mile', label: '10 Mile', dist: null },
                    { key: 'halfMarathon', label: 'Half Marathon', dist: '13.1 mi' },
                    { key: 'marathon', label: 'Marathon', dist: '26.2 mi' },
                ].map((item, idx, arr) => (
                    <div
                        key={item.key}
                        className={`flex justify-between items-center ${idx < arr.length - 1 ? 'border-b border-white/10 pb-4' : ''}`}
                    >
                        <div>
                            <span className="text-lg font-semibold text-white">{item.label}</span>
                            {item.dist && <span className="text-sm text-slate-400 ml-2">({item.dist})</span>}
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                {predictions ? secondsToHHMMSS(predictions[item.key].totalTime) : '--:--'}
                            </div>
                            <div className="text-sm text-purple-300">
                                {predictions ? `${secondsToMMSS(predictions[item.key].pacePerMile)} /mi` : '--:-- /mi'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );

    const footerInfo = (
        <Card className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Note:</strong> These predictions assume you've trained properly for the distance, pace yourself correctly, and race in conditions of 60°F (15°C) or cooler.
            </p>
        </Card>
    );

    return (
        <CalculatorLayout
            subtitle="Jeff Galloway's Method"
            title="Magic Mile Race Predictor"
            description="Enter your Magic Mile time (a hard but sustainable 1-mile effort) to predict your race paces for 5K through marathon distances."
            form={form}
            results={results}
            info={footerInfo}
        />
    );
};
