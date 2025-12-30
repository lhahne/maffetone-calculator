import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { CalculatorLayout } from '../ui/CalculatorLayout';
import { convertPaceToKm, convertPaceToMiles } from '../../scripts/pace-calculator';

export const PaceCalculator: React.FC = () => {
    const [mileMin, setMileMin] = useState<string>('8');
    const [mileSec, setMileSec] = useState<string>('00');
    const [kmMin, setKmMin] = useState<string>('4');
    const [kmSec, setKmSec] = useState<string>('58');

    const onMileChange = (m: string, s: string) => {
        setMileMin(m);
        setMileSec(s);
        const result = convertPaceToKm(m, s);
        setKmMin(result.minutes.toString());
        setKmSec(result.seconds < 10 ? "0" + result.seconds : result.seconds.toString());
    };

    const onKmChange = (m: string, s: string) => {
        setKmMin(m);
        setKmSec(s);
        const result = convertPaceToMiles(m, s);
        setMileMin(result.minutes.toString());
        setMileSec(result.seconds < 10 ? "0" + result.seconds : result.seconds.toString());
    };

    const form = (
        <Card variant="glass" className="space-y-10">
            <div className="space-y-4">
                <label className="text-xl font-semibold text-white block">Pace per Mile</label>
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <input
                            type="number"
                            value={mileMin}
                            onChange={(e) => onMileChange(e.target.value, mileSec)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-center text-3xl text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                        />
                        <span className="block text-center text-xs text-slate-500 uppercase mt-2">Minutes</span>
                    </div>
                    <span className="text-3xl text-slate-500 pb-6">:</span>
                    <div className="flex-1">
                        <input
                            type="number"
                            value={mileSec}
                            onChange={(e) => onMileChange(mileMin, e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-center text-3xl text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                        />
                        <span className="block text-center text-xs text-slate-500 uppercase mt-2">Seconds</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[#0f172a] px-3 text-2xl">⇄</span>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xl font-semibold text-white block">Pace per Kilometer</label>
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <input
                            type="number"
                            value={kmMin}
                            onChange={(e) => onKmChange(e.target.value, kmSec)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-center text-3xl text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                        />
                        <span className="block text-center text-xs text-slate-500 uppercase mt-2">Minutes</span>
                    </div>
                    <span className="text-3xl text-slate-500 pb-6">:</span>
                    <div className="flex-1">
                        <input
                            type="number"
                            value={kmSec}
                            onChange={(e) => onKmChange(kmMin, e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-center text-3xl text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                        />
                        <span className="block text-center text-xs text-slate-500 uppercase mt-2">Seconds</span>
                    </div>
                </div>
            </div>
        </Card>
    );

    const info = (
        <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Conversion Math</h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                1 mile = 1.609344 kilometers. To convert from mile pace to km pace, divide the decimal time by 1.609.
                To go from km pace to mile pace, multiply it by 1.609.
            </p>
        </Card>
    );

    return (
        <CalculatorLayout
            subtitle="Universal Runner Tool"
            title="Convert between Miles and Kilometers with ease."
            description="Type in either field to instantly see the converted pace. Useful for switching between track workouts and road racing metrics."
            form={form}
            results={<></>}
            info={info}
        />
    );
};
