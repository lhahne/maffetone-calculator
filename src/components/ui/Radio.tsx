import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Radio: React.FC<RadioProps> = ({ label, ...props }) => {
    return (
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-4 transition hover:border-sky-400/70">
            <input
                type="radio"
                className="mt-1 h-5 w-5 accent-sky-400"
                {...props}
            />
            <span className="text-sm text-slate-200">
                {label}
            </span>
        </label>
    );
};
