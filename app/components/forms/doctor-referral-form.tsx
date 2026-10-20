'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    doctorReferralService,
    nearAppointmentFromError,
    type DoctorReferralResult,
    type NearAppointmentError,
    type ResolvedDoctor,
} from '@/lib/api/services/doctorReferrals';
import { APIError } from '@/lib/api/client';
import BookingActionButton from '@/app/components/buttons/booking-action-button';
import DatePicker from '@/app/components/inputs/DatePicker';
import LineSelect from '@/app/components/inputs/LineSelect';
import {
    COUNTRY_DIAL_CODE_OPTIONS,
    DEFAULT_COUNTRY_ISO2,
    getCountryByIso2,
    getDefaultCountry,
} from '@/lib/country-codes';
import { formatFullPhone, isValidLocalPhone, phonePlaceholder } from '@/lib/phone';
import { buildTimeSlots, earliestBookableDate, isSlotBookable } from '@/lib/appointment-slots';
import { fetchDayAvailability } from '@/lib/api/services/appointment-availability';
import { isOnline, offlineBookingMessage } from '@/lib/online';
import {
    bookingInputClass,
    bookingPhoneShellClass,
} from '@/app/components/forms/booking-field-styles';

const REASONS = [
    'Diabetes',
    'High blood pressure',
    'Weight management',
    'Pregnancy / breastfeeding',
    'Child nutrition',
    'Kidney disease',
    'High cholesterol',
    'Other',
] as const;

const inputClass = bookingInputClass;

function FormLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-1.5 inline-block text-sm text-[#003E48]/70">
            {children}
            {required ? <span className="text-[#c23b2e]"> *</span> : null}
        </label>
    );
}

type Props = {
    isModal?: boolean;
    onBack: () => void;
    onClose?: () => void;
    onDone?: () => void;
};

type IdentityMode = 'code' | 'manual';

export default function DoctorReferralForm({ isModal, onBack, onClose, onDone }: Props) {
    const [step, setStep] = useState<'identity' | 'patient' | 'done'>('identity');
    const [identityMode, setIdentityMode] = useState<IdentityMode>('code');

    const [code, setCode] = useState('');
    const [doctor, setDoctor] = useState<ResolvedDoctor | null>(null);
    const [resolving, setResolving] = useState(false);
    const [codeError, setCodeError] = useState('');

    const [doctorName, setDoctorName] = useState('');
    const [doctorClinic, setDoctorClinic] = useState('');
    const [doctorPhone, setDoctorPhone] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCountryIso2, setPhoneCountryIso2] = useState(DEFAULT_COUNTRY_ISO2);
    const [phoneLocal, setPhoneLocal] = useState('');
    const [reason, setReason] = useState('');
    const [reasonOther, setReasonOther] = useState('');
    const [consent, setConsent] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [freeTimes, setFreeTimes] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState('');
    const [formError, setFormError] = useState('');
    const [nearNotice, setNearNotice] = useState<NearAppointmentError | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<DoctorReferralResult | null>(null);

    const selectedCountry = useMemo(
        () => getCountryByIso2(phoneCountryIso2) ?? getDefaultCountry(),
        [phoneCountryIso2],
    );
    const timeSlots = useMemo(
        () => (slotsLoading ? [] : buildTimeSlots(appointmentDate, freeTimes)),
        [appointmentDate, freeTimes, slotsLoading],
    );
    const minDate = useMemo(() => earliestBookableDate(), []);
    const maxDate = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d;
    }, []);

    useEffect(() => {
        if (!appointmentDate) {
            setFreeTimes([]);
            setSlotsError('');
            return;
        }
        let cancelled = false;
        setSlotsLoading(true);
        setSlotsError('');
        setFreeTimes([]);
        fetchDayAvailability(appointmentDate)
            .then((times) => {
                if (!cancelled) setFreeTimes(times);
            })
            .catch(() => {
                if (!cancelled) {
                    setFreeTimes([]);
                    setSlotsError('Could not load free times. Check your connection and try another day.');
                }
            })
            .finally(() => {
                if (!cancelled) setSlotsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [appointmentDate]);

    useEffect(() => {
        if (!appointmentTime || timeSlots.includes(appointmentTime)) return;
        setAppointmentTime('');
    }, [appointmentTime, timeSlots]);

    useEffect(() => {
        if (identityMode !== 'code') return;
        const trimmed = code.trim().toUpperCase().replace(/^DR-/, '');
        if (trimmed.length < 3) {
            setDoctor(null);
            setCodeError('');
            return;
        }
        let cancelled = false;
        const timer = window.setTimeout(() => {
            setResolving(true);
            setCodeError('');
            doctorReferralService
                .resolve(trimmed)
                .then((row) => {
                    if (cancelled) return;
                    setDoctor(row);
                    setCode(row.code);
                })
                .catch((err: unknown) => {
                    if (cancelled) return;
                    setDoctor(null);
                    setCodeError(
                        err instanceof APIError
                            ? err.message
                            : 'Ask Vitaway for your referral code.',
                    );
                })
                .finally(() => {
                    if (!cancelled) setResolving(false);
                });
        }, 350);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [code, identityMode]);

    function identityReady() {
        if (identityMode === 'code') return Boolean(doctor) && !resolving;
        return doctorName.trim().length >= 2;
    }

    function referringAsLabel() {
        if (identityMode === 'code' && doctor) {
            return doctor.clinic_name ? `${doctor.full_name} · ${doctor.clinic_name}` : doctor.full_name;
        }
        return doctorClinic.trim()
            ? `${doctorName.trim()} · ${doctorClinic.trim()}`
            : doctorName.trim();
    }

    async function submitReferral(confirmNear = false) {
        if (identityMode === 'code' && !doctor) {
            setFormError('Enter a valid doctor referral code first.');
            return;
        }
        if (identityMode === 'manual' && doctorName.trim().length < 2) {
            setFormError('Enter your name.');
            return;
        }
        if (name.trim().length < 2) {
            setFormError("Enter the client's name.");
            return;
        }
        if (!isValidLocalPhone(phoneLocal, selectedCountry)) {
            setFormError(
                selectedCountry.iso2 === 'RW'
                    ? 'Use a Rwandan mobile number, like 78XXXXXXX.'
                    : 'Add a phone number we can reach.',
            );
            return;
        }
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setFormError('Check the email, or leave it empty.');
            return;
        }
        if (!reason) {
            setFormError('Choose a reason for the appointment.');
            return;
        }
        if (reason === 'Other' && !reasonOther.trim()) {
            setFormError('Write the reason.');
            return;
        }
        if (!appointmentDate || !appointmentTime || !isSlotBookable(appointmentDate, appointmentTime)) {
            setFormError('Pick a free day and time for the client.');
            return;
        }
        if (!consent) {
            setFormError('Confirm the client agreed that Vitaway can contact them.');
            return;
        }

        setFormError('');
        setNearNotice(null);
        if (!isOnline()) {
            setFormError(offlineBookingMessage());
            return;
        }
        setSubmitting(true);
        try {
            const created = await doctorReferralService.create({
                ...(identityMode === 'code' && doctor
                    ? { doctor_code: doctor.code }
                    : {
                          doctor_name: doctorName.trim(),
                          doctor_clinic: doctorClinic.trim() || undefined,
                          doctor_phone: doctorPhone.trim() || undefined,
                      }),
                patient_name: name.trim(),
                patient_phone: formatFullPhone(phoneLocal, selectedCountry),
                patient_email: email.trim() || undefined,
                reason,
                reason_other: reason === 'Other' ? reasonOther.trim() : undefined,
                consent: true,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                confirm_near: confirmNear,
            });
            setResult(created);
            setStep('done');
            if (isModal) {
                window.setTimeout(() => onClose?.(), 1600);
            }
        } catch (err: unknown) {
            const near = nearAppointmentFromError(err);
            if (near) {
                setNearNotice(near);
                return;
            }
            setFormError(err instanceof APIError ? err.message : 'Could not book the referral. Try again.');
        } finally {
            setSubmitting(false);
        }
    }

    function clearSelectedDoctor() {
        setDoctor(null);
        setCode('');
        setCodeError('');
    }

    if (step === 'done' && result) {
        return (
            <div className="space-y-5">
                <div>
                    <h2 className="font-display text-2xl font-semibold text-[#003E48]">Visit booked</h2>
                    <p className="mt-2 text-sm text-[#003E48]/70">
                        {result.patient_name} is confirmed
                        {result.when_label ? ` for ${result.when_label}` : ''}. We also send email and SMS.
                    </p>
                </div>
                <dl className="space-y-3 rounded-[22px] bg-[#F6F3EE] p-4 text-sm sm:p-5">
                    {[
                        { label: 'Client', value: result.patient_name },
                        { label: 'When', value: result.when_label || '—' },
                        { label: 'Reason', value: result.reason },
                        {
                            label: 'Doctor',
                            value: result.doctor_clinic
                                ? `${result.doctor_name} · ${result.doctor_clinic}`
                                : result.doctor_name,
                        },
                        { label: 'Reference', value: result.reference },
                    ].map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-4">
                            <dt className="text-[#003E48]/50">{row.label}</dt>
                            <dd className="max-w-[70%] text-right font-semibold text-[#003E48]">{row.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <BookingActionButton
                        type="button"
                        tone="white"
                        icon="arrow"
                        onClick={() => {
                            setStep('identity');
                            setCode(doctor?.code ?? '');
                            setDoctorName('');
                            setDoctorClinic('');
                            setDoctorPhone('');
                            setName('');
                            setEmail('');
                            setPhoneLocal('');
                            setReason('');
                            setReasonOther('');
                            setConsent(false);
                            setAppointmentDate('');
                            setAppointmentTime('');
                            setNearNotice(null);
                            setResult(null);
                            setFormError('');
                        }}
                    >
                        Refer another patient
                    </BookingActionButton>
                    <BookingActionButton
                        type="button"
                        icon="check"
                        onClick={() => {
                            if (isModal) onClose?.();
                            else onDone?.();
                        }}
                    >
                        {isModal ? 'Close' : 'Done'}
                    </BookingActionButton>
                </div>
            </div>
        );
    }

    if (step === 'identity') {
        return (
            <div className="space-y-5">
                <div>
                    <h2 className="font-display text-2xl font-semibold text-[#003E48]">Who is referring?</h2>
                    <p className="mt-2 text-sm text-[#003E48]/70">
                        Use your Vitaway code if you have one. If you forgot it, enter your details instead.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setIdentityMode('code');
                            setCodeError('');
                        }}
                        className={`rounded-[6px] px-4 py-3 text-sm font-semibold transition ${
                            identityMode === 'code' ? 'bg-[#003E48] text-white' : 'bg-[#F6F3EE] text-[#003E48]'
                        }`}
                    >
                        I have my code
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIdentityMode('manual');
                            setDoctor(null);
                            setCodeError('');
                        }}
                        className={`rounded-[6px] px-4 py-3 text-sm font-semibold transition ${
                            identityMode === 'manual' ? 'bg-[#003E48] text-white' : 'bg-[#F6F3EE] text-[#003E48]'
                        }`}
                    >
                        I forgot my code
                    </button>
                </div>

                {identityMode === 'code' ? (
                    <div>
                        <FormLabel required>Doctor code</FormLabel>
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className={`${inputClass} font-mono tracking-wide`}
                            placeholder="XXXX"
                            autoComplete="off"
                            spellCheck={false}
                        />
                        {resolving ? (
                            <p className="mt-2 text-sm text-[#003E48]/60">Checking…</p>
                        ) : codeError ? (
                            <p className="mt-2 text-sm font-medium text-[#E85A2E]">{codeError}</p>
                        ) : null}
                        {doctor ? (
                            <label className="mt-3 flex cursor-pointer items-start gap-3 border-b border-[#d5d1c8] pb-3">
                                <input
                                    type="checkbox"
                                    checked
                                    onChange={(e) => {
                                        if (!e.target.checked) clearSelectedDoctor();
                                    }}
                                    className="mt-1 h-4 w-4 accent-[#003E48]"
                                />
                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-[#003E48]">{doctor.full_name}</span>
                                    {doctor.clinic_name ? (
                                        <span className="block text-sm text-[#003E48]/65">{doctor.clinic_name}</span>
                                    ) : null}
                                    <span className="mt-0.5 block font-mono text-xs text-[#003E48]/50">{doctor.code}</span>
                                </span>
                            </label>
                        ) : null}
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <FormLabel required>Your name</FormLabel>
                            <input
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                                className={inputClass}
                                placeholder="Dr Aline Mukamana"
                                autoComplete="name"
                            />
                        </div>
                        <div>
                            <FormLabel>Clinic / hospital</FormLabel>
                            <input
                                value={doctorClinic}
                                onChange={(e) => setDoctorClinic(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <FormLabel>Your phone</FormLabel>
                            <input
                                value={doctorPhone}
                                onChange={(e) => setDoctorPhone(e.target.value)}
                                className={inputClass}
                                inputMode="tel"
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <BookingActionButton type="button" tone="white" icon="back" onClick={onBack}>
                        Back
                    </BookingActionButton>
                    <BookingActionButton
                        type="button"
                        disabled={!identityReady()}
                        onClick={() => setStep('patient')}
                    >
                        Continue
                    </BookingActionButton>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-display text-2xl font-semibold text-[#003E48]">Client details</h2>
                <p className="mt-2 text-sm text-[#003E48]/70">Referring as {referringAsLabel()}.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <FormLabel required>Client name</FormLabel>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <FormLabel required>Client phone</FormLabel>
                    <div className={bookingPhoneShellClass}>
                        <div className="w-[5.5rem] shrink-0">
                            <LineSelect
                                bare
                                label="Country code"
                                value={phoneCountryIso2}
                                onChange={setPhoneCountryIso2}
                                searchable
                                placeholder="+250"
                                triggerClassName="h-11 border-b-0 pr-1 text-[12px] font-semibold text-[#003E48]/70"
                                options={COUNTRY_DIAL_CODE_OPTIONS.map((c) => ({
                                    value: c.iso2,
                                    label: `+${c.dialCode}`,
                                    hint: c.name,
                                }))}
                            />
                        </div>
                        <span aria-hidden className="my-2.5 w-px bg-[#e4ddd2]" />
                        <input
                            value={phoneLocal}
                            onChange={(e) => setPhoneLocal(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent pl-3 text-sm text-[#003E48] outline-none placeholder:text-[#003E48]/35"
                            placeholder={phonePlaceholder(selectedCountry)}
                            inputMode="tel"
                        />
                    </div>
                </div>
                <div>
                    <FormLabel>Client email</FormLabel>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        type="email"
                        inputMode="email"
                    />
                </div>
                <div className="sm:col-span-2">
                    <LineSelect
                        label="Reason for appointment"
                        required
                        value={reason}
                        onChange={setReason}
                        placeholder="Choose a reason"
                        options={REASONS.map((r) => ({ value: r, label: r }))}
                    />
                </div>
                {reason === 'Other' ? (
                    <div className="sm:col-span-2">
                        <FormLabel required>Write the reason</FormLabel>
                        <input
                            value={reasonOther}
                            onChange={(e) => setReasonOther(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                ) : null}
                <div>
                    <DatePicker
                        className="mt-0"
                        label="Preferred day"
                        required
                        value={appointmentDate}
                        placeholder="Select a day"
                        defaultViewYearsAgo={0}
                        minDate={minDate}
                        maxDate={maxDate}
                        fieldStyle="line"
                        onChange={(v) => {
                            setAppointmentDate(v);
                            setAppointmentTime('');
                        }}
                    />
                </div>
                <div>
                    <LineSelect
                        label="Preferred time"
                        required
                        value={appointmentTime}
                        onChange={setAppointmentTime}
                        disabled={!appointmentDate || slotsLoading}
                        placeholder={
                            !appointmentDate
                                ? 'Pick a day first'
                                : slotsLoading
                                  ? 'Loading free times…'
                                  : timeSlots.length
                                    ? 'Select a time'
                                    : 'No free times left'
                        }
                        options={timeSlots.map((value) => ({ value, label: value }))}
                    />
                    {slotsError ? (
                        <p className="mt-1.5 text-xs font-medium text-[#E85A2E]">{slotsError}</p>
                    ) : null}
                </div>
            </div>
            <label className="flex cursor-pointer gap-3 border-b border-[#d5d1c8] py-3 text-sm text-[#003E48]">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#E85A2E]"
                />
                <span>The client agreed that Vitaway can contact them by phone, WhatsApp and email.</span>
            </label>
            {formError ? <p className="text-sm font-medium text-[#E85A2E]">{formError}</p> : null}
            {nearNotice ? (
                <div className="space-y-3 border border-[#E85A2E]/25 bg-[#FFF7F3] px-4 py-3 text-sm text-[#003E48]">
                    <p>{nearNotice.message}</p>
                    {nearNotice.when_label ? (
                        <p className="font-semibold">Existing visit: {nearNotice.when_label}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                        <BookingActionButton
                            type="button"
                            size="sm"
                            loading={submitting}
                            onClick={() => void submitReferral(true)}
                        >
                            Book anyway
                        </BookingActionButton>
                        <BookingActionButton
                            type="button"
                            size="sm"
                            tone="white"
                            icon="close"
                            disabled={submitting}
                            onClick={() => setNearNotice(null)}
                        >
                            Reschedule
                        </BookingActionButton>
                    </div>
                </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <BookingActionButton type="button" tone="white" icon="back" onClick={() => setStep('identity')}>
                    Back
                </BookingActionButton>
                <BookingActionButton
                    type="button"
                    icon="check"
                    loading={submitting}
                    disabled={submitting}
                    onClick={() => void submitReferral(false)}
                >
                    {submitting ? 'Booking…' : 'Book visit'}
                </BookingActionButton>
            </div>
        </div>
    );
}
