'use client';

import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { PreRegistrationPayload, Organization } from '@/lib/api/types';
import { organizationService } from '@/lib/api/services/organizations';
import TextInput from '@/app/components/inputs/TextInput';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

function Step2AboutYou({ data, errors, onChange }: Props) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [orgsLoading, setOrgsLoading] = useState(true);
    const [orgsError, setOrgsError] = useState('');
    const [showCustomOrganization, setShowCustomOrganization] = useState(
        () => Boolean(data.organization_other && !data.organization_id)
    );

    useEffect(() => {
        let cancelled = false;

        organizationService
            .list()
            .then((response) => {
                if (!cancelled) {
                    setOrganizations(response.data || []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setOrgsError('Could not load organizations. You can enter a custom name below.');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setOrgsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const errorFor = (field: string) => {
        const msg = errors.find((e) => e.toLowerCase().includes(field.toLowerCase()));
        return msg;
    };

    const organizationSelectValue = showCustomOrganization
        ? 'other'
        : data.organization_id
          ? String(data.organization_id)
          : '';

    const handleOrganizationChange = (value: string) => {
        if (value === 'other') {
            setShowCustomOrganization(true);
            onChange({
                organization_id: null,
                organization_other: data.organization_other || '',
            });
            return;
        }

        setShowCustomOrganization(false);

        if (value === '') {
            onChange({ organization_id: null, organization_other: null });
            return;
        }

        onChange({
            organization_id: Number(value),
            organization_other: null,
        });
    };

    const organizationError =
        errorFor('organization') ||
        errors.find((e) => e.toLowerCase().includes('custom organization'));

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">About you</h2>
            <p className="text-gray-500 text-sm mt-1">Tell us a little about yourself to create your profile</p>

            <div className="mt-5 space-y-1">
                <TextInput
                    label="Full Name *"
                    placeholder="e.g. Jane Doe"
                    value={data.full_name || ''}
                    errorMessage={errorFor('name')}
                    onChange={(v) => onChange({ full_name: v })}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path opacity=".4" d="M3.41 22c0-3.87 3.85-7 8.59-7s8.59 3.13 8.59 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </TextInput>

                <TextInput
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={data.date_of_birth || ''}
                    onChange={(v) => onChange({ date_of_birth: v })}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </TextInput>

                <TextInput
                    label="Phone Number *"
                    placeholder="+250 7XX XXX XXX"
                    type="tel"
                    value={data.phone_number || ''}
                    errorMessage={errorFor('phone')}
                    onChange={(v) => onChange({ phone_number: v })}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M21.97 18.33c0 .36-.08.71-.25 1.05-.17.34-.39.66-.68.96-.49.54-1.03.8-1.6.8-.41 0-.85-.1-1.32-.31s-.97-.5-1.47-.89c-.52-.41-1.01-.86-1.48-1.34L13.1 16.6c-.48-.48-.92-.97-1.33-1.47-.4-.5-.69-1-.89-1.49-.2-.49-.3-.96-.3-1.4 0-.42.09-.82.27-1.18.18-.36.45-.69.81-.99.36-.3.75-.44 1.16-.44.16 0 .32.03.47.09.15.06.29.15.4.28l3.48 4.91" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </TextInput>

                <TextInput
                    label="Email Address"
                    placeholder="jane@example.com"
                    type="email"
                    value={data.email || ''}
                    errorMessage={errorFor('email')}
                    onChange={(v) => onChange({ email: v })}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path opacity=".4" d="m16.999 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </TextInput>

                {/* Organization */}
                <div className="mt-5">
                    <label className="font-semibold text-slate-700 capitalize text-md">
                        Organization *
                    </label>
                    <div className="mt-2 relative text-gray-400 focus-within:text-gray-600 transition-all duration-200">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Building2 className="w-[18px] h-[18px]" />
                        </div>
                        <select
                            value={organizationSelectValue}
                            onChange={(e) => handleOrganizationChange(e.target.value)}
                            disabled={orgsLoading}
                            className={`block w-full py-3 pl-12 pr-4 transition-all duration-200 border rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600 appearance-none bg-no-repeat bg-[length:16px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%236b7280%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpath%20d=%27m6%209%206%206%206-6%27/%3e%3c/svg%3e')] ${
                                organizationError
                                    ? 'text-red-700 border-red-200 bg-red-50'
                                    : 'text-black border-gray-200 bg-gray-50'
                            }`}
                        >
                            <option value="">
                                {orgsLoading ? 'Loading organizations...' : 'Select your organization'}
                            </option>
                            {organizations.map((org) => (
                                <option key={org.id} value={org.id}>
                                    {org.name}
                                    {org.city ? ` (${org.city})` : ''}
                                </option>
                            ))}
                            <option value="other">Other (type custom name)</option>
                        </select>
                    </div>
                    {organizationError && (
                        <small className="text-red-500 font-semibold mt-2 flex items-center">
                            <span className="ml-2">{organizationError}</span>
                        </small>
                    )}
                    {orgsError && !organizationError && (
                        <p className="text-amber-600 text-xs mt-2">{orgsError}</p>
                    )}
                </div>

                {showCustomOrganization && (
                    <TextInput
                        label="Organization Name *"
                        placeholder="Enter your organization name"
                        value={data.organization_other || ''}
                        errorMessage={organizationError}
                        onChange={(v) => onChange({ organization_other: v, organization_id: null })}
                    >
                        <Building2 className="w-[18px] h-[18px]" />
                    </TextInput>
                )}

                <TextInput
                    label="City / Region"
                    placeholder="e.g. Kigali, Rwanda"
                    value={data.location || ''}
                    onChange={(v) => onChange({ location: v })}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </TextInput>
            </div>

            {errors.filter((e) => !['name', 'phone', 'email', 'organization', 'custom organization'].some((k) => e.toLowerCase().includes(k))).map((err) => (
                <p key={err} className="text-red-500 text-sm mt-2 font-medium">{err}</p>
            ))}
        </div>
    );
}

export default Step2AboutYou;
