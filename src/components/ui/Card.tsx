import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
    const baseStyles = "rounded-3xl border border-white/10 p-8 shadow-xl backdrop-blur";
    const variants = {
        default: "bg-slate-900/60",
        glass: "bg-white/5",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};
