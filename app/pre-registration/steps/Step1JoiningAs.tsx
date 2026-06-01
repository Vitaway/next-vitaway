'use client';

import React from 'react';
import { User, Dumbbell, Briefcase } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

const OPTIONS: {
    value: PreRegistrationPayload['joining_as'];
    label: string;
    desc: string;
    icon: React.ReactNode;
}[] = [
        {
            value: 'individual',
            label: 'Individual',
            desc: 'Self-registering for personal wellness goals',
            icon: <User className="w-6 h-6" />,
        },
        {
            value: 'gym_member',
            label: 'Gym Member',
            desc: 'Joining through your gym or fitness centre',
            icon: <Dumbbell className="w-6 h-6" />,
        },
        {
            value: 'employer_program',
            label: 'Employer / Workplace Program',
            desc: 'Enrolling via your company wellness programme',
            icon: <Briefcase className="w-6 h-6" />,
        },
    ];

function Step1JoiningAs({ data, errors, onChange }: Props) {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">How are you joining us?</h2>
            <p className="text-gray-500 text-sm mt-1">Select the option that best describes you</p>

            <div className="mt-5 space-y-3">
                {OPTIONS.map(({ value, label, desc, icon }) => {
                    const selected = data.joining_as === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange({ joining_as: value })}
                            className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] ${selected
                                    ? 'border-[#E85A2E] bg-[#E85A2E]/5'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <span className={`flex-shrink-0 mt-0.5 ${selected ? 'text-[#E85A2E]' : 'text-gray-400'}`}>
                                {icon}
                            </span>
                            <div className="flex-1">
                                <p className={`font-semibold text-sm ${selected ? 'text-[#E85A2E]' : 'text-slate-700'}`}>
                                    {label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${selected ? 'border-[#E85A2E] bg-[#E85A2E]' : 'border-gray-300'
                                }`}>
                                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {errors.map((err) => (
                <p key={err} className="text-red-500 text-sm mt-3 font-medium">{err}</p>
            ))}
        </div>
    );
}

export default Step1JoiningAs;
