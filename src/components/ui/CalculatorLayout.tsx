import React from 'react';

interface CalculatorLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    form: React.ReactNode;
    results: React.ReactNode;
    info?: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
    title,
    subtitle,
    description,
    form,
    results,
    info,
}) => {
    return (
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-14 pt-24">
            <header className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                    {subtitle}
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                    {title}
                </h1>
                <p className="max-w-2xl text-lg text-slate-300">
                    {description}
                </p>
            </header>

            <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-8">
                    {form}
                </div>
                <aside className="space-y-6">
                    {results}
                    {info}
                </aside>
            </section>
        </main>
    );
};
