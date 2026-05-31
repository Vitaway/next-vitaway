'use client';

import React from 'react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors?: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

const COMMUNICATION: { value: PreRegistrationPayload['preferred_communication']; label: string; icon: string }[] = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'phone', label: 'Phone Call', icon: '📞' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { value: 'sms', label: 'SMS', icon: '📱' },
];

const APPOINTMENT: { value: PreRegistrationPayload['appointment_preference']; label: string; icon: string }[] = [
    { value: 'morning', label: 'Morning', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { value: 'evening', label: 'Evening', icon: '🌇' },
];

const DIETARY = [
    { value: 'no_preference', label: 'No Preference' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'halal', label: 'Halal' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'dairy_free', label: 'Dairy-Free' },
    { value: 'low_carb', label: 'Low-Carb' },
    { value: 'keto', label: 'Keto' },
];

function Step5Preferences({ data, onChange }: Props) {
    const dietary = data.dietary_preferences || [];

    const toggleDiet = (value: string) => {
        if (value === 'no_preference') {
            onChange({ dietary_preferences: ['no_preference'] });
            return;
        }
        const filtered = dietary.filter((d) => d !== 'no_preference');
        const updated = filtered.includes(value)
            ? filtered.filter((d) => d !== value)
            : [...filtered, value];
        onChange({ dietary_preferences: updated });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Your preferences</h2>
                <p className="text-gray-500 text-sm mt-1">Help us connect with you in the way that works best</p>
            </div>

            {/* Communication */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Preferred way to contact you</p>
                <div className="grid grid-cols-2 gap-2">
                    {COMMUNICATION.map(({ value, label, icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange({ preferred_communication: value })}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.97] ${
                                data.preferred_communication === value
                                    ? 'border-[#003E48] bg-[#003E48]/5'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <span className="text-xl">{icon}</span>
                            <span className={`text-sm font-semibold ${data.preferred_communication === value ? 'text-[#003E48]' : 'text-slate-600'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointment preference */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Preferred appointment time</p>
                <div className="grid grid-cols-3 gap-2">
                    {APPOINTMENT.map(({ value, label, icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange({ appointment_preference: value })}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all active:scale-[0.97] ${
                                data.appointment_preference === value
                                    ? 'border-[#003E48] bg-[#003E48]/5'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <span className="text-2xl">{icon}</span>
                            <span className={`text-xs font-semibold ${data.appointment_preference === value ? 'text-[#003E48]' : 'text-slate-600'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dietary preferences */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Dietary preferences</p>
                <div className="grid grid-cols-2 gap-2">
                    {DIETARY.map(({ value, label }) => {
                        const selected = dietary.includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => toggleDiet(value)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all active:scale-[0.97] ${
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
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Step5Preferences;
