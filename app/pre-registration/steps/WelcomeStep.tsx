'use client';

import React from 'react';
import { Salad, Zap, Target, ShieldCheck } from 'lucide-react';

interface WelcomeStepProps {
    onStart: () => void;
}

const FEATURES = [
    {
        icon: <Salad className="w-5 h-5 text-[#E85A2E] flex-shrink-0 mt-0.5" />,
        title: 'Personalized nutrition guidance',
        desc: 'Meal plans tailored to your goals and lifestyle',
    },
    {
        icon: <Zap className="w-5 h-5 text-[#E85A2E] flex-shrink-0 mt-0.5" />,
        title: 'Faster & easier registration',
        desc: 'Complete your profile in under 5 minutes',
    },
    {
        icon: <Target className="w-5 h-5 text-[#E85A2E] flex-shrink-0 mt-0.5" />,
        title: 'Goal-based wellness planning',
        desc: 'Programmes designed around what matters to you',
    },
    {
        icon: <ShieldCheck className="w-5 h-5 text-[#E85A2E] flex-shrink-0 mt-0.5" />,
        title: 'Privacy & data protection',
        desc: 'Your health data is always secure with us',
    },
];

function WelcomeStep({ onStart }: WelcomeStepProps) {
    return (
        <div className="flex flex-col items-center text-center px-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E85A2E] to-[#E85A2E] flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.41 22c0-3.87 3.85-7 8.59-7s8.59 3.13 8.59 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                Welcome to <span className="text-[#E85A2E]">Vitaway Nutrition Clinic</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-xs">
                Your personalised wellness journey starts here
            </p>

            <div className="mt-8 w-full space-y-3 text-left">
                {FEATURES.map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        {icon}
                        <div>
                            <p className="font-semibold text-slate-700 text-sm">{title}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onStart}
                className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-b from-[#E85A2E] to-[#E85A2E] text-white font-semibold text-base shadow-lg active:scale-[0.98] transition-transform duration-150"
            >
                Get Started
            </button>

            <p className="text-xs text-gray-400 mt-4">
                Takes about 3–5 minutes · No account required
            </p>
        </div>
    );
}

export default WelcomeStep;
