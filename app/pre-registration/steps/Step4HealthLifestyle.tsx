'use client';

import React from 'react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors?: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

const ACTIVITY_LEVELS: { value: PreRegistrationPayload['activity_level']; label: string; desc: string }[] = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1–3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3–5 days/week' },
    { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6–7 days/week' },
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
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all duration-150 active:scale-[0.97] ${
                        selected === value
                            ? 'border-[#003E48] bg-[#003E48]/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                    <span className={`text-sm font-semibold ${selected === value ? 'text-[#003E48]' : 'text-slate-700'}`}>
                        {label}
                    </span>
                    {desc && <span className="text-xs text-gray-400 mt-0.5">{desc}</span>}
                </button>
            ))}
        </div>
    );
}

function Step4HealthLifestyle({ data, onChange }: Props) {
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
            <div>
                <h2 className="text-xl font-bold text-slate-800">Health & lifestyle</h2>
                <p className="text-gray-500 text-sm mt-1">Helps us personalise your programme safely</p>
            </div>

            {/* Health conditions */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Existing health conditions</p>
                <div className="grid grid-cols-2 gap-2">
                    {HEALTH_CONDITIONS.map((cond) => {
                        const selected = conditions.includes(cond);
                        return (
                            <button
                                key={cond}
                                type="button"
                                onClick={() => toggleCondition(cond)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                                    selected
                                        ? 'border-[#003E48] bg-[#003E48]/5'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                    selected ? 'border-[#003E48] bg-[#003E48]' : 'border-gray-300'
                                }`}>
                                    {selected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-xs font-medium ${selected ? 'text-[#003E48]' : 'text-slate-600'}`}>
                                    {cond}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Activity level */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Activity level</p>
                <SelectGrid
                    options={ACTIVITY_LEVELS as { value: string; label: string; desc?: string }[]}
                    selected={data.activity_level}
                    onSelect={(v) => onChange({ activity_level: v as PreRegistrationPayload['activity_level'] })}
                />
            </div>

            {/* Exercise frequency */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Exercise frequency</p>
                <SelectGrid
                    options={EXERCISE_FREQ as { value: string; label: string }[]}
                    selected={data.exercise_frequency}
                    onSelect={(v) => onChange({ exercise_frequency: v as PreRegistrationPayload['exercise_frequency'] })}
                />
            </div>

            {/* Smoking */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Smoking</p>
                <div className="grid grid-cols-4 gap-2">
                    {HABIT_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange({ smoking_status: opt })}
                            className={`px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-[0.97] ${
                                data.smoking_status === opt
                                    ? 'border-[#003E48] bg-[#003E48]/5 text-[#003E48]'
                                    : 'border-gray-200 text-slate-600 hover:border-gray-300'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alcohol */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Alcohol</p>
                <div className="grid grid-cols-4 gap-2">
                    {HABIT_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange({ alcohol_status: opt })}
                            className={`px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-[0.97] ${
                                data.alcohol_status === opt
                                    ? 'border-[#003E48] bg-[#003E48]/5 text-[#003E48]'
                                    : 'border-gray-200 text-slate-600 hover:border-gray-300'
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
