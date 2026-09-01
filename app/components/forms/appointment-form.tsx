'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppointment } from '@/hooks';
import { ButtonSpinner } from '@/app/components/spinners';
import { organizationService, referralCoachService } from '@/lib/api';
import { Organization, ReferralCoach } from '@/lib/api/types';
import {
    COUNTRY_DIAL_CODE_OPTIONS,
    DEFAULT_COUNTRY_ISO2,
    countryOptionLabel,
    getCountryByIso2,
    getDefaultCountry,
} from '@/lib/country-codes';
import { formatFullPhone, isValidLocalPhone, phonePlaceholder } from '@/lib/phone';

const inputClass =
    'w-full h-12 px-4 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-[#003E48] focus:outline-none focus:ring-1 focus:ring-[#003E48]';

const labelClass = 'inline-block mb-1.5 text-sm font-medium text-slate-700';

const sectionTitleClass =
    'text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3';

function FormLabel({
    children,
    required = false,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className={labelClass}>
            {children}
            {required ? <span className="text-red-500 ml-0.5">*</span> : null}
        </label>
    );
}

function AppointmentForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCountryIso2, setPhoneCountryIso2] = useState(DEFAULT_COUNTRY_ISO2);
    const [phoneLocal, setPhoneLocal] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [coaches, setCoaches] = useState<ReferralCoach[]>([]);
    const [orgsLoading, setOrgsLoading] = useState(true);
    const [coachesLoading, setCoachesLoading] = useState(true);
    const [orgSelect, setOrgSelect] = useState('');
    const [organizationOther, setOrganizationOther] = useState('');
    const [showCustomOrganization, setShowCustomOrganization] = useState(false);
    const [selectedCoachCode, setSelectedCoachCode] = useState('');

    const { submitting, success, error, createAppointment, reset } = useAppointment();

    const selectedCountry = useMemo(
        () => getCountryByIso2(phoneCountryIso2) ?? getDefaultCountry(),
        [phoneCountryIso2],
    );

    const isValidEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const isFormValid = useMemo(
        () =>
            name.trim().length > 0 &&
            isValidEmail(email) &&
            isValidLocalPhone(phoneLocal, selectedCountry) &&
            type.length > 0 &&
            subject.trim().length > 0 &&
            message.trim().length > 0 &&
            appointmentDate.length > 0 &&
            appointmentTime.length > 0,
        [
            name,
            email,
            phoneLocal,
            selectedCountry,
            type,
            subject,
            message,
            appointmentDate,
            appointmentTime,
        ],
    );

    const selectedCoach = useMemo(
        () => coaches.find((c) => c.referral_code === selectedCoachCode) ?? null,
        [coaches, selectedCoachCode],
    );

    const filteredCoaches = useMemo(() => {
        if (!orgSelect || orgSelect === 'other') {
            return coaches;
        }
        const orgId = Number(orgSelect);
        return coaches.filter((c) => c.organization_id === orgId);
    }, [coaches, orgSelect]);

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
                    setOrganizations([]);
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

    useEffect(() => {
        let cancelled = false;
        setCoachesLoading(true);

        const orgId =
            orgSelect && orgSelect !== 'other' ? Number(orgSelect) : undefined;

        referralCoachService
            .list(orgId)
            .then((response) => {
                if (!cancelled) {
                    setCoaches(response.data || []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCoaches([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setCoachesLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [orgSelect]);

    useEffect(() => {
        if (
            selectedCoachCode &&
            !filteredCoaches.some((c) => c.referral_code === selectedCoachCode)
        ) {
            setSelectedCoachCode('');
        }
    }, [filteredCoaches, selectedCoachCode]);

    const handleOrganizationChange = (value: string) => {
        if (value === 'other') {
            setShowCustomOrganization(true);
            setOrgSelect('other');
            setSelectedCoachCode('');
            return;
        }

        setShowCustomOrganization(false);
        setOrganizationOther('');
        setOrgSelect(value);
        setSelectedCoachCode('');
    };

    const handleCoachChange = (code: string) => {
        setSelectedCoachCode(code);

        if (!code) return;

        const coach = coaches.find((c) => c.referral_code === code);
        if (coach?.organization_id) {
            setShowCustomOrganization(false);
            setOrganizationOther('');
            setOrgSelect(String(coach.organization_id));
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhoneCountryIso2(DEFAULT_COUNTRY_ISO2);
        setPhoneLocal('');
        setSubject('');
        setMessage('');
        setType('');
        setAppointmentDate('');
        setAppointmentTime('');
        setOrgSelect('');
        setOrganizationOther('');
        setShowCustomOrganization(false);
        setSelectedCoachCode('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name,
            email,
            phone: formatFullPhone(phoneLocal, selectedCountry),
            subject,
            reasons: 'Appointment',
            message,
            type,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            referral_code: selectedCoachCode || null,
            organization_id:
                !selectedCoachCode && orgSelect && orgSelect !== 'other'
                    ? Number(orgSelect)
                    : null,
            organization_other:
                !selectedCoachCode && showCustomOrganization
                    ? organizationOther.trim() || null
                    : null,
        };

        const isSuccess = await createAppointment(payload);

        if (isSuccess) {
            resetForm();
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                reset();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, reset]);

    const timeSlots = (() => {
        const startHour = 8;
        const endHour = 20;
        const now = new Date();
        let minTime = `${String(startHour).padStart(2, '0')}:00`;

        if (appointmentDate && appointmentDate === now.toISOString().split('T')[0]) {
            const currentMinutes = now.getMinutes();
            let nextHour = now.getHours();
            let nextMinutes = 0;
            if (currentMinutes < 30) {
                nextMinutes = 30;
            } else {
                nextHour += 1;
                nextMinutes = 0;
            }
            if (nextHour < startHour) nextHour = startHour;
            if (nextHour > endHour) nextHour = endHour;
            minTime = `${String(nextHour).padStart(2, '0')}:${nextMinutes === 0 ? '00' : '30'}`;
        }

        const slots: string[] = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            for (const min of [0, 30]) {
                if (hour === endHour && min > 0) continue;
                const value = `${String(hour).padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
                if (value >= minTime) {
                    slots.push(value);
                }
            }
        }
        return slots;
    })();

    return (
        <div className="relative bg-white rounded-xl shadow-2xl p-6 sm:p-10 text-slate-700 w-full md:max-w-2xl mx-auto">
            <h3 className="mb-2 text-xl font-semibold text-[#003E48] sm:text-center sm:text-2xl">
                Book Your Appointment
            </h3>
            <p className="mb-6 text-sm text-slate-500 sm:text-center">
                Tell us a bit about yourself and when you&apos;d like to visit. Referral details are optional.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section>
                    <h4 className={sectionTitleClass}>Your details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <FormLabel required>Name</FormLabel>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                type="text"
                                className={inputClass}
                                required
                                maxLength={255}
                            />
                        </div>
                        <div>
                            <FormLabel required>E-mail</FormLabel>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john.doe@example.org"
                                type="email"
                                className={inputClass}
                                required
                                maxLength={255}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <FormLabel required>Phone</FormLabel>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <select
                                    value={phoneCountryIso2}
                                    onChange={(e) => setPhoneCountryIso2(e.target.value)}
                                    className={`${inputClass} sm:w-[11.5rem] sm:shrink-0`}
                                    aria-label="Country code"
                                >
                                    {COUNTRY_DIAL_CODE_OPTIONS.map((country) => (
                                        <option key={country.iso2} value={country.iso2}>
                                            {countryOptionLabel(country)}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    value={phoneLocal}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (selectedCountry.iso2 === 'RW' && value.startsWith('0')) {
                                            value = value.slice(1);
                                        }
                                        setPhoneLocal(value);
                                    }}
                                    placeholder={phonePlaceholder(selectedCountry)}
                                    type="tel"
                                    inputMode="numeric"
                                    className={`${inputClass} sm:flex-1 sm:min-w-0`}
                                    required
                                    maxLength={selectedCountry.iso2 === 'RW' ? 9 : 15}
                                />
                            </div>
                            {phoneLocal && !isValidLocalPhone(phoneLocal, selectedCountry) ? (
                                <p className="mt-1 text-xs text-red-500">
                                    {selectedCountry.iso2 === 'RW'
                                        ? 'Enter a valid number starting with 78, 72, 73, or 79 (without the leading 0).'
                                        : 'Enter a valid phone number for the selected country.'}
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <FormLabel required>Type / Services</FormLabel>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className={inputClass}
                                required
                            >
                                <option value="" disabled>
                                    Select Type / Service
                                </option>
                                <option value="CONSULTATION">Consultation</option>
                                <option value="DIABETES_COUNSELLING">
                                    Nutrition counselling for Diabetes (Type 1 &amp; Type 2)
                                </option>
                                <option value="HYPERTENSION_COUNSELLING">
                                    Nutrition counselling for Hypertension (High Blood Pressure)
                                </option>
                                <option value="CARDIOVASCULAR_COUNSELLING">
                                    Nutrition counselling for Cardiovascular Disease
                                </option>
                                <option value="WEIGHT_MANAGEMENT">
                                    Weight Management Programs (Weight Loss &amp; Weight Gain)
                                </option>
                                <option value="MEAL_PLANS">Personalized Meal Plans</option>
                                <option value="WELLNESS_PROGRAMS">
                                    Workplace &amp; Institutional Wellness Programs
                                </option>
                                <option value="LIFESTYLE_COACHING">Lifestyle Coaching &amp; Education</option>
                                <option value="MATERNAL_CHILD_NUTRITION">Maternal &amp; Child Nutrition</option>
                                <option value="SPECIAL_POPULATIONS">Nutrition for Special Populations</option>
                                <option value="SUPPLEMENT_GUIDANCE">Dietary Supplement Guidance</option>
                                <option value="BUSINESS">Business</option>
                                <option value="PERSONAL">Personal</option>
                                <option value="MEDICAL">Medical</option>
                                <option value="GENERAL">General</option>
                                <option value="FOLLOW_UP">Follow up</option>
                                <option value="EMERGENCY">Emergency</option>
                                <option value="CHECKUP">Checkup</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-3">
                        <FormLabel required>Subject</FormLabel>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject"
                            type="text"
                            className={inputClass}
                            required
                            maxLength={255}
                        />
                    </div>

                    <div className="mt-3">
                        <FormLabel required>Message</FormLabel>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a message..."
                            className="w-full min-h-[5.5rem] px-4 py-3 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-[#003E48] focus:outline-none focus:ring-1 focus:ring-[#003E48]"
                            required
                            maxLength={1000}
                        />
                    </div>
                </section>

                <section>
                    <h4 className={sectionTitleClass}>Appointment</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <FormLabel required>Appointment Date</FormLabel>
                            <input
                                value={appointmentDate}
                                onChange={(e) => {
                                    setAppointmentDate(e.target.value);
                                    setAppointmentTime('');
                                }}
                                type="date"
                                className={inputClass}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <FormLabel required>Appointment Time</FormLabel>
                            <select
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                className={inputClass}
                                required
                                disabled={!appointmentDate}
                            >
                                <option value="" disabled>
                                    Select Time
                                </option>
                                {timeSlots.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                    <h4 className={sectionTitleClass}>How did you find us? (optional)</h4>
                    <p className="text-xs text-slate-500 mb-3">
                        Select your gym, workplace, or coach so we can credit them. You can skip this
                        section if you are booking on your own.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <FormLabel>Organization / Institution</FormLabel>
                            <select
                                value={showCustomOrganization ? 'other' : orgSelect}
                                onChange={(e) => handleOrganizationChange(e.target.value)}
                                className={inputClass}
                                disabled={orgsLoading}
                            >
                                <option value="">
                                    {orgsLoading ? 'Loading organizations…' : 'Select organization (optional)'}
                                </option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={String(org.id)}>
                                        {org.name}
                                    </option>
                                ))}
                                <option value="other">Other (type name)</option>
                            </select>
                        </div>

                        <div>
                            <FormLabel>Coach / Referral source</FormLabel>
                            <select
                                value={selectedCoachCode}
                                onChange={(e) => handleCoachChange(e.target.value)}
                                className={inputClass}
                                disabled={coachesLoading}
                            >
                                <option value="">
                                    {coachesLoading
                                        ? 'Loading coaches…'
                                        : filteredCoaches.length === 0
                                          ? 'No coaches available (optional)'
                                          : 'Select coach (optional)'}
                                </option>
                                {filteredCoaches.map((coach) => (
                                    <option key={coach.id} value={coach.referral_code}>
                                        {coach.first_name} · {coach.referral_code}
                                    </option>
                                ))}
                            </select>
                            {orgSelect && orgSelect !== 'other' && filteredCoaches.length === 0 && !coachesLoading && (
                                <p className="mt-1 text-xs text-slate-500">
                                    No coaches linked to this organization yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {showCustomOrganization && (
                        <div className="mt-3">
                            <FormLabel>Institution name</FormLabel>
                            <input
                                value={organizationOther}
                                onChange={(e) => setOrganizationOther(e.target.value)}
                                placeholder="Enter institution name"
                                type="text"
                                className={inputClass}
                                maxLength={255}
                            />
                        </div>
                    )}

                    {selectedCoach && (
                        <div className="mt-3 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">
                            Referred by{' '}
                            <span className="font-semibold">{selectedCoach.first_name}</span>
                            {selectedCoach.organization_name ? (
                                <> · {selectedCoach.organization_name}</>
                            ) : null}
                        </div>
                    )}
                </section>

                <div>
                    <button
                        type="submit"
                        className="relative cursor-pointer inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded bg-gradient-to-b from-[#003E48] to-[#282e33] focus:shadow-outline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting || !isFormValid}
                    >
                        {submitting ? <ButtonSpinner loadingText="Booking" /> : 'Book Appointment'}
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 font-normal">{error}</p>}
                {success && <p className="text-sm text-green-600 font-normal">{success}</p>}
            </form>
        </div>
    );
}

export default AppointmentForm;
