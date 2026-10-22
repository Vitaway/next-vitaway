'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PreRegistrationPayload, VisitQuote } from '@/lib/api/types';
import { appointmentService } from '@/lib/api';
import { useAppointment } from '@/hooks';
import { isValidFullPhone } from '@/lib/phone';
import { isSlotBookable } from '@/lib/appointment-slots';
import PressButton from '@/app/components/buttons/press-button';
import Logo from '@/app/components/logo';

import Step1JoiningAs from './steps/Step1JoiningAs';
import Step2AboutYou from './steps/Step2AboutYou';
import StepSlot from './steps/StepSlot';
import ConfirmationStep from './steps/ConfirmationStep';

const TOTAL_FORM_STEPS = 5;

const VISIT_OFFERS: { code: string; name: string; amount: number }[] = [];

function rwf(amount: number) {
    return `${Math.round(amount).toLocaleString('en-RW')} RWF`;
}

function formatWhen(date: string, time: string) {
    if (!date) return '';
    const parsed = new Date(`${date}T00:00:00`);
    const day = parsed.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return time ? `${day} · ${time}` : day;
}

const MODAL_ASIDE: { title: React.ReactNode; status: string }[] = [
    {
        title: (
            <>
                How you are <span className="font-accent">joining</span>
            </>
        ),
        status: 'Step 1 of 5',
    },
    {
        title: (
            <>
                About <span className="font-accent">you</span>
            </>
        ),
        status: 'Step 2 of 5',
    },
    {
        title: (
            <>
                Choose a <span className="font-accent">service</span>
            </>
        ),
        status: 'Step 3 of 5',
    },
    {
        title: (
            <>
                An open <span className="font-accent">time</span>
            </>
        ),
        status: 'Step 4 of 5',
    },
    {
        title: (
            <>
                <span className="font-accent">Pay</span> for the visit
            </>
        ),
        status: 'Step 5 of 5',
    },
    {
        title: (
            <>
                You&apos;re <span className="font-accent">booked</span>
            </>
        ),
        status: 'Confirmed',
    },
];

function ProgressDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                        i < current
                            ? 'h-2 w-2 bg-[#E85A2E]'
                            : i === current
                              ? 'h-2 w-5 bg-[#E85A2E]'
                              : 'h-2 w-2 bg-[#003E48]/15'
                    }`}
                />
            ))}
        </div>
    );
}

function Shell({ children }: { children: React.ReactNode }) {
    return <div className="min-h-dvh bg-[#003E48] px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-3">{children}</div>;
}

type WizardProps = {
    variant?: 'page' | 'modal';
    onClose?: () => void;
};

function partnerKind(joining: PreRegistrationPayload['joining_as'] | undefined) {
    if (joining === 'gym_member') return 'gym' as const;
    if (joining === 'employer_program') return 'company' as const;
    return null;
}

function PreRegistrationWizard({ variant = 'page', onClose }: WizardProps) {
    const isModal = variant === 'modal';
    const contentRef = useRef<HTMLDivElement>(null);
    const [step, setStep] = useState(1);
    const [data, setData] = useState<Partial<PreRegistrationPayload>>({});
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [quote, setQuote] = useState<VisitQuote | null>(null);
    const [quoteError, setQuoteError] = useState('');
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [paid, setPaid] = useState<{ when: string; amount: number; bill: string | null } | null>(null);
    const [holdId, setHoldId] = useState<string | null>(null);
    const [productCode, setProductCode] = useState('');
    const [offers, setOffers] = useState(VISIT_OFFERS);
    const { submitting, error, createAppointment } = useAppointment();

    const partner = partnerKind(data.joining_as);
    const phone = data.phone_number || '';

    const updateData = (patch: Partial<PreRegistrationPayload>) => {
        setData((prev) => {
            const next = { ...prev, ...patch };
            if (patch.joining_as && patch.joining_as !== prev.joining_as) next.organization_id = null;
            return next;
        });
        setErrors([]);
    };

    useEffect(() => {
        let stop = false;
        appointmentService
            .offers()
            .then((result) => {
                if (!stop && result.services.length) setOffers(result.services);
            })
            .catch(() => undefined);
        return () => {
            stop = true;
        };
    }, []);

    useEffect(() => {
        if (!productCode || !isValidFullPhone(phone)) return;
        if (partner && !data.organization_id && !data.organization_other) return;
        let stop = false;
        setQuoteLoading(true);
        setQuoteError('');
        appointmentService
            .quote(phone, data.email, data.organization_id, productCode)
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
    }, [phone, data.email, data.organization_id, data.organization_other, partner, productCode]);

    useEffect(() => {
        if (!holdId) return;
        let stop = false;
        async function tick() {
            try {
                const status = await appointmentService.payment(holdId!);
                if (stop) return;
                if (status.status === 'paid') {
                    setPaid({
                        when: formatWhen(date, time),
                        amount: status.amount,
                        bill: status.bill_number,
                    });
                    setHoldId(null);
                    setStep(6);
                }
            } catch {
                /* keep asking until Irembo answers */
            }
        }
        const timer = window.setInterval(() => void tick(), 4000);
        void tick();
        return () => {
            stop = true;
            window.clearInterval(timer);
        };
    }, [holdId, date, time]);

    const scrollTop = () => {
        if (isModal) {
            contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const problems = (): string[] => {
        if (step === 1 && !data.joining_as) return ['Choose how you are joining.'];
        if (step === 2) {
            const next: string[] = [];
            if (!data.full_name || data.full_name.trim().length < 2) next.push('Add your name.');
            if (!isValidFullPhone(phone)) next.push('Add a phone number we can reach.');
            if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.push('That email does not look right.');
            if (partner && !data.organization_id) next.push(partner === 'gym' ? 'Choose your gym.' : 'Choose your company.');
            return next;
        }
        if (step === 3 && !productCode) return ['Choose a service.'];
        if (step === 4 && (!date || !time || !isSlotBookable(date, time))) return ['Pick an open time.'];
        return [];
    };

    const pay = async () => {
        const result = await createAppointment({
            name: (data.full_name || '').trim(),
            email: data.email?.trim() || undefined,
            phone,
            subject: offers.find((row) => row.code === productCode)?.name || 'Clinic visit',
            reasons: partner === 'gym' ? 'Gym member' : partner === 'company' ? 'Employer programme' : 'Individual',
            message: 'Booked from the website.',
            type: 'CONSULTATION',
            appointment_date: date,
            appointment_time: time,
            organization_id: data.organization_id ?? null,
            organization_other: data.organization_other ?? null,
            product_code: productCode,
        });
        if (!result.ok) return;
        if (result.payment?.payment_link) {
            window.location.assign(result.payment.payment_link);
            return;
        }
        setPaid({ when: formatWhen(date, time), amount: quote?.amount ?? 0, bill: null });
        setStep(6);
    };

    const handleNext = async () => {
        const errs = problems();
        if (errs.length) {
            setErrors(errs);
            return;
        }
        if (step === 5) {
            await pay();
            return;
        }
        setStep((current) => current + 1);
        scrollTop();
    };

    const handleBack = () => {
        setErrors([]);
        if (step <= 1) {
            onClose?.();
            return;
        }
        setStep((current) => current - 1);
        scrollTop();
    };

    const aside = MODAL_ASIDE[Math.min(step, 6) - 1];
    const stepBody = (
        <>
            {step === 1 ? <Step1JoiningAs data={data} errors={errors} onChange={updateData} hideHeader={isModal} /> : null}
            {step === 2 ? (
                <Step2AboutYou
                    data={data}
                    errors={errors}
                    onChange={updateData}
                    hideHeader={isModal}
                    partner={partner}
                    quote={partner ? quote : null}
                    quoteLoading={partner ? quoteLoading : false}
                    quoteError={partner ? quoteError : ''}
                />
            ) : null}
            {step === 3 ? (
                <div className="space-y-3">
                    {isModal ? null : (
                        <h2 className="text-xl font-bold text-[#003E48]">
                            Choose a <span className="font-accent">service</span>
                        </h2>
                    )}
                    {offers.map((offer) => {
                        const selected = offer.code === productCode;
                        return (
                            <button
                                key={offer.code}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => {
                                    setProductCode(offer.code);
                                    setErrors([]);
                                }}
                                className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-[8px] border px-4 py-3 text-left ${
                                    selected ? 'border-[#003E48] bg-white' : 'border-[#003E48]/15 bg-white'
                                }`}
                            >
                                <span className="text-sm font-semibold text-[#003E48]">{offer.name}</span>
                                <span className="shrink-0 text-sm font-semibold text-[#003E48]">{rwf(offer.amount)}</span>
                            </button>
                        );
                    })}
                    {errors[0] ? <p className="text-sm text-red-600">{errors[0]}</p> : null}
                </div>
            ) : null}
            {step === 4 ? (
                <StepSlot
                    date={date}
                    time={time}
                    error={errors[0]}
                    onChange={(next) => {
                        if (next.date !== undefined) setDate(next.date);
                        if (next.time !== undefined) setTime(next.time);
                        setErrors([]);
                    }}
                />
            ) : null}
            {step === 5 ? (
                <div>
                    <h2 className="text-xl font-bold text-[#003E48]">
                        Pay <span className="font-accent">{quote ? rwf(quote.amount) : ''}</span>
                    </h2>
                    <p className="mt-2 text-sm text-[#003E48]/70">
                        {formatWhen(date, time)}
                        {quote?.organization_name ? ` · ${quote.organization_name}` : ''}
                    </p>
                    {quote && quote.discount_pct > 0 ? (
                        <p className="mt-1 text-sm text-[#003E48]/55">
                            {quote.discount_pct}% off {rwf(quote.list_amount)}
                        </p>
                    ) : null}
                    {holdId ? <p className="mt-4 text-sm text-[#003E48]/70">Waiting for payment.</p> : null}
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                </div>
            ) : null}
            {step === 6 && paid ? (
                <ConfirmationStep
                    referenceNumber={paid.bill || ''}
                    when={paid.when}
                    amount={rwf(paid.amount)}
                    onDone={onClose}
                    hideHeader={isModal}
                />
            ) : null}
        </>
    );

    const footer = step < 6 ? (
        <>
            <button
                type="button"
                onClick={handleBack}
                className="rounded-full px-5 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#F6F3EE]"
            >
                {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <PressButton
                type="button"
                className="ml-auto"
                disabled={submitting || Boolean(holdId) || (step === 3 && !productCode) || (step === 5 && (quoteLoading || !quote))}
                onClick={() => void handleNext()}
            >
                {submitting ? 'Opening payment…' : step === 5 ? `Pay ${quote ? rwf(quote.amount) : ''}` : 'Continue'}
            </PressButton>
        </>
    ) : (
        <PressButton type="button" className="ml-auto" onClick={onClose}>
            Done
        </PressButton>
    );

    if (isModal) {
        return (
            <div className="grid min-h-[560px] md:grid-cols-[minmax(260px,30%)_1fr] md:min-h-[640px]">
                <aside className="flex flex-col justify-between bg-[#003E48] px-6 pb-6 pt-16 text-white sm:p-8 md:rounded-l-[28px] md:pt-8">
                    <div>
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                            <Logo className="h-8 w-8 object-contain" />
                        </div>
                        <h3 className="text-2xl font-bold leading-tight sm:text-3xl">{aside.title}</h3>
                        <p className="mt-3 text-lg text-white/85">{aside.status}</p>
                    </div>
                </aside>
                <div className="flex max-h-[min(90dvh,760px)] min-h-0 flex-col">
                    <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
                        <h3 id="prereg-modal-title" className="sr-only">
                            Book a visit
                        </h3>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {stepBody}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-[#003E48]/08 px-6 py-4 sm:px-8">{footer}</div>
                </div>
            </div>
        );
    }

    return (
        <Shell>
            <div className="relative min-h-[calc(100dvh-16px)] overflow-hidden rounded-[22px] bg-[#F6F3EE] sm:min-h-[calc(100dvh-24px)] sm:rounded-[28px]">
                {step === 6 ? (
                    <div className="mx-auto max-w-md px-5 py-10">{stepBody}</div>
                ) : (
                    <>
                        <div className="sticky top-0 z-10 border-b border-[#003E48]/10 bg-white/90 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
                            <div className="mx-auto flex max-w-md items-center justify-between">
                                <button type="button" onClick={handleBack} className="flex min-h-11 items-center gap-1.5 text-[#003E48]/70">
                                    <ArrowLeft className="h-5 w-5" />
                                    <span className="text-sm font-medium">Back</span>
                                </button>
                                <div className="flex flex-col items-center">
                                    <ProgressDots current={step - 1} total={TOTAL_FORM_STEPS} />
                                    <span className="mt-1 text-xs text-[#003E48]/45">
                                        Step {step} of {TOTAL_FORM_STEPS}
                                    </span>
                                </div>
                                <div className="w-16" />
                            </div>
                        </div>
                        <div className="mx-auto max-w-md px-5 pb-32 pt-8">{stepBody}</div>
                        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-[#003E48]/10 bg-white/90 px-4 py-4 backdrop-blur-sm">
                            <div className="mx-auto flex max-w-md">{footer}</div>
                        </div>
                    </>
                )}
            </div>
        </Shell>
    );
}

export default PreRegistrationWizard;
