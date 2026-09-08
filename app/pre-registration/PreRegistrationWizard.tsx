'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';
import { preRegistrationService } from '@/lib/api/services/preRegistration';
import { APIError } from '@/lib/api/client';
import PressButton from '@/app/components/buttons/press-button';
import Logo from '@/app/components/logo';

import WelcomeStep from './steps/WelcomeStep';
import Step1JoiningAs from './steps/Step1JoiningAs';
import Step2AboutYou from './steps/Step2AboutYou';
import Step3Goals from './steps/Step3Goals';
import Step4HealthLifestyle from './steps/Step4HealthLifestyle';
import Step5Preferences from './steps/Step5Preferences';
import Step6Consent from './steps/Step6Consent';
import ConfirmationStep from './steps/ConfirmationStep';

const TOTAL_FORM_STEPS = 6;

/** Left panel mirrors booking modal: big title + short status line. */
const MODAL_ASIDE: { title: React.ReactNode; status: string }[] = [
    {
        title: (
            <>
                Welcome to <span className="font-accent">Vitaway</span>
            </>
        ),
        status: 'A few questions',
    },
    {
        title: (
            <>
                How you are <span className="font-accent">joining</span>
            </>
        ),
        status: 'Step 1 of 6',
    },
    {
        title: (
            <>
                About <span className="font-accent">you</span>
            </>
        ),
        status: 'Step 2 of 6',
    },
    {
        title: (
            <>
                Your <span className="font-accent">goals</span>
            </>
        ),
        status: 'Step 3 of 6',
    },
    {
        title: (
            <>
                Health & <span className="font-accent">lifestyle</span>
            </>
        ),
        status: 'Step 4 of 6',
    },
    {
        title: (
            <>
                Your <span className="font-accent">preferences</span>
            </>
        ),
        status: 'Step 5 of 6',
    },
    {
        title: (
            <>
                Review & <span className="font-accent">consent</span>
            </>
        ),
        status: 'Step 6 of 6',
    },
    {
        title: (
            <>
                You&apos;re <span className="font-accent">in</span>
            </>
        ),
        status: 'Submitted',
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
    return <div className="min-h-screen bg-[#003E48] p-2 sm:p-3">{children}</div>;
}

type WizardProps = {
    variant?: 'page' | 'modal';
    onClose?: () => void;
};

function PreRegistrationWizard({ variant = 'page', onClose }: WizardProps) {
    const isModal = variant === 'modal';
    const contentRef = useRef<HTMLDivElement>(null);
    const [step, setStep] = useState(0);
    const [data, setData] = useState<Partial<PreRegistrationPayload>>({});
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');

    const updateData = (patch: Partial<PreRegistrationPayload>) => {
        setData((prev) => ({ ...prev, ...patch }));
        setErrors([]);
    };

    const scrollTop = () => {
        if (isModal) {
            contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const validateStep = (): string[] => {
        switch (step) {
            case 1:
                return preRegistrationService.validate.step1(data);
            case 2:
                return preRegistrationService.validate.step2(data);
            case 3:
                return preRegistrationService.validate.step3();
            case 4:
                return preRegistrationService.validate.step4();
            case 5:
                return preRegistrationService.validate.step5();
            case 6:
                return preRegistrationService.validate.step6(data);
            default:
                return [];
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSubmissionError('');
        try {
            const result = await preRegistrationService.submit(data as PreRegistrationPayload);
            setReferenceNumber(result.data?.reference_number || '');
            setStep(7);
            scrollTop();
        } catch (err) {
            if (err instanceof APIError) {
                setSubmissionError(err.message);
            } else {
                setSubmissionError('Submission failed. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (step === 0) {
            setStep(1);
            scrollTop();
            return;
        }
        const errs = validateStep();
        if (errs.length > 0) {
            setErrors(errs);
            return;
        }
        if (step === 6) {
            await handleSubmit();
            return;
        }
        setStep((s) => s + 1);
        scrollTop();
    };

    const handleBack = () => {
        setErrors([]);
        setStep((s) => Math.max(0, s - 1));
        scrollTop();
    };

    const formStep = Math.max(0, step - 1);
    const isLastStep = step === 6;
    const aside = MODAL_ASIDE[step];

    const stepBody = (
        <>
            {step === 0 && <WelcomeStep onStart={() => setStep(1)} compact={isModal} />}
            {step === 1 && (
                <Step1JoiningAs data={data} errors={errors} onChange={updateData} hideHeader={isModal} />
            )}
            {step === 2 && (
                <Step2AboutYou data={data} errors={errors} onChange={updateData} hideHeader={isModal} />
            )}
            {step === 3 && (
                <Step3Goals data={data} errors={errors} onChange={updateData} hideHeader={isModal} />
            )}
            {step === 4 && (
                <Step4HealthLifestyle data={data} errors={errors} onChange={updateData} hideHeader={isModal} />
            )}
            {step === 5 && (
                <Step5Preferences data={data} errors={errors} onChange={updateData} hideHeader={isModal} />
            )}
            {step === 6 && (
                <Step6Consent data={data} errors={errors} onChange={updateData} hideHeader={isModal} />
            )}
            {step === 7 && (
                <ConfirmationStep
                    referenceNumber={referenceNumber}
                    onDone={onClose}
                    hideHeader={isModal}
                />
            )}
        </>
    );

    if (isModal) {
        return (
            <div className="grid min-h-[560px] md:grid-cols-[minmax(260px,30%)_1fr] md:min-h-[640px]">
                <aside className="flex flex-col justify-between bg-[#003E48] p-6 text-white sm:p-8 md:rounded-l-[28px]">
                    <div>
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                            <Logo className="h-8 w-8 object-contain" />
                        </div>
                        <h3 className="text-2xl font-bold leading-tight sm:text-3xl">{aside.title}</h3>
                        <p className="mt-3 text-lg text-white/85">{aside.status}</p>
                    </div>
                    <p className="mt-10 text-sm text-white/55">About five minutes. No account needed.</p>
                </aside>

                <div className="flex max-h-[min(90vh,760px)] min-h-0 flex-col">
                    <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
                        <h3 id="prereg-modal-title" className="sr-only">
                            Pre-register
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

                        {submissionError ? <p className="mt-3 text-sm text-red-600">{submissionError}</p> : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-[#003E48]/08 px-6 py-4 sm:px-8">
                        {step < 7 ? (
                            <>
                                <button
                                    type="button"
                                    onClick={step === 0 ? onClose : handleBack}
                                    className="rounded-full px-5 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#F6F3EE]"
                                >
                                    {step === 0 ? 'Cancel' : 'Back'}
                                </button>
                                <PressButton
                                    type="button"
                                    className="ml-auto"
                                    disabled={loading}
                                    onClick={handleNext}
                                >
                                    {loading
                                        ? 'Submitting…'
                                        : step === 0
                                          ? 'Get started'
                                          : isLastStep
                                            ? 'Submit registration'
                                            : 'Continue'}
                                </PressButton>
                            </>
                        ) : (
                            <PressButton type="button" className="ml-auto" onClick={onClose}>
                                Done
                            </PressButton>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const pageCard = (
        <div className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-[22px] bg-[#F6F3EE] sm:min-h-[calc(100vh-24px)] sm:rounded-[28px]">
            {step === 0 || step === 7 ? (
                <div className="flex min-h-[calc(100vh-16px)] items-start justify-center px-5 py-10 sm:min-h-[calc(100vh-24px)]">
                    <div className="w-full max-w-md">{stepBody}</div>
                </div>
            ) : (
                <>
                    <div className="sticky top-0 z-10 border-b border-[#003E48]/10 bg-white/90 px-4 py-3 backdrop-blur-sm">
                        <div className="mx-auto flex max-w-md items-center justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center gap-1.5 py-1 text-[#003E48]/70 transition-colors hover:text-[#003E48]"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="text-sm font-medium">Back</span>
                            </button>
                            <div className="flex flex-col items-center">
                                <ProgressDots current={formStep} total={TOTAL_FORM_STEPS} />
                                <span className="mt-1 text-xs text-[#003E48]/45">
                                    Step {step} of {TOTAL_FORM_STEPS}
                                </span>
                            </div>
                            <div className="w-16" />
                        </div>
                    </div>
                    <div className="h-1 bg-[#003E48]/10">
                        <div
                            className="h-full bg-[#E85A2E] transition-all duration-500"
                            style={{ width: `${(step / TOTAL_FORM_STEPS) * 100}%` }}
                        />
                    </div>
                    <div className="mx-auto max-w-md px-5 pb-32 pt-6">{stepBody}</div>
                    {submissionError ? (
                        <div className="fixed bottom-28 left-0 right-0 z-20 px-4">
                            <div className="mx-auto max-w-md rounded-[24px] border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                                {submissionError}
                            </div>
                        </div>
                    ) : null}
                    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-[#003E48]/10 bg-white/90 px-4 py-4 backdrop-blur-sm">
                        <div className="mx-auto max-w-md">
                            <PressButton onClick={handleNext} disabled={loading} className="w-full">
                                {loading ? 'Submitting…' : isLastStep ? 'Submit Registration' : 'Continue'}
                            </PressButton>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return <Shell>{pageCard}</Shell>;
}

export default PreRegistrationWizard;
