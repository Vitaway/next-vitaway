'use client';

import React from 'react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors?: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

const GOALS = [
    { value: 'weight_management', label: 'Weight Management', icon: '⚖️' },
    { value: 'better_eating', label: 'Better Eating Habits', icon: '🥦' },
    { value: 'increased_energy', label: 'Increased Energy', icon: '⚡' },
    { value: 'improved_fitness', label: 'Improved Fitness', icon: '🏃' },
    { value: 'stress_reduction', label: 'Stress Reduction', icon: '🧘' },
    { value: 'better_sleep', label: 'Better Sleep', icon: '😴' },
];

function Step3Goals({ data, onChange }: Props) {
    const goals = data.wellness_goals || [];

    const toggleGoal = (value: string) => {
        const updated = goals.includes(value)
            ? goals.filter((g) => g !== value)
            : [...goals, value];
        onChange({ wellness_goals: updated });
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">Your wellness goals</h2>
            <p className="text-gray-500 text-sm mt-1">Select all that apply — we&apos;ll tailor your programme accordingly</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
                {GOALS.map(({ value, label, icon }) => {
                    const selected = goals.includes(value);
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => toggleGoal(value)}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border text-center transition-all duration-150 active:scale-[0.97] min-h-[100px] ${
                                selected
                                    ? 'border-[#003E48] bg-[#003E48]/5'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <span className="text-2xl">{icon}</span>
                            <span className={`text-xs font-semibold leading-tight ${selected ? 'text-[#003E48]' : 'text-slate-600'}`}>
                                {label}
                            </span>
                            {selected && (
                                <div className="w-4 h-4 rounded-full bg-[#003E48] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Other option */}
            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => toggleGoal('other')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-150 ${
                        goals.includes('other')
                            ? 'border-[#003E48] bg-[#003E48]/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                    <span className="text-xl">✨</span>
                    <span className={`text-sm font-semibold ${goals.includes('other') ? 'text-[#003E48]' : 'text-slate-600'}`}>
                        Other wellness goals
                    </span>
                </button>

                {goals.includes('other') && (
                    <textarea
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-gray-50 focus:outline-none focus:border-[#003E48] focus:bg-white resize-none transition-colors"
                        rows={3}
                        placeholder="Tell us more about your other goals..."
                        value={data.wellness_goals_other || ''}
                        onChange={(e) => onChange({ wellness_goals_other: e.target.value })}
                    />
                )}
            </div>
        </div>
    );
}

export default Step3Goals;
