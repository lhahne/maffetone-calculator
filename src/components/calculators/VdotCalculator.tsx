import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import { calculateVDOT, predictRaceTime, getTrainingPaces, formatTime, formatPace } from '../../scripts/vdot-calculator';
import { hmsToSeconds } from '../../scripts/riegel-calculator';

export const VdotCalculator: React.FC = () => {
    const [inputDist, setInputDist] = useState<string>('5');
    const [inputH, setInputH] = useState<string>('0');
    const [inputM, setInputM] = useState<string>('20');
    const [inputS, setInputS] = useState<string>('00');
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        const distanceMeters = parseFloat(inputDist) * 1000;
        const timeSeconds = hmsToSeconds(inputH, inputM, inputS);

        if (distanceMeters > 0 && timeSeconds > 0) {
            const vdot = calculateVDOT(distanceMeters, timeSeconds);
            const paces = getTrainingPaces(vdot);

            const commonDistances = [
                { name: "5K", distance: 5000 },
                { name: "10K", distance: 10000 },
                { name: "Half Marathon", distance: 21097.5 },
                { name: "Marathon", distance: 42195 },
            ];

            const predictions = commonDistances.map(d => {
                const predictedSeconds = predictRaceTime(vdot, d.distance);
                return {
                    name: d.name,
                    time: formatTime(predictedSeconds),
                    pace: formatPace(predictedSeconds / (d.distance / 1000))
                };
            });

            setResults({ vdot, paces, predictions });
        } else {
            setResults(null);
        }
    }, [inputDist, inputH, inputM, inputS]);

    const presets = [
        { label: '5K', value: '5' },
        { label: '10K', value: '10' },
        { label: 'Half', value: '21.0975' },
        { label: 'Full', value: '42.195' },
    ];

    const form = (
        <Card variant="glass" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Race Result</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Distance (km)</label>
                    <input
                        type="number"
                        value={inputDist}
                        onChange={(e) => setInputDist(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                    />
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
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                        />
                        <span className="text-slate-500">:</span>
                        <input
                            type="number"
                            value={inputM}
                            onChange={(e) => setInputM(e.target.value)}
                            placeholder="MM"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                        />
                        <span className="text-slate-500">:</span>
                        <input
                            type="number"
                            value={inputS}
                            onChange={(e) => setInputS(e.target.value)}
                            placeholder="SS"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );

    const resultsView = (
        <div className="space-y-6">
            <Card variant="glass" className="ring-1 ring-emerald-400/30 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
                    Your VDOT Score
                </p>
                <div className="mt-4 text-7xl font-bold text-white tracking-tighter">
                    {results ? results.vdot.toFixed(1) : '--.-'}
                </div>
            </Card>

            {results && (
                <>
                    <Card variant="glass" className="p-0 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                            <h3 className="font-semibold text-white">Training Paces</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Pace</th>
                                        <th className="px-6 py-3">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results.paces.map((p: any) => (
                                        <tr key={p.name} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-mono text-lg">{formatPace(p.paceSecondsPerKm)}</td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">{p.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {results.predictions.map((p: any) => (
                            <div key={p.name} className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{p.name}</p>
                                <p className="text-2xl font-bold text-white">{p.time}</p>
                                <p className="text-xs text-slate-400">{p.pace} min/km</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <CalculatorLayout
            subtitle="Jack Daniels' Running Formula"
            title="Unlock your potential with VDOT."
            description="VDOT is a measure of your running ability that accounts for both VO2max and running economy. Use it to find your optimal training intensities."
            form={form}
            results={resultsView}
            info={
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-white">What is VDOT?</h2>
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                        Coined by legendary coach Jack Daniels, VDOT represents your current fitness level.
                        By knowing one recent race time, you can determine exactly how fast you should be running
                        your easy runs, intervals, and tempo sessions.
                    </p>
                </Card>
            }
        />
    );
};
