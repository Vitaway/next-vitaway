'use client';

import React from 'react';
import { User, Dumbbell, Briefcase } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';
import { RequiredMark } from '@/app/components/inputs/FormLabel';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
    hideHeader?: boolean;
}

const OPTIONS: {
    value: PreRegistrationPayload['joining_as'];
    label: string;
    desc: string;
    Icon: typeof User;
}[] = [
    {
        value: 'individual',
        label: 'Individual',
        desc: 'Self-registering for personal wellness goals',
        Icon: User,
    },
    {
        value: 'gym_member',
        label: 'Gym Member',
        desc: 'Joining through your gym or fitness centre',
        Icon: Dumbbell,
    },
    {
        value: 'employer_program',
        label: 'Employer / Workplace',
        desc: 'Enrolling via your company wellness programme',
        Icon: Briefcase,
    },
];

function Step1JoiningAs({ data, errors, onChange, hideHeader = false }: Props) {
    if (hideHeader) {
        return (
            <div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {OPTIONS.map(({ value, label, desc, Icon }, index) => {
                        const selected = data.joining_as === value;
                        const fullWidth = index === 2;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onChange({ joining_as: value })}
                                className={`relative flex min-h-[148px] flex-col gap-4 rounded-[22px] border p-5 pr-12 text-left transition-all duration-150 active:scale-[0.99] sm:min-h-[168px] sm:p-6 sm:pr-14 ${
                                    fullWidth ? 'sm:col-span-2 sm:min-h-[128px] sm:flex-row sm:items-center' : ''
                                } ${
                                    selected
                                        ? 'border-[#E85A2E] bg-[#FFF4F0]'
                                        : 'border-transparent bg-[#F6F3EE] hover:border-[#003E48]/20'
                                }`}
                            >
                                <span
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                        selected ? 'bg-[#E85A2E] text-white' : 'bg-white text-[#003E48]'
                                    }`}
                                >
                                    <Icon className="h-6 w-6" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`text-base font-bold sm:text-lg ${
                                            selected ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                        }`}
                                    >
                                        {label}
                                    </p>
                                    <p className="mt-1 text-sm leading-snug text-[#003E48]/60">{desc}</p>
                                </div>
                                <div
                                    className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                                        selected ? 'border-[#E85A2E] bg-[#E85A2E]' : 'border-[#003E48]/25'
                                    }`}
                                >
                                    {selected ? <div className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {errors.map((err) => (
                    <p key={err} className="mt-3 text-sm font-medium text-red-500">
                        {err}
                    </p>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-[#003E48]">
                <RequiredMark />
                How are you <span className="font-accent">joining</span> us?
            </h2>
            <p className="mt-1 text-sm text-[#003E48]/60">Select the option that best describes you</p>

            <div className="mt-5 space-y-3">
                {OPTIONS.map(({ value, label, desc, Icon }) => {
                    const selected = data.joining_as === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange({ joining_as: value })}
                            className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                                selected
                                    ? 'border-[#E85A2E] bg-[#F6F3EE]'
                                    : 'border-transparent bg-white hover:border-[#003E48]/20'
                            }`}
                        >
                            <span className={`mt-0.5 flex-shrink-0 ${selected ? 'text-[#E85A2E]' : 'text-[#003E48]/40'}`}>
                                <Icon className="h-6 w-6" />
                            </span>
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${selected ? 'text-[#E85A2E]' : 'text-[#003E48]'}`}>
                                    {label}
                                </p>
                                <p className="mt-0.5 text-xs text-[#003E48]/55">{desc}</p>
                            </div>
                            <div
                                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                                    selected ? 'border-[#E85A2E] bg-[#E85A2E]' : 'border-[#003E48]/25'
                                }`}
                            >
                                {selected ? <div className="h-2 w-2 rounded-full bg-white" /> : null}
                            </div>
                        </button>
                    );
                })}
            </div>

            {errors.map((err) => (
                <p key={err} className="mt-3 text-sm font-medium text-red-500">
                    {err}
                </p>
            ))}
        </div>
    );
}

export default Step1JoiningAs;
