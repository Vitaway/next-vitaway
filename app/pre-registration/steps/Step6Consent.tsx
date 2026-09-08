'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';
import { RequiredMark } from '@/app/components/inputs/FormLabel';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
    hideHeader?: boolean;
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

function Step6Consent({ data, errors, onChange, hideHeader = false }: Props) {
    return (
        <div>
            {hideHeader ? null : (
                <>
                    <h2 className="text-xl font-bold text-[#003E48]">Review & <span className="font-accent">consent</span></h2>
                    <p className="mt-1 text-sm text-[#003E48]/60">
                        Please read and acknowledge each required item before submitting
                    </p>
                </>
            )}

            <div className={hideHeader ? 'space-y-2' : 'mt-5 space-y-3'}>
                {CONSENTS.map(({ field, title, description }) => {
                    const checked = !!data[field];
                    return (
                        <button
                            key={field}
                            type="button"
                            onClick={() => onChange({ [field]: !checked })}
                            className={`flex w-full items-start gap-4 rounded-[24px] border p-4 text-left transition-all duration-150 active:scale-[0.99] ${
                                checked
                                    ? 'border-[#003E48] bg-white'
                                    : 'border-transparent bg-white hover:border-[#003E48]/20'
                            }`}
                        >
                            <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                                checked
                                    ? 'border-[#003E48] bg-[#003E48]'
                                    : 'border-[#003E48]/25'
                            }`}>
                                {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                            </div>
                            <div>
                                <p className={`text-sm font-semibold ${checked ? 'text-[#003E48]' : 'text-[#003E48]/80'}`}>
                                    <RequiredMark />
                                    {title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-[#003E48]/55">
                                    {description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {errors.length > 0 && (
                <div className="mt-4 rounded-[24px] border border-red-200 bg-red-50 p-3">
                    {errors.map((err) => (
                        <p key={err} className="text-sm font-medium text-red-600">{err}</p>
                    ))}
                </div>
            )}

            <p className="mt-4 text-center text-xs leading-relaxed text-[#003E48]/45">
                By submitting this form, you confirm that all information provided is accurate and complete to the best of your knowledge.
            </p>
        </div>
    );
}

export default Step6Consent;
