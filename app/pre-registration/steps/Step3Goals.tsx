'use client';

import React from 'react';
import { Scale, Utensils, BatteryFull, Bike, Brain, Moon, Sparkles, Check } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors?: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
    hideHeader?: boolean;
}

const GOALS: { value: string; label: string; icon: React.ReactNode }[] = [
    { value: 'weight_management', label: 'Weight Management', icon: <Scale className="w-6 h-6" /> },
    { value: 'better_eating', label: 'Better Eating Habits', icon: <Utensils className="w-6 h-6" /> },
    { value: 'increased_energy', label: 'Increased Energy', icon: <BatteryFull className="w-6 h-6" /> },
    { value: 'improved_fitness', label: 'Improved Fitness', icon: <Bike className="w-6 h-6" /> },
    { value: 'stress_reduction', label: 'Stress Reduction', icon: <Brain className="w-6 h-6" /> },
    { value: 'better_sleep', label: 'Better Sleep', icon: <Moon className="w-6 h-6" /> },
];

function Step3Goals({ data, onChange, hideHeader = false }: Props) {
    const goals = data.wellness_goals || [];

    const toggleGoal = (value: string) => {
        const updated = goals.includes(value)
            ? goals.filter((g) => g !== value)
            : [...goals, value];
        onChange({ wellness_goals: updated });
    };

    return (
        <div>
            {hideHeader ? null : (
                <>
                    <h2 className="text-xl font-bold text-[#003E48]">Your wellness <span className="font-accent">goals</span></h2>
                    <p className="mt-1 text-sm text-[#003E48]/60">Select all that apply — we&apos;ll tailor your programme accordingly</p>
                </>
            )}

            <div className={`${hideHeader ? 'grid grid-cols-2 gap-2' : 'mt-5 grid grid-cols-2 gap-3'}`}>
                {GOALS.map(({ value, label, icon }) => {
                    const selected = goals.includes(value);
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => toggleGoal(value)}
                            className={`flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-[24px] border p-4 text-center transition-all duration-150 active:scale-[0.97] ${
                                selected
                                    ? 'border-[#E85A2E] bg-[#F6F3EE]'
                                    : hideHeader
                                      ? 'border-transparent bg-[#F6F3EE] hover:border-[#003E48]/20'
                                      : 'border-transparent bg-white hover:border-[#003E48]/20'
                            }`}
                        >
                            <span className={selected ? 'text-[#E85A2E]' : 'text-[#003E48]/40'}>{icon}</span>
                            <span className={`text-xs font-semibold leading-tight ${selected ? 'text-[#E85A2E]' : 'text-[#003E48]'}`}>
                                {label}
                            </span>
                            {selected && (
                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E85A2E]">
                                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Other goal */}
            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => toggleGoal('other')}
                    className={`flex w-full items-center gap-3 rounded-[24px] border p-4 text-left transition-all duration-150 ${
                        goals.includes('other')
                            ? 'border-[#E85A2E] bg-white'
                            : 'border-transparent bg-white hover:border-[#003E48]/20'
                    }`}
                >
                    <Sparkles className={`h-5 w-5 flex-shrink-0 ${goals.includes('other') ? 'text-[#E85A2E]' : 'text-[#003E48]/40'}`} />
                    <span className={`text-sm font-semibold ${goals.includes('other') ? 'text-[#E85A2E]' : 'text-[#003E48]'}`}>
                        Other wellness goals
                    </span>
                </button>

                {goals.includes('other') && (
                    <textarea
                        className="mt-2 h-28 w-full resize-none rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-[#003E48] placeholder:text-[#003E48]/40 transition duration-200 focus:border-[#003E48] focus:bg-white focus:outline-none"
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
