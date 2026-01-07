import React, { useState, useEffect } from 'react';

export const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    const links = [
        { href: '/', label: 'Maffetone Calculator' },
        { href: '/pace', label: 'Pace Calculator' },
        { href: '/riegel', label: 'Race Pace Estimator' },
        { href: '/magic-mile', label: 'Magic Mile Calculator' },
        { href: '/vdot', label: 'VDOT Calculator' },
        { href: '/karvonen', label: 'Karvonen Calculator' },
        { href: '/hiit', label: 'HIIT Workout Generator' },
        { href: '/exercise', label: 'Strength Routine' },
    ];

    return (
        <>
            <button
                onClick={toggleMenu}
                className="fixed top-6 left-6 z-50 p-2 text-white bg-slate-800 rounded-lg border border-white/10 hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-sky-400"
                aria-label="Toggle Menu"
            >
                {!isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>

            <div
                className={`fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-sm transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex items-center justify-center md:justify-start md:pl-24`}
                onClick={() => setIsOpen(false)}
            >
                <nav className="flex flex-col gap-8 text-center md:text-left" onClick={(e) => e.stopPropagation()}>
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-3xl font-semibold text-white hover:text-sky-400 transition"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </>
    );
};
