'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors?: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
    hideHeader?: boolean;
}

const ACTIVITY_LEVELS: { value: PreRegistrationPayload['activity_level']; label: string; desc: string }[] = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1–3×/week' },
    { value: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3–5×/week' },
    { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6–7×/week' },
];

const EXERCISE_FREQ: { value: PreRegistrationPayload['exercise_frequency']; label: string }[] = [
    { value: 'never', label: 'Never' },
    { value: '1_2_per_week', label: '1–2× / week' },
    { value: '3_4_per_week', label: '3–4× / week' },
    { value: 'daily', label: 'Daily' },
];

const HEALTH_CONDITIONS = [
    'Diabetes', 'Hypertension', 'Obesity', 'High Cholesterol',
    'Heart Disease', 'Thyroid Issues', 'Digestive Issues', 'None',
];

const HABIT_OPTIONS = ['Never', 'Occasionally', 'Regularly', 'Daily'];

type SelectGridProps = {
    options: { value: string; label: string; desc?: string }[];
    selected?: string;
    onSelect: (v: string) => void;
};

function SelectGrid({ options, selected, onSelect }: SelectGridProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {options.map(({ value, label, desc }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => onSelect(value)}
                    className={`flex flex-col rounded-[24px] border p-3 text-left transition-all duration-150 active:scale-[0.97] ${
                        selected === value
                            ? 'border-[#E85A2E] bg-[#F6F3EE]'
                            : 'border-transparent bg-[#F6F3EE] hover:border-[#003E48]/20'
                    }`}
                >
                    <span className={`text-sm font-semibold ${selected === value ? 'text-[#E85A2E]' : 'text-[#003E48]'}`}>
                        {label}
                    </span>
                    {desc && <span className="mt-0.5 text-xs text-[#003E48]/45">{desc}</span>}
                </button>
            ))}
        </div>
    );
}

function Step4HealthLifestyle({ data, onChange, hideHeader = false }: Props) {
    const conditions = data.health_conditions || [];

    const toggleCondition = (value: string) => {
        if (value === 'None') {
            onChange({ health_conditions: ['None'] });
            return;
        }
        const filtered = conditions.filter((c) => c !== 'None');
        const updated = filtered.includes(value)
            ? filtered.filter((c) => c !== value)
            : [...filtered, value];
        onChange({ health_conditions: updated });
    };

    return (
        <div className="space-y-6">
            {hideHeader ? null : (
            <div>
                <h2 className="text-xl font-bold text-[#003E48]">Health & <span className="font-accent">lifestyle</span></h2>
                <p className="mt-1 text-sm text-[#003E48]/60">Helps us personalise your programme safely</p>
            </div>
            )}

            {/* Health conditions */}
            <div>
                <p className="mb-2 text-sm font-semibold text-[#003E48]">Existing health conditions</p>
                <div className="grid grid-cols-2 gap-2">
                    {HEALTH_CONDITIONS.map((cond) => {
                        const selected = conditions.includes(cond);
                        return (
                            <button
                                key={cond}
                                type="button"
                                onClick={() => toggleCondition(cond)}
                                className={`flex items-center gap-2 rounded-[24px] border px-3 py-2.5 text-left transition-all duration-150 ${
                                    selected
                                        ? 'border-[#E85A2E] bg-[#F6F3EE]'
                                        : 'border-transparent bg-[#F6F3EE] hover:border-[#003E48]/20'
                                }`}
                            >
                                <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                                    selected ? 'border-[#E85A2E] bg-[#E85A2E]' : 'border-[#003E48]/25'
                                }`}>
                                    {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                </div>
                                <span className={`text-xs font-medium ${selected ? 'text-[#E85A2E]' : 'text-[#003E48]'}`}>
                                    {cond}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Activity level */}
            <div>
                <p className="mb-2 text-sm font-semibold text-[#003E48]">Activity level</p>
                <SelectGrid
                    options={ACTIVITY_LEVELS as { value: string; label: string; desc?: string }[]}
                    selected={data.activity_level}
                    onSelect={(v) => onChange({ activity_level: v as PreRegistrationPayload['activity_level'] })}
                />
            </div>

            {/* Exercise frequency */}
            <div>
                <p className="mb-2 text-sm font-semibold text-[#003E48]">Exercise frequency</p>
                <SelectGrid
                    options={EXERCISE_FREQ as { value: string; label: string }[]}
                    selected={data.exercise_frequency}
                    onSelect={(v) => onChange({ exercise_frequency: v as PreRegistrationPayload['exercise_frequency'] })}
                />
            </div>

            {/* Smoking */}
            <div>
                <p className="mb-2 text-sm font-semibold text-[#003E48]">Smoking</p>
                <div className="grid grid-cols-4 gap-2">
                    {HABIT_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange({ smoking_status: opt })}
                            className={`rounded-[24px] border px-2 py-2.5 text-xs font-semibold transition-all active:scale-[0.97] ${
                                data.smoking_status === opt
                                    ? 'border-[#E85A2E] bg-[#F6F3EE] text-[#E85A2E]'
                                    : 'border-transparent bg-[#F6F3EE] text-[#003E48] hover:border-[#003E48]/20'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alcohol */}
            <div>
                <p className="mb-2 text-sm font-semibold text-[#003E48]">Alcohol</p>
                <div className="grid grid-cols-4 gap-2">
                    {HABIT_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange({ alcohol_status: opt })}
                            className={`rounded-[24px] border px-2 py-2.5 text-xs font-semibold transition-all active:scale-[0.97] ${
                                data.alcohol_status === opt
                                    ? 'border-[#E85A2E] bg-[#F6F3EE] text-[#E85A2E]'
                                    : 'border-transparent bg-[#F6F3EE] text-[#003E48] hover:border-[#003E48]/20'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Step4HealthLifestyle;
