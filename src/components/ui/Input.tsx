import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    unit?: string;
}

export const Input: React.FC<InputProps> = ({ label, unit, id, ...props }) => {
    return (
        <div className="space-y-3">
            <label htmlFor={id} className="text-lg font-semibold text-white">
                {label}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                    id={id}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-lg text-white shadow-inner outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50"
                    {...props}
                />
                {unit && (
                    <span className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
};
