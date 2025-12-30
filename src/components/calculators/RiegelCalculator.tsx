import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import { calculateRiegelTime, secondsToHHMMSS, hmsToSeconds, calculatePace } from '../../scripts/riegel-calculator';

export const RiegelCalculator: React.FC = () => {
    const [inputDist, setInputDist] = useState<string>('10');
    const [inputH, setInputH] = useState<string>('0');
    const [inputM, setInputM] = useState<string>('45');
    const [inputS, setInputS] = useState<string>('00');
    const [targetDist, setTargetDist] = useState<string>('21.0975');
    const [result, setResult] = useState<{ time: string, pace: string }>({ time: '--:--:--', pace: '--:--' });

    useEffect(() => {
        const d1 = parseFloat(inputDist);
        const d2 = parseFloat(targetDist);
        const t1 = hmsToSeconds(inputH, inputM, inputS);

        if (d1 > 0 && d2 > 0 && t1 > 0) {
            const t2 = calculateRiegelTime(d1, t1, d2);
            setResult({
                time: secondsToHHMMSS(t2),
                pace: calculatePace(t2, d2)
            });
        } else {
            setResult({ time: '--:--:--', pace: '--:--' });
        }
    }, [inputDist, inputH, inputM, inputS, targetDist]);

    const presets = [
        { label: '5K', value: '5' },
        { label: '10K', value: '10' },
        { label: 'Half', value: '21.0975' },
        { label: 'Full', value: '42.195' },
    ];

    const form = (
        <>
            <Card variant="glass" className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Known Performance</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Distance (km)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={inputDist}
                                onChange={(e) => setInputDist(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {presets.map(p => (
                                <button
                                    key={p.label}
                                    onClick={() => setInputDist(p.value)}
                                    className="px-3 py-1 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-slate-300"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Time (HH:MM:SS)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={inputH}
                                onChange={(e) => setInputH(e.target.value)}
                                placeholder="HH"
                                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                            />
                            <span className="text-slate-500">:</span>
                            <input
                                type="number"
                                value={inputM}
                                onChange={(e) => setInputM(e.target.value)}
                                placeholder="MM"
                                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                            />
                            <span className="text-slate-500">:</span>
                            <input
                                type="number"
                                value={inputS}
                                onChange={(e) => setInputS(e.target.value)}
                                placeholder="SS"
                                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card variant="glass" className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Target Performance</h2>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Target Distance (km)</label>
                    <input
                        type="number"
                        value={targetDist}
                        onChange={(e) => setTargetDist(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                    />
                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <button
                                key={`target-${p.label}`}
                                onClick={() => setTargetDist(p.value)}
                                className="px-3 py-1 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-slate-300"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );

    const results = (
        <Card variant="glass" className="ring-1 ring-sky-400/30">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                Predicted Result
            </p>
            <div className="mt-6 space-y-2">
                <div className="text-5xl font-bold text-white tracking-tight">
                    {result.time}
                </div>
                <div className="text-lg text-slate-400">
                    Pace: <span className="text-sky-300 font-semibold">{result.pace} min/km</span>
                </div>
            </div>
        </Card>
    );

    const info = (
        <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Riegel's Formula</h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                The formula is <strong>T2 = T1 * (D2 / D1)^1.06</strong>. It's widely used to predict race times
                based on a recent performance at a different distance.
            </p>
        </Card>
    );

    return (
        <CalculatorLayout
            subtitle="The Gold Standard"
            title="Predict your next race time with Riegel's Formula."
            description="Use your recent race results to estimate what you can achieve at other distances. Extremely accurate for most distance runners."
            form={form}
            results={results}
            info={info}
        />
    );
};
