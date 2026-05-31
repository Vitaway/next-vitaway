'use client';

import React from 'react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

const CONSENTS: {
    field: keyof Pick<PreRegistrationPayload,
        'consent_privacy_policy' | 'consent_data_usage' |
        'consent_health_information' | 'consent_wellness_program'>;
    title: string;
    description: string;
}[] = [
    {
        field: 'consent_privacy_policy',
        title: 'Privacy Policy',
        description: 'I have read and agree to Vitaway\'s Privacy Policy, which describes how my personal data is collected, stored, and processed.',
    },
    {
        field: 'consent_data_usage',
        title: 'Data Usage Terms',
        description: 'I consent to Vitaway using my data to provide personalised wellness services, send relevant health information, and improve the platform.',
    },
    {
        field: 'consent_health_information',
        title: 'Health Information Handling',
        description: 'I understand that health information I provide will be accessed by qualified Vitaway nutrition professionals solely for the purpose of my care.',
    },
    {
        field: 'consent_wellness_program',
        title: 'Wellness Programme Participation',
        description: 'I consent to participate in Vitaway\'s wellness programme and understand that the guidance provided is not a substitute for professional medical advice.',
    },
];

function Step6Consent({ data, errors, onChange }: Props) {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">Review & consent</h2>
            <p className="text-gray-500 text-sm mt-1">
                Please read and acknowledge each item before submitting
            </p>

            <div className="mt-5 space-y-3">
                {CONSENTS.map(({ field, title, description }) => {
                    const checked = !!data[field];
                    return (
                        <button
                            key={field}
                            type="button"
                            onClick={() => onChange({ [field]: !checked })}
                            className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-150 active:scale-[0.99] ${
                                checked
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                                checked
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                            }`}>
                                {checked && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className={`font-semibold text-sm ${checked ? 'text-green-700' : 'text-slate-700'}`}>
                                    {title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    {errors.map((err) => (
                        <p key={err} className="text-red-600 text-sm font-medium">{err}</p>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
                By submitting this form, you confirm that all information provided is accurate and complete to the best of your knowledge.
            </p>
        </div>
    );
}

export default Step6Consent;
