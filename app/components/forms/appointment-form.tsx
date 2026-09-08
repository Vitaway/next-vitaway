'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppointment } from '@/hooks';
import { ButtonSpinner } from '@/app/components/spinners';
import { organizationService, referralCoachService } from '@/lib/api';
import { Organization, ReferralCoach } from '@/lib/api/types';
import {
    COUNTRY_DIAL_CODE_OPTIONS,
    DEFAULT_COUNTRY_ISO2,
    getCountryByIso2,
    getDefaultCountry,
} from '@/lib/country-codes';
import { formatFullPhone, isValidLocalPhone, phonePlaceholder } from '@/lib/phone';
import DatePicker from '@/app/components/inputs/DatePicker';
import PressButton from '@/app/components/buttons/press-button';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BookingDraft, BookingMode } from '@/app/components/booking/booking-context';
import Logo from '@/app/components/logo';
import { buildTimeSlots, earliestBookableDate, isSlotBookable } from '@/lib/appointment-slots';

const inputClass =
    'w-full h-12 px-4 font-normal transition duration-200 bg-[#F6F3EE] border border-transparent rounded-2xl appearance-none text-[#003E48] placeholder:text-[#003E48]/40 focus:border-[#003E48] focus:bg-white focus:outline-none';

function FormLabel({
    children,
    required = false,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-1.5 inline-block text-sm font-medium text-[#003E48]">
            {required ? <span className="mr-0.5 text-[#E85A2E]">*</span> : null}
            {children}
        </label>
    );
}

function formatWhen(date: string, time: string) {
    if (!date) return 'Pick a day';
    const parsed = new Date(`${date}T00:00:00`);
    const day = parsed.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
    return time ? `${day} · ${time}` : day;
}

function IosSwitch({
    checked,
    onChange,
    id,
    label,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    id: string;
    label: string;
}) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85A2E]/40 focus-visible:ring-offset-2 ${
                checked ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
            }`}
        >
            <span
                className={`absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.28),0_1px_1px_rgba(0,0,0,0.12)] transition-transform duration-200 ease-out ${
                    checked ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
            />
        </button>
    );
}

type AppointmentFormProps = {
    variant?: 'page' | 'modal';
    defaults?: Partial<BookingDraft>;
    onSuccess?: () => void;
    onClose?: () => void;
};

function AppointmentFormBody({
    variant = 'page',
    defaults,
    onSuccess,
    onClose,
}: AppointmentFormProps) {
    const isModal = variant === 'modal';

    const [step, setStep] = useState(defaults?.date && defaults?.time ? 2 : 1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCountryIso2, setPhoneCountryIso2] = useState(DEFAULT_COUNTRY_ISO2);
    const [phoneLocal, setPhoneLocal] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState<BookingMode>(defaults?.mode || 'clinic');
    const [appointmentDate, setAppointmentDate] = useState(defaults?.date || '');
    const [appointmentTime, setAppointmentTime] = useState(defaults?.time || '');
    const [showReferral, setShowReferral] = useState(false);

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [coaches, setCoaches] = useState<ReferralCoach[]>([]);
    const [orgsLoading, setOrgsLoading] = useState(true);
    const [coachesLoading, setCoachesLoading] = useState(true);
    const [orgSelect, setOrgSelect] = useState('');
    const [organizationOther, setOrganizationOther] = useState('');
    const [showCustomOrganization, setShowCustomOrganization] = useState(false);
    const [selectedCoachCode, setSelectedCoachCode] = useState('');

    const { submitting, success, error, createAppointment, reset } = useAppointment();

    useEffect(() => {
        const nextDate = defaults?.date || '';
        const nextTime = defaults?.time || '';
        const nextMode = defaults?.mode || 'clinic';

        setAppointmentDate(nextDate);
        setAppointmentTime(nextTime);
        setMode(nextMode);
        if (nextDate && nextTime) {
            setStep((current) => (current < 2 ? 2 : current));
        } else {
            setStep(1);
        }
    }, [defaults?.date, defaults?.mode, defaults?.time, isModal]);

    const selectedCountry = useMemo(
        () => getCountryByIso2(phoneCountryIso2) ?? getDefaultCountry(),
        [phoneCountryIso2],
    );

    const isValidEmail = (value: string) =>
        !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const whenReady =
        appointmentDate.length > 0 &&
        appointmentTime.length > 0 &&
        isSlotBookable(appointmentDate, appointmentTime);
    const whoReady =
        name.trim().length > 1 &&
        isValidLocalPhone(phoneLocal, selectedCountry) &&
        isValidEmail(email);

    const selectedCoach = useMemo(
        () => coaches.find((c) => c.referral_code === selectedCoachCode) ?? null,
        [coaches, selectedCoachCode],
    );

    const filteredCoaches = useMemo(() => {
        if (!orgSelect || orgSelect === 'other') return coaches;
        const orgId = Number(orgSelect);
        return coaches.filter((c) => c.organization_id === orgId);
    }, [coaches, orgSelect]);

    useEffect(() => {
        let cancelled = false;
        organizationService
            .list()
            .then((response) => {
                if (!cancelled) setOrganizations(response.data || []);
            })
            .catch(() => {
                if (!cancelled) setOrganizations([]);
            })
            .finally(() => {
                if (!cancelled) setOrgsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        setCoachesLoading(true);
        const orgId = orgSelect && orgSelect !== 'other' ? Number(orgSelect) : undefined;
        referralCoachService
            .list(orgId)
            .then((response) => {
                if (!cancelled) setCoaches(response.data || []);
            })
            .catch(() => {
                if (!cancelled) setCoaches([]);
            })
            .finally(() => {
                if (!cancelled) setCoachesLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [orgSelect]);

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
        setMessage('');
        setMode('clinic');
        setAppointmentDate('');
        setAppointmentTime('');
        setOrgSelect('');
        setOrganizationOther('');
        setShowCustomOrganization(false);
        setSelectedCoachCode('');
        setShowReferral(false);
        setStep(1);
    };

    const setReferred = (next: boolean) => {
        setShowReferral(next);
        if (!next) {
            setOrgSelect('');
            setOrganizationOther('');
            setShowCustomOrganization(false);
            setSelectedCoachCode('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (whenReady && isSlotBookable(appointmentDate, appointmentTime)) setStep(2);
            return;
        }
        if (step === 2) {
            if (whenReady) setStep(3);
            return;
        }
        if (step === 3) {
            if (whoReady && whenReady) setStep(4);
            return;
        }
        if (!whoReady || !whenReady) return;
        if (!isSlotBookable(appointmentDate, appointmentTime)) return;

        const payload = {
            name: name.trim(),
            email: email.trim() || undefined,
            phone: formatFullPhone(phoneLocal, selectedCountry),
            subject: mode === 'call' ? 'Call' : 'Clinic visit',
            reasons: 'Appointment',
            message: message.trim() || 'Booked from the website.',
            type: 'CONSULTATION',
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            referral_code: selectedCoachCode || null,
            organization_id:
                !selectedCoachCode && orgSelect && orgSelect !== 'other' ? Number(orgSelect) : null,
            organization_other:
                !selectedCoachCode && showCustomOrganization ? organizationOther.trim() || null : null,
        };

        const isSuccess = await createAppointment(payload);
        if (isSuccess) {
            resetForm();
            onSuccess?.();
        }
    };

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => reset(), 5000);
        return () => clearTimeout(timer);
    }, [success, reset]);

    const timeSlots = useMemo(() => buildTimeSlots(appointmentDate), [appointmentDate]);
    const minDate = useMemo(() => earliestBookableDate(), []);
    const maxDate = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d;
    }, []);

    useEffect(() => {
        if (!appointmentTime) return;
        if (!timeSlots.includes(appointmentTime)) {
            setAppointmentTime('');
            setStep(1);
        }
    }, [appointmentTime, timeSlots]);

    const whenFields = (
        <div className={`grid gap-3 ${isModal ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
            <div className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setMode('clinic')}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            mode === 'clinic' ? 'bg-[#003E48] text-white' : 'bg-[#F6F3EE] text-[#003E48]'
                        }`}
                    >
                        In clinic
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('call')}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            mode === 'call' ? 'bg-[#003E48] text-white' : 'bg-[#F6F3EE] text-[#003E48]'
                        }`}
                    >
                        On a call
                    </button>
                </div>
            </div>
            <div>
                <DatePicker
                    className="mt-0"
                    label="Day"
                    required
                    value={appointmentDate}
                    placeholder="Select a day"
                    defaultViewYearsAgo={0}
                    minDate={minDate}
                    maxDate={maxDate}
                    compact={isModal}
                    placement={isModal ? 'bottom' : 'bottom'}
                    onChange={(v) => {
                        setAppointmentDate(v);
                        setAppointmentTime('');
                    }}
                />
            </div>
            <div>
                <FormLabel required>Time</FormLabel>
                <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className={inputClass}
                    required
                    disabled={!appointmentDate}
                >
                    <option value="" disabled>
                        {appointmentDate
                            ? timeSlots.length
                                ? 'Select a time'
                                : 'No times left today'
                            : 'Pick a day first'}
                    </option>
                    {timeSlots.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                {appointmentDate && timeSlots.length === 0 ? (
                    <p className="mt-1.5 text-xs text-[#003E48]/55">Times need to be at least one hour from now.</p>
                ) : null}
            </div>
        </div>
    );

    const whoFields = (
        <div className={`grid gap-3 ${isModal ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
            <div>
                <FormLabel required>Name</FormLabel>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    type="text"
                    className={inputClass}
                    required
                    maxLength={255}
                />
            </div>
            <div className="sm:col-span-2">
                <FormLabel required>Phone</FormLabel>
                <div className="flex h-12 overflow-hidden rounded-2xl bg-[#F6F3EE] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#003E48]">
                    <select
                        value={phoneCountryIso2}
                        onChange={(e) => setPhoneCountryIso2(e.target.value)}
                        className="w-[3.4rem] shrink-0 appearance-none bg-transparent py-0 pl-2.5 pr-0 text-[11px] font-semibold leading-none text-[#003E48]/65 outline-none"
                        aria-label="Country code"
                    >
                        {COUNTRY_DIAL_CODE_OPTIONS.map((country) => (
                            <option key={country.iso2} value={country.iso2}>
                                +{country.dialCode}
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
                        className="min-w-0 flex-1 bg-transparent px-2 text-[#003E48] outline-none placeholder:text-[#003E48]/40"
                        required
                        maxLength={selectedCountry.iso2 === 'RW' ? 9 : 15}
                    />
                </div>
            </div>
            <div>
                <FormLabel>Email</FormLabel>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Optional"
                    type="email"
                    className={inputClass}
                    maxLength={255}
                />
            </div>
            <div className="sm:col-span-2">
                <FormLabel>Message</FormLabel>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Anything we should know?"
                    className="w-full min-h-[7rem] resize-y px-4 py-3 font-normal transition duration-200 bg-[#F6F3EE] border border-transparent rounded-2xl appearance-none text-[#003E48] placeholder:text-[#003E48]/40 focus:border-[#003E48] focus:bg-white focus:outline-none"
                    maxLength={1000}
                    rows={4}
                />
            </div>
        </div>
    );

    const referralStep = (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-[22px] bg-[#F6F3EE] px-4 py-4 sm:px-5">
                <div className="min-w-0">
                    <p className="text-base font-semibold text-[#003E48]">I was referred</p>
                    <p className="mt-0.5 text-sm text-[#003E48]/55">
                        Turn on if a coach or organization sent you.
                    </p>
                </div>
                <IosSwitch
                    id="booking-referred-switch"
                    label="I was referred"
                    checked={showReferral}
                    onChange={setReferred}
                />
            </div>

            <AnimatePresence initial={false}>
                {showReferral ? (
                    <motion.div
                        key="referral-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <FormLabel>Organization</FormLabel>
                                <select
                                    value={showCustomOrganization ? 'other' : orgSelect}
                                    onChange={(e) => handleOrganizationChange(e.target.value)}
                                    className={inputClass}
                                    disabled={orgsLoading}
                                >
                                    <option value="">{orgsLoading ? 'Loading…' : 'Optional'}</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={String(org.id)}>
                                            {org.name}
                                        </option>
                                    ))}
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <FormLabel>Coach</FormLabel>
                                <select
                                    value={selectedCoachCode}
                                    onChange={(e) => handleCoachChange(e.target.value)}
                                    className={inputClass}
                                    disabled={coachesLoading}
                                >
                                    <option value="">{coachesLoading ? 'Loading…' : 'Optional'}</option>
                                    {filteredCoaches.map((coach) => (
                                        <option key={coach.id} value={coach.referral_code}>
                                            {coach.first_name} · {coach.referral_code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {showCustomOrganization && (
                                <div className="sm:col-span-2">
                                    <FormLabel>Institution name</FormLabel>
                                    <input
                                        value={organizationOther}
                                        onChange={(e) => setOrganizationOther(e.target.value)}
                                        placeholder="Institution name"
                                        type="text"
                                        className={inputClass}
                                        maxLength={255}
                                    />
                                </div>
                            )}
                            {selectedCoach && (
                                <p className="sm:col-span-2 text-sm text-[#003E48]">
                                    Referred by{' '}
                                    <span className="font-semibold">{selectedCoach.first_name}</span>
                                    {selectedCoach.organization_name
                                        ? ` · ${selectedCoach.organization_name}`
                                        : null}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );

    const reviewFields = (
        <div className="space-y-3 rounded-[22px] bg-[#F6F3EE] p-4 sm:p-5">
            {[
                { label: 'Visit', value: mode === 'call' ? 'On a call' : 'In clinic' },
                { label: 'When', value: formatWhen(appointmentDate, appointmentTime) },
                { label: 'Name', value: name.trim() },
                { label: 'Phone', value: formatFullPhone(phoneLocal, selectedCountry) },
                email.trim() ? { label: 'Email', value: email.trim() } : null,
                message.trim() ? { label: 'Message', value: message.trim() } : null,
                selectedCoach
                    ? {
                          label: 'Referral',
                          value: `${selectedCoach.first_name}${
                              selectedCoach.organization_name ? ` · ${selectedCoach.organization_name}` : ''
                          }`,
                      }
                    : showCustomOrganization && organizationOther.trim()
                      ? { label: 'Organization', value: organizationOther.trim() }
                      : null,
            ]
                .filter((row): row is { label: string; value: string } => Boolean(row))
                .map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-[#003E48]/50">{row.label}</span>
                        <span className="max-w-[70%] text-right font-semibold text-[#003E48]">{row.value}</span>
                    </div>
                ))}
        </div>
    );

    const actions = (
        <div className="mt-6 flex flex-wrap items-center gap-3">
            {step === 1 ? (
                <>
                    {isModal ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-5 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#F6F3EE]"
                        >
                            Cancel
                        </button>
                    ) : null}
                    <PressButton
                        type="button"
                        className="ml-auto"
                        disabled={!whenReady}
                        onClick={() => setStep(2)}
                    >
                        Continue
                    </PressButton>
                </>
            ) : step === 2 ? (
                <>
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="rounded-full px-5 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#F6F3EE]"
                    >
                        Back
                    </button>
                    <PressButton
                        type="button"
                        className="ml-auto"
                        disabled={!whenReady}
                        onClick={() => setStep(3)}
                    >
                        Continue
                    </PressButton>
                </>
            ) : step === 3 ? (
                <>
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="rounded-full px-5 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#F6F3EE]"
                    >
                        Back
                    </button>
                    <PressButton
                        type="button"
                        className="ml-auto"
                        disabled={!whoReady || !whenReady}
                        onClick={() => setStep(4)}
                    >
                        Review
                    </PressButton>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="rounded-full px-5 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#F6F3EE]"
                    >
                        Back
                    </button>
                    <PressButton
                        type="submit"
                        className="ml-auto"
                        disabled={submitting || !whoReady || !whenReady}
                    >
                        {submitting ? <ButtonSpinner loadingText="Booking" /> : 'Confirm booking'}
                    </PressButton>
                </>
            )}
        </div>
    );

    const status = (
        <>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-3 text-sm text-[#003E48]">{success}</p>}
        </>
    );

    if (isModal) {
        return (
            <form
                onSubmit={handleSubmit}
                className="grid min-h-[460px] md:grid-cols-[minmax(240px,32%)_1fr] md:min-h-[500px]"
            >
                <aside className="flex flex-col justify-between bg-[#003E48] p-6 text-white sm:p-8 md:rounded-l-[28px]">
                    <div>
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                            <Logo className="h-8 w-8 object-contain" />
                        </div>
                        <h3 className="text-2xl font-bold leading-tight sm:text-3xl">
                            {mode === 'call' ? (
                                <>
                                    On a <span className="font-accent">call</span>
                                </>
                            ) : (
                                <>
                                    A clinic <span className="font-accent">visit</span>
                                </>
                            )}
                        </h3>
                        <p className="mt-3 text-lg text-white/85">{formatWhen(appointmentDate, appointmentTime)}</p>
                    </div>
                    <p className="mt-10 text-sm text-white/55">About an hour. Name and phone are enough.</p>
                </aside>
                <div className="flex max-h-[min(80vh,560px)] flex-col overflow-y-auto p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="when"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 id="booking-modal-title" className="text-xl font-bold text-[#003E48]">
                                    When should we <span className="font-accent">see you</span>?
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">
                                    Pick a day and a time at least one hour from now.
                                </p>
                                <div className="mt-5">{whenFields}</div>
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div
                                key="referral"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 id="booking-modal-title" className="text-xl font-bold text-[#003E48]">
                                    Were you <span className="font-accent">referred</span>?
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-2 text-sm font-semibold text-[#E85A2E] hover:underline"
                                >
                                    Change day or time
                                </button>
                                <div className="mt-5">{referralStep}</div>
                            </motion.div>
                        ) : step === 3 ? (
                            <motion.div
                                key="who"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 id="booking-modal-title" className="text-xl font-bold text-[#003E48]">
                                    A few details, then you are <span className="font-accent">in</span>
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">Name and phone are enough.</p>
                                <div className="mt-5">{whoFields}</div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 id="booking-modal-title" className="text-xl font-bold text-[#003E48]">
                                    Check this is <span className="font-accent">right</span>
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">We’ll only confirm after you review.</p>
                                <div className="mt-5">{reviewFields}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {actions}
                    {status}
                </div>
            </form>
        );
    }

    return (
        <div className="relative mx-auto w-full max-w-2xl rounded-[28px] bg-white p-6 text-[#003E48] sm:p-10">
            <h3 className="text-xl font-bold sm:text-center sm:text-2xl">
                Book your <span className="font-accent">appointment</span>
            </h3>
            <p className="mt-2 text-sm text-[#003E48]/60 sm:text-center">
                Name, phone, a day and a time. Everything else is optional.
            </p>

            <div className="mx-auto mt-6 flex max-w-sm items-center gap-2">
                <span className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#E85A2E]' : 'bg-[#F6F3EE]'}`} />
                <span className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#E85A2E]' : 'bg-[#F6F3EE]'}`} />
                <span className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-[#E85A2E]' : 'bg-[#F6F3EE]'}`} />
                <span className={`h-1.5 flex-1 rounded-full ${step >= 4 ? 'bg-[#E85A2E]' : 'bg-[#F6F3EE]'}`} />
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="when"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">When should we see you?</h4>
                            {whenFields}
                        </motion.div>
                    ) : step === 2 ? (
                        <motion.div
                            key="referral"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Were you referred?</h4>
                            {referralStep}
                        </motion.div>
                    ) : step === 3 ? (
                        <motion.div
                            key="who"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Who should we book for?</h4>
                            {whoFields}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Check this is right</h4>
                            {reviewFields}
                        </motion.div>
                    )}
                </AnimatePresence>
                {actions}
                {status}
            </form>
        </div>
    );
}

function AppointmentFormFromUrl(props: AppointmentFormProps) {
    const searchParams = useSearchParams();
    return (
        <AppointmentFormBody
            {...props}
            defaults={{
                mode: props.defaults?.mode ?? (searchParams.get('mode') === 'call' ? 'call' : 'clinic'),
                date: props.defaults?.date || searchParams.get('date') || '',
                time: props.defaults?.time || searchParams.get('time') || '',
            }}
        />
    );
}

function AppointmentForm(props: AppointmentFormProps) {
    if (props.variant === 'modal') {
        return <AppointmentFormBody {...props} />;
    }
    return (
        <Suspense fallback={null}>
            <AppointmentFormFromUrl {...props} />
        </Suspense>
    );
}

export default AppointmentForm;
