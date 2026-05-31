'use client';

import React from 'react';
import { Mail, Phone, MessageCircle, MessageSquare, Sunrise, Sun, Sunset, Check } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';

interface Props {
    data: Partial<PreRegistrationPayload>;
    errors?: string[];
    onChange: (data: Partial<PreRegistrationPayload>) => void;
}

const COMMUNICATION: {
    value: PreRegistrationPayload['preferred_communication'];
    label: string;
    icon: React.ReactNode;
}[] = [
    { value: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
    { value: 'phone', label: 'Phone Call', icon: <Phone className="w-5 h-5" /> },
    { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" /> },
    { value: 'sms', label: 'SMS', icon: <MessageSquare className="w-5 h-5" /> },
];

const APPOINTMENT: {
    value: PreRegistrationPayload['appointment_preference'];
    label: string;
    icon: React.ReactNode;
}[] = [
    { value: 'morning', label: 'Morning', icon: <Sunrise className="w-6 h-6" /> },
    { value: 'afternoon', label: 'Afternoon', icon: <Sun className="w-6 h-6" /> },
    { value: 'evening', label: 'Evening', icon: <Sunset className="w-6 h-6" /> },
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
                    {COMMUNICATION.map(({ value, label, icon }) => {
                        const selected = data.preferred_communication === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onChange({ preferred_communication: value })}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.97] ${
                                    selected
                                        ? 'border-[#003E48] bg-[#003E48]/5'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <span className={selected ? 'text-[#003E48]' : 'text-gray-400'}>{icon}</span>
                                <span className={`text-sm font-semibold ${selected ? 'text-[#003E48]' : 'text-slate-600'}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Appointment preference */}
            <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Preferred appointment time</p>
                <div className="grid grid-cols-3 gap-2">
                    {APPOINTMENT.map(({ value, label, icon }) => {
                        const selected = data.appointment_preference === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onChange({ appointment_preference: value })}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all active:scale-[0.97] ${
                                    selected
                                        ? 'border-[#003E48] bg-[#003E48]/5'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <span className={selected ? 'text-[#003E48]' : 'text-gray-400'}>{icon}</span>
                                <span className={`text-xs font-semibold ${selected ? 'text-[#003E48]' : 'text-slate-600'}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
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
                                    {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
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
