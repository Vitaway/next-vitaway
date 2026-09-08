'use client';

import React from 'react';
import { Salad, Zap, Target, ShieldCheck } from 'lucide-react';
import PressButton from '@/app/components/buttons/press-button';

interface WelcomeStepProps {
    onStart: () => void;
    compact?: boolean;
}

const FEATURES = [
    {
        icon: <Salad className="mt-0.5 h-5 w-5 shrink-0 text-[#E85A2E]" />,
        title: 'Personalized nutrition guidance',
        desc: 'Meal plans tailored to your goals and lifestyle',
    },
    {
        icon: <Zap className="mt-0.5 h-5 w-5 shrink-0 text-[#E85A2E]" />,
        title: 'Faster & easier registration',
        desc: 'Complete your profile in under 5 minutes',
    },
    {
        icon: <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#E85A2E]" />,
        title: 'Goal-based wellness planning',
        desc: 'Programmes designed around what matters to you',
    },
    {
        icon: <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E85A2E]" />,
        title: 'Privacy & data protection',
        desc: 'Your health data is always secure with us',
    },
];

function WelcomeStep({ onStart, compact = false }: WelcomeStepProps) {
    if (compact) {
        return (
            <div className="grid gap-2 sm:grid-cols-2">
                {FEATURES.map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl bg-[#F6F3EE] p-3.5 text-left">
                        {icon}
                        <div>
                            <p className="text-sm font-semibold text-[#003E48]">{title}</p>
                            <p className="mt-0.5 text-xs leading-snug text-[#003E48]/55">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center px-2 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#003E48]">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.41 22c0-3.87 3.85-7 8.59-7s8.59 3.13 8.59 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <h1 className="text-2xl font-bold leading-tight text-[#003E48] md:text-3xl">
                Welcome to <span className="font-accent">Vitaway</span>
            </h1>
            <p className="mt-2 max-w-xs text-sm text-[#003E48]/60 md:text-base">
                Your personalised wellness journey starts here
            </p>

            <div className="mt-8 w-full space-y-3 text-left">
                {FEATURES.map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 rounded-[24px] bg-white p-4">
                        {icon}
                        <div>
                            <p className="text-sm font-semibold text-[#003E48]">{title}</p>
                            <p className="mt-0.5 text-xs text-[#003E48]/55">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <PressButton onClick={onStart} className="mt-8 w-full">
                Get Started
            </PressButton>

            <p className="mt-4 text-xs text-[#003E48]/45">
                Takes about 3–5 minutes · No account required
            </p>
        </div>
    );
}

export default WelcomeStep;
