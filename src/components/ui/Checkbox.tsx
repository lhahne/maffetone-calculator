import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
    return (
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-slate-300 transition hover:text-white">
            <input
                id={id}
                type="checkbox"
                className="h-5 w-5 rounded border-white/10 bg-slate-900/50 text-sky-400 focus:ring-sky-400/50"
                {...props}
            />
            <span className="text-sm">{label}</span>
        </label>
    );
};
