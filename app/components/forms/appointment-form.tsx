'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppointment } from '@/hooks';
import { appointmentService, organizationService, referralCoachService } from '@/lib/api';
import { Organization, ReferralCoach, VisitQuote } from '@/lib/api/types';
import {
    COUNTRY_DIAL_CODE_OPTIONS,
    DEFAULT_COUNTRY_ISO2,
    getCountryByIso2,
    getDefaultCountry,
} from '@/lib/country-codes';
import { formatFullPhone, isValidLocalPhone, phonePlaceholder } from '@/lib/phone';
import DatePicker from '@/app/components/inputs/DatePicker';
import LineSelect from '@/app/components/inputs/LineSelect';
import BookingActionButton from '@/app/components/buttons/booking-action-button';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BookingDraft, BookingMode } from '@/app/components/booking/booking-context';
import Logo from '@/app/components/logo';
import { buildTimeSlots, earliestBookableDate, isSlotBookable } from '@/lib/appointment-slots';
import { fetchDayOffer } from '@/lib/api/services/appointment-availability';
import DoctorReferralForm from '@/app/components/forms/doctor-referral-form';
import {
    bookingInputClass,
    bookingPhoneShellClass,
    bookingTextareaClass,
} from '@/app/components/forms/booking-field-styles';
import type { NearAppointmentNotice } from '@/hooks/useAppointment';

const inputClass = bookingInputClass;

function FormLabel({
    children,
    required = false,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-1.5 inline-block text-sm text-[#003E48]/70">
            {children}
            {required ? <span className="text-[#c23b2e]"> *</span> : null}
        </label>
    );
}

function rwf(amount: number) {
    return `${Math.round(amount).toLocaleString('en-RW')} RWF`;
}

/** Filled from GET /api/appointments/offers (desk pricing). */
const VISIT_OFFERS: { code: string; name: string; amount: number }[] = [];

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
            className={`relative h-11 w-[64px] shrink-0 rounded-full transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85A2E]/40 focus-visible:ring-offset-2 ${
                checked ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
            }`}
        >
            <span
                className={`absolute top-[2px] left-[2px] h-10 w-10 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.28),0_1px_1px_rgba(0,0,0,0.12)] transition-transform duration-200 ease-out ${
                    checked ? 'translate-x-[22px]' : 'translate-x-0'
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
    const startedWithSlot = Boolean(defaults?.date && defaults?.time);
    const [path, setPath] = useState<'choose' | 'book' | 'doctor'>(startedWithSlot ? 'book' : 'choose');

    const [step, setStep] = useState(1);
    const [joinAs, setJoinAs] = useState<'self' | 'gym' | 'employer'>('self');
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
    const [formError, setFormError] = useState('');
    const [booked, setBooked] = useState<{
        name: string;
        when: string;
        mode: BookingMode;
        receipt?: { amount: number; billNumber: string | null };
    } | null>(null);
    const [quote, setQuote] = useState<VisitQuote | null>(null);
    const [productCode, setProductCode] = useState('');
    const [offers, setOffers] = useState(VISIT_OFFERS);
    const filledForPhone = useRef('');
    const [quoteError, setQuoteError] = useState('');
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [freeTimes, setFreeTimes] = useState<string[]>([]);
    const [offeredTimes, setOfferedTimes] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState('');
    const [nearNotice, setNearNotice] = useState<NearAppointmentNotice | null>(null);

    const { submitting, error, createAppointment, reset } = useAppointment();
    const selectedOffer = offers.find((row) => row.code === productCode) ?? null;

    useEffect(() => {
        let stop = false;
        appointmentService
            .offers()
            .then((rows) => {
                if (!stop && rows.length) setOffers(rows);
            })
            .catch(() => undefined);
        return () => {
            stop = true;
        };
    }, []);

    useEffect(() => {
        const nextDate = defaults?.date || '';
        const nextTime = defaults?.time || '';
        const nextMode = defaults?.mode || 'clinic';

        setAppointmentDate(nextDate);
        setAppointmentTime(nextTime);
        setMode(nextMode);
        if (nextDate && nextTime) {
            setPath('book');
        } else if (!isModal) {
            setStep(1);
        }
    }, [defaults?.date, defaults?.mode, defaults?.time, isModal]);

    const selectedCountry = useMemo(
        () => getCountryByIso2(phoneCountryIso2) ?? getDefaultCountry(),
        [phoneCountryIso2],
    );

    useEffect(() => {
        if (!productCode) {
            setQuote(null);
            setQuoteError('');
            setQuoteLoading(false);
            return;
        }
        const phone = formatFullPhone(phoneLocal, selectedCountry);
        if (phone.replace(/\D/g, '').length < 10) return;
        let stop = false;
        setQuoteLoading(true);
        setQuoteError('');
        const organizationId = orgSelect && orgSelect !== 'other' ? Number(orgSelect) : null;
        appointmentService
            .quote(phone, email.trim() || undefined, organizationId, productCode || undefined)
            .then((next) => {
                if (!stop) setQuote(next);
            })
            .catch((err: unknown) => {
                if (stop) return;
                setQuote(null);
                setQuoteError(err instanceof Error ? err.message : 'The visit price is not available.');
            })
            .finally(() => {
                if (!stop) setQuoteLoading(false);
            });
        return () => {
            stop = true;
        };
    }, [phoneLocal, selectedCountry, email, orgSelect, productCode]);

    useEffect(() => {
        const rawName = quote?.member_name?.trim() ?? '';
        const foundName = /^vitaway(\s+member)?$/i.test(rawName) ? '' : rawName;
        const rawEmail = quote?.member_email?.trim() ?? '';
        const foundEmail = /phone\.vitaway/i.test(rawEmail) ? '' : rawEmail;
        const typed = formatFullPhone(phoneLocal, selectedCountry).replace(/\D/g, '').slice(-9);
        const quoted = (quote?.phone ?? '').replace(/\D/g, '').slice(-9);
        if (!typed || typed !== quoted) return;
        if (filledForPhone.current === typed) return;
        if (!foundName && !foundEmail) return;
        filledForPhone.current = typed;
        if (foundName) setName(foundName);
        if (foundEmail) setEmail(foundEmail);
    }, [quote, phoneLocal, selectedCountry]);

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
                const rows = response.data;
                if (!cancelled) setOrganizations(Array.isArray(rows) ? rows : []);
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
                const rows = response.data;
                if (!cancelled) setCoaches(Array.isArray(rows) ? rows : []);
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
        setFormError('');
        setStep(1);
    };

    const detailsProblem = () => {
        if (name.trim().length <= 1) return 'Add your name to continue.';
        if (!isValidLocalPhone(phoneLocal, selectedCountry)) {
            return selectedCountry.iso2 === 'RW'
                ? 'Use a Rwandan mobile number, like 78XXXXXXX.'
                : 'Add a phone number we can reach.';
        }
        if (!isValidEmail(email)) return 'That email address does not look right.';
        if (!whenReady) return 'Pick a day and a time at least one hour from now.';
        return '';
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
            if (joinAs === 'self' || orgSelect || showCustomOrganization) setStep(2);
            return;
        }
        if (step === 2) {
            if (!productCode) {
                setFormError('Choose a service.');
                return;
            }
            setFormError('');
            setStep(3);
            return;
        }
        if (step === 3) {
            if (name.trim().length <= 1) {
                setFormError('Add your name to continue.');
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
            if (!isValidEmail(email)) {
                setFormError('That email address does not look right.');
                return;
            }
            setFormError('');
            setStep(4);
            return;
        }
        if (step === 4) {
            if (!whenReady) {
                setFormError('Pick a day and a time at least one hour from now.');
                return;
            }
            setFormError('');
            setStep(5);
            return;
        }
        if (!whoReady || !whenReady) {
            setFormError(detailsProblem() || 'Check the visit details and try again.');
            return;
        }
        setFormError('');
        setNearNotice(null);
        if (!isSlotBookable(appointmentDate, appointmentTime)) return;

        const payload = {
            name: name.trim(),
            email: email.trim() || undefined,
            phone: formatFullPhone(phoneLocal, selectedCountry),
            subject: selectedOffer?.name || 'Clinic visit',
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
            confirm_near: false,
            product_code: productCode,
        };

        const result = await createAppointment(payload);
        acceptBooking(result, formatWhen(appointmentDate, appointmentTime));
    };

    function acceptBooking(
        result: Awaited<ReturnType<typeof createAppointment>>,
        when: string,
    ) {
        if (!result.ok) {
            if (result.near) setNearNotice(result.near);
            return;
        }
        if (result.payment) {
            if (result.payment.payment_link) {
                window.location.assign(result.payment.payment_link);
                return;
            }
            setFormError('Payment could not be opened. Call the clinic to finish this booking.');
            return;
        }
        setBooked({ name: name.trim(), when, mode });
        resetForm();
    }

    async function confirmNearBooking() {
        if (!nearNotice) return;
        setNearNotice(null);
        setFormError('');
        const result = await createAppointment({
            name: name.trim(),
            email: email.trim() || undefined,
            phone: formatFullPhone(phoneLocal, selectedCountry),
            subject: selectedOffer?.name || 'Clinic visit',
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
            confirm_near: true,
            product_code: productCode,
        });
        acceptBooking(result, formatWhen(appointmentDate, appointmentTime));
    }

    function finishConfirmation() {
        setBooked(null);
        reset();
        if (isModal) onClose?.();
        else onSuccess?.();
    }

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
        setOfferedTimes([]);
        fetchDayOffer(appointmentDate)
            .then((day) => {
                if (!cancelled) {
                    setFreeTimes(day.times);
                    setOfferedTimes(day.offered);
                }
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

    const whenFields = (
        <div className={`grid gap-3 ${isModal ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
            <div className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setMode('clinic')}
                        className={`rounded-[6px] px-4 py-3 text-sm font-semibold transition ${
                            mode === 'clinic' ? 'bg-[#003E48] text-white' : 'bg-[#F6F3EE] text-[#003E48]'
                        }`}
                    >
                        In clinic
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('call')}
                        className={`rounded-[6px] px-4 py-3 text-sm font-semibold transition ${
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
                    fieldStyle="line"
                    placement={isModal ? 'bottom' : 'bottom'}
                    onChange={(v) => {
                        setAppointmentDate(v);
                        setAppointmentTime('');
                    }}
                />
            </div>
            <div>
                <LineSelect
                    label="Time"
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
                    options={(offeredTimes.length ? offeredTimes : timeSlots)
                        .filter((value) => isSlotBookable(appointmentDate, value))
                        .map((value) => {
                            const taken = offeredTimes.includes(value) && !freeTimes.includes(value);
                            return {
                                value,
                                label: taken ? `${value} · booked` : value,
                                disabled: taken,
                            };
                        })}
                />
                <p className="mt-1.5 text-xs text-[#003E48]/55">
                    Crossed-out times are already booked. These are the same clinic hours as the app and the desk, in Kigali time.
                </p>
                {slotsError ? (
                    <p className="mt-1.5 text-xs font-medium text-[#E85A2E]">{slotsError}</p>
                ) : appointmentDate && !slotsLoading && timeSlots.length === 0 ? (
                    <p className="mt-1.5 text-xs text-[#003E48]/55">
                        No free times left this day. Pick another day.
                    </p>
                ) : null}
            </div>
        </div>
    );

    const whoFields = (
        <div className={`grid gap-3 ${isModal ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
            {quote?.organization_name ? (
                <div className="sm:col-span-2 rounded-[8px] bg-[#F6F3EE] px-4 py-3 text-sm text-[#003E48]">
                    <p className="font-semibold">{quote.organization_name} member found</p>
                </div>
            ) : null}
            <div className="sm:col-span-2">
                <FormLabel required>Phone</FormLabel>
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
                            options={COUNTRY_DIAL_CODE_OPTIONS.map((country) => ({
                                value: country.iso2,
                                label: `+${country.dialCode}`,
                                hint: country.name,
                            }))}
                        />
                    </div>
                    <span aria-hidden className="my-2.5 w-px bg-[#e4ddd2]" />
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
                        className="min-w-0 flex-1 bg-transparent pl-3 text-sm text-[#003E48] outline-none placeholder:text-[#003E48]/35"
                        required
                        maxLength={selectedCountry.iso2 === 'RW' ? 9 : 15}
                    />
                </div>
            </div>
            <div>
                <FormLabel required>Name</FormLabel>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    type="text"
                    autoComplete="name"
                    className={inputClass}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <FormLabel>Email</FormLabel>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Optional"
                    type="email"
                    autoComplete="email"
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
                    className={bookingTextareaClass}
                    maxLength={1000}
                    rows={4}
                />
            </div>
        </div>
    );

    const chooseJoin = (kind: 'self' | 'gym' | 'employer') => {
        setJoinAs(kind);
        setReferred(kind !== 'self');
    };

    const joiningStep = (
        <div className="space-y-3">
            {(
                [
                    ['self', 'Individual', 'For your own wellness goals'],
                    ['gym', 'Gym member', 'Through your gym or fitness centre'],
                    ['employer', 'Employer or workplace', 'Through your company wellness programme'],
                ] as const
            ).map(([id, label, hint]) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => chooseJoin(id)}
                    className={`block min-h-11 w-full rounded-[8px] border px-4 py-3 text-left ${
                        joinAs === id ? 'border-[#003E48] bg-[#F6F3EE]' : 'border-[#003E48]/15'
                    }`}
                >
                    <span className="block text-sm font-semibold text-[#003E48]">{label}</span>
                    <span className="mt-0.5 block text-sm text-[#003E48]/60">{hint}</span>
                </button>
            ))}
            {joinAs !== 'self' ? (
                <div className="space-y-3 pt-2">
                    <LineSelect
                        label={joinAs === 'gym' ? 'Which gym?' : 'Which workplace?'}
                        value={showCustomOrganization ? 'other' : orgSelect}
                        onChange={handleOrganizationChange}
                        disabled={orgsLoading}
                        searchable
                        placeholder={orgsLoading ? 'Loading…' : 'Choose'}
                        options={[
                            { value: '', label: 'Choose' },
                            ...organizations.map((org) => ({ value: String(org.id), label: org.name })),
                            { value: 'other', label: joinAs === 'gym' ? 'My gym is not listed' : 'My workplace is not listed' },
                        ]}
                    />
                    {showCustomOrganization ? (
                        <input
                            value={organizationOther}
                            onChange={(e) => setOrganizationOther(e.target.value)}
                            placeholder={joinAs === 'gym' ? 'Gym name' : 'Workplace name'}
                            className={inputClass}
                            maxLength={255}
                        />
                    ) : null}
                    <p className="text-sm text-[#003E48]/60">We&apos;ll check your membership in the next step.</p>
                </div>
            ) : null}
        </div>
    );

    const referralStep = (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-[22px] bg-[#F6F3EE] px-4 py-4 sm:px-5">
                <div className="min-w-0">
                    <p className="text-base font-semibold text-[#003E48]">Joining through a gym or workplace</p>
                    <p className="mt-0.5 text-sm text-[#003E48]/55">
                        Turn this on to name the organisation. The clinic confirms any member benefit before you pay. Leave it off if you are booking for yourself.
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
                            <LineSelect
                                label="Organization"
                                value={showCustomOrganization ? 'other' : orgSelect}
                                onChange={handleOrganizationChange}
                                disabled={orgsLoading}
                                searchable
                                placeholder={orgsLoading ? 'Loading…' : 'Optional'}
                                options={[
                                    { value: '', label: orgsLoading ? 'Loading…' : 'Optional' },
                                    ...organizations.map((org) => ({
                                        value: String(org.id),
                                        label: org.name,
                                    })),
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
                            <LineSelect
                                label="Coach"
                                value={selectedCoachCode}
                                onChange={handleCoachChange}
                                disabled={coachesLoading}
                                searchable
                                placeholder={coachesLoading ? 'Loading…' : 'Optional'}
                                options={[
                                    { value: '', label: coachesLoading ? 'Loading…' : 'Optional' },
                                    ...filteredCoaches.map((coach) => ({
                                        value: coach.referral_code,
                                        label: `${coach.first_name} · ${coach.referral_code}`,
                                    })),
                                ]}
                            />
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
    void referralStep;

    const serviceStep = (
        <div className="space-y-3">
            {offers.map((offer) => {
                const selected = offer.code === productCode;
                return (
                    <button
                        key={offer.code}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setProductCode(offer.code)}
                        className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-[8px] border px-4 py-3 text-left ${
                            selected ? 'border-[#003E48] bg-[#F6F3EE]' : 'border-[#003E48]/15'
                        }`}
                    >
                        <span className="text-sm font-semibold text-[#003E48]">{offer.name}</span>
                        <span className="shrink-0 text-sm font-semibold text-[#003E48]">{rwf(offer.amount)}</span>
                    </button>
                );
            })}
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
            <div className="border-t border-[#003E48]/10 pt-3">
                {quoteLoading ? <p className="text-sm text-[#003E48]/60">Working out the amount due…</p> : null}
                {quoteError ? <p className="text-sm text-red-600">{quoteError}</p> : null}
                {quote && !quoteLoading ? (
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-[#003E48]/50">{quote.service_name}</span>
                            <span className="font-semibold text-[#003E48]">{rwf(quote.list_amount)}</span>
                        </div>
                        {quote.discount_pct > 0 ? (
                            <div className="flex items-start justify-between gap-4">
                                <span className="text-[#003E48]/50">
                                    {quote.organization_name || 'Partner'} benefit · {quote.discount_pct}%
                                </span>
                                <span className="font-semibold text-[#003E48]">−{rwf(quote.discount_amount)}</span>
                            </div>
                        ) : null}
                        <div className="flex items-start justify-between gap-4 text-base">
                            <span className="font-semibold text-[#003E48]">You pay</span>
                            <span className="font-bold text-[#003E48]">
                                {showReferral && !quote.organization_name ? 'Confirmed at the desk' : rwf(quote.amount)}
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-[#003E48]/55">
                            {showReferral && !quote.organization_name
                                ? 'The clinic will confirm this partner benefit before you pay. The full price is not charged.'
                                : "We're holding this time for you while you pay."}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );

    const actions = (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {step === 1 ? (
                <>
                    <BookingActionButton
                        type="button"
                        tone="white"
                        icon={startedWithSlot && isModal ? 'close' : 'back'}
                        onClick={() => {
                            if (!startedWithSlot) setPath('choose');
                            else if (isModal) onClose?.();
                        }}
                    >
                        {startedWithSlot && isModal ? 'Cancel' : 'Back'}
                    </BookingActionButton>
                    <BookingActionButton
                        type="button"
                        disabled={joinAs !== 'self' && !orgSelect && !showCustomOrganization}
                        onClick={() => setStep(2)}
                    >
                        Continue
                    </BookingActionButton>
                </>
            ) : step === 2 ? (
                <>
                    <BookingActionButton type="button" tone="white" icon="back" onClick={() => setStep(1)}>
                        Back
                    </BookingActionButton>
                    <BookingActionButton type="button" disabled={!productCode} onClick={() => setStep(3)}>
                        Continue
                    </BookingActionButton>
                </>
            ) : step === 3 ? (
                <>
                    <BookingActionButton type="button" tone="white" icon="back" onClick={() => setStep(2)}>
                        Back
                    </BookingActionButton>
                    <BookingActionButton type="button" disabled={!whoReady} onClick={() => setStep(4)}>
                        Continue
                    </BookingActionButton>
                </>
            ) : step === 4 ? (
                <>
                    <BookingActionButton type="button" tone="white" icon="back" onClick={() => setStep(3)}>
                        Back
                    </BookingActionButton>
                    <BookingActionButton type="button" disabled={!whenReady} onClick={() => setStep(5)}>
                        Continue
                    </BookingActionButton>
                </>
            ) : (
                <>
                    <BookingActionButton type="button" tone="white" icon="back" onClick={() => setStep(4)}>
                        Back
                    </BookingActionButton>
                    <BookingActionButton
                        type="submit"
                        icon="check"
                        loading={submitting}
                        disabled={submitting || !whoReady || !whenReady || !productCode || quoteLoading || quote?.product_code !== productCode}
                    >
                        {submitting
                            ? 'Opening payment…'
                            : showReferral && quote && !quote.organization_name
                              ? 'Request booking'
                              : quote && quote.amount <= 0
                                ? 'Book'
                                : quote
                                ? `Pay ${rwf(quote.amount)} and book`
                                : 'Pay and book'}
                    </BookingActionButton>
                </>
            )}
        </div>
    );

    const status = (
        <>
            {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {nearNotice ? (
                <div className="mt-4 space-y-3 border border-[#E85A2E]/25 bg-[#FFF7F3] px-4 py-3 text-sm text-[#003E48]">
                    <p>{nearNotice.message}</p>
                    {nearNotice.when_label ? (
                        <p className="font-semibold">Existing visit: {nearNotice.when_label}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                        <BookingActionButton
                            type="button"
                            size="sm"
                            loading={submitting}
                            onClick={() => void confirmNearBooking()}
                        >
                            Book anyway
                        </BookingActionButton>
                        <BookingActionButton
                            type="button"
                            size="sm"
                            tone="white"
                            icon="close"
                            disabled={submitting}
                            onClick={() => {
                                setNearNotice(null);
                                setStep(1);
                            }}
                        >
                            Reschedule
                        </BookingActionButton>
                    </div>
                </div>
            ) : null}
        </>
    );

    if (path === 'choose') {
        const shell = isModal
            ? 'flex min-h-[460px] flex-col justify-center bg-white px-8 py-12 sm:px-12 md:min-h-[500px]'
            : 'relative mx-auto w-full max-w-2xl rounded-[28px] bg-white px-6 py-10 text-[#003E48] sm:px-10';
        return (
            <div className={shell}>
                <h3 id="booking-modal-title" className="text-2xl font-bold text-[#003E48] sm:text-3xl">
                    How can we <span className="font-accent">help</span>?
                </h3>
                <p className="mt-2 max-w-md text-sm text-[#003E48]/65">
                    Book a visit for yourself, or refer a patient if you are a doctor with a Vitaway code.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => {
                            setPath('book');
                            setStep(1);
                        }}
                        className="rounded-[22px] border border-[#003E48]/12 bg-[#F6F3EE] px-5 py-5 text-left transition hover:border-[#003E48]/35"
                    >
                        <span className="block text-base font-semibold text-[#003E48]">Book an appointment</span>
                        <span className="mt-1 block text-sm text-[#003E48]/60">Pick a day and time for a clinic visit or call.</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPath('doctor')}
                        className="rounded-[22px] border border-[#003E48]/12 bg-[#F6F3EE] px-5 py-5 text-left transition hover:border-[#003E48]/35"
                    >
                        <span className="block text-base font-semibold text-[#003E48]">I am a doctor referring a patient</span>
                        <span className="mt-1 block text-sm text-[#003E48]/60">Enter your code and send the client’s details.</span>
                    </button>
                </div>
                {isModal ? (
                    <div className="mt-8">
                        <BookingActionButton type="button" tone="white" icon="close" onClick={onClose}>
                            Cancel
                        </BookingActionButton>
                    </div>
                ) : null}
            </div>
        );
    }

    if (path === 'doctor') {
        const shell = isModal
            ? 'bg-white px-8 py-10 sm:px-12 md:min-h-[500px]'
            : 'relative mx-auto w-full max-w-2xl rounded-[28px] bg-white px-6 py-10 text-[#003E48] sm:px-10';
        return (
            <div className={shell}>
                <DoctorReferralForm
                    isModal={isModal}
                    onBack={() => setPath('choose')}
                    onClose={onClose}
                    onDone={onSuccess}
                />
            </div>
        );
    }

    if (booked) {
        const place = booked.mode === 'call' ? 'a call' : 'a clinic visit';
        const greeting = booked.name ? `${booked.name}, we'll see you` : "We'll see you";
        return (
            <div
                className={
                    isModal
                        ? 'flex min-h-[460px] flex-col items-start justify-center bg-white px-8 py-14 sm:px-16 md:min-h-[500px]'
                        : 'relative mx-auto w-full max-w-2xl rounded-[28px] bg-white px-6 py-12 text-[#003E48] sm:px-10 sm:text-center'
                }
            >
                <h3 id="booking-modal-title" className="text-3xl font-bold text-[#003E48] sm:text-4xl">
                    Visit <span className="font-accent">confirmed</span>
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-[#003E48]/80">
                    {greeting} {place} on {booked.when}.
                </p>
                {booked.receipt ? (
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[#003E48]/60">
                        Receipt {booked.receipt.billNumber || 'on file'} · {rwf(booked.receipt.amount)} paid with IremboPay.
                        The same receipt is on your clinic record.
                    </p>
                ) : (
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[#003E48]/60">
                        The clinic will confirm your time by email and WhatsApp. Keep your phone nearby.
                    </p>
                )}
                <div className="mt-8">
                    <BookingActionButton type="button" icon="check" onClick={finishConfirmation}>
                        {isModal ? 'Done' : 'Book another visit'}
                    </BookingActionButton>
                </div>
            </div>
        );
    }

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
                                    How are you <span className="font-accent">joining</span>?
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">About three minutes. No account needed.</p>
                                <div className="mt-5">{joiningStep}</div>
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div
                                key="service"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 id="booking-modal-title" className="text-xl font-bold text-[#003E48]">
                                    Choose a <span className="font-accent">service</span>
                                </h3>
                                <div className="mt-5">{serviceStep}</div>
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
                                    Your <span className="font-accent">details</span>
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">
                                    We&apos;ll send your booking confirmation by SMS or WhatsApp to this number.
                                </p>
                                <div className="mt-5">{whoFields}</div>
                            </motion.div>
                        ) : step === 4 ? (
                            <motion.div
                                key="when"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 id="booking-modal-title" className="text-xl font-bold text-[#003E48]">
                                    Choose a <span className="font-accent">time</span>
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">
                                    Pick a day and a time at least one hour from now.
                                </p>
                                <div className="mt-5">{whenFields}</div>
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
                                    Pay to <span className="font-accent">confirm</span>
                                </h3>
                                <p className="mt-1 text-sm text-[#003E48]/55">The visit is confirmed after payment.</p>
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
                <span className={`h-1.5 flex-1 rounded-full ${step >= 5 ? 'bg-[#E85A2E]' : 'bg-[#F6F3EE]'}`} />
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
                            <h4 className="mb-4 text-lg font-bold">How are you joining?</h4>
                            {joiningStep}
                        </motion.div>
                    ) : step === 2 ? (
                        <motion.div
                            key="service"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Choose a service</h4>
                            {serviceStep}
                        </motion.div>
                    ) : step === 3 ? (
                        <motion.div
                            key="who"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Your details</h4>
                            {whoFields}
                        </motion.div>
                    ) : step === 4 ? (
                        <motion.div
                            key="when"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Choose a time</h4>
                            {whenFields}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h4 className="mb-4 text-lg font-bold">Pay to confirm</h4>
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
