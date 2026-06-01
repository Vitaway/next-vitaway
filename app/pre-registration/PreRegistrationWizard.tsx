'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PreRegistrationPayload } from '@/lib/api/types';
import { preRegistrationService } from '@/lib/api/services/preRegistration';
import { APIError } from '@/lib/api/client';

import WelcomeStep from './steps/WelcomeStep';
import Step1JoiningAs from './steps/Step1JoiningAs';
import Step2AboutYou from './steps/Step2AboutYou';
import Step3Goals from './steps/Step3Goals';
import Step4HealthLifestyle from './steps/Step4HealthLifestyle';
import Step5Preferences from './steps/Step5Preferences';
import Step6Consent from './steps/Step6Consent';
import ConfirmationStep from './steps/ConfirmationStep';

// Step indices (0 = welcome, 1–6 = form steps, 7 = confirmation)
const TOTAL_FORM_STEPS = 6;

function ProgressDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i < current
                            ? 'bg-[#E85A2E] w-2 h-2'
                            : i === current
                                ? 'bg-[#E85A2E] w-5 h-2'
                                : 'bg-gray-200 w-2 h-2'
                        }`}
                />
            ))}
        </div>
    );
}

function PreRegistrationWizard() {
    const [step, setStep] = useState(0); // 0 = welcome, 1-6 = form, 7 = confirmation
    const [data, setData] = useState<Partial<PreRegistrationPayload>>({});
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');

    const updateData = (patch: Partial<PreRegistrationPayload>) => {
        setData((prev) => ({ ...prev, ...patch }));
        setErrors([]);
    };

    const validateStep = (): string[] => {
        switch (step) {
            case 1: return preRegistrationService.validate.step1(data);
            case 2: return preRegistrationService.validate.step2(data);
            case 3: return preRegistrationService.validate.step3();
            case 4: return preRegistrationService.validate.step4();
            case 5: return preRegistrationService.validate.step5();
            case 6: return preRegistrationService.validate.step6(data);
            default: return [];
        }
    };

    const handleNext = async () => {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setErrors([]);
        setStep((s) => Math.max(1, s - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSubmissionError('');
        try {
            const result = await preRegistrationService.submit(data as PreRegistrationPayload);
            setReferenceNumber(result.data?.reference_number || '');
            setStep(7);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Welcome screen
    if (step === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#E85A2E]/5 to-white flex items-start justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <WelcomeStep onStart={() => setStep(1)} />
                </div>
            </div>
        );
    }

    // Confirmation screen
    if (step === 7) {
        return (
            <div className="min-h-screen bg-white flex items-start justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <ConfirmationStep referenceNumber={referenceNumber} />
                </div>
            </div>
        );
    }

    // Form steps 1–6
    const formStep = step - 1; // 0-indexed for progress (0–5)
    const isLastStep = step === 6;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E85A2E]/3 to-white">
            {/* Header bar */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors py-1"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="flex flex-col items-center">
                        <ProgressDots current={formStep} total={TOTAL_FORM_STEPS} />
                        <span className="text-xs text-gray-400 mt-1">Step {step} of {TOTAL_FORM_STEPS}</span>
                    </div>

                    <div className="w-16" /> {/* spacer */}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
                <div
                    className="h-full bg-gradient-to-r from-[#E85A2E] to-[#005f70] transition-all duration-500"
                    style={{ width: `${(step / TOTAL_FORM_STEPS) * 100}%` }}
                />
            </div>

            {/* Step content */}
            <div className="max-w-md mx-auto px-4 pt-6 pb-32">
                {step === 1 && <Step1JoiningAs data={data} errors={errors} onChange={updateData} />}
                {step === 2 && <Step2AboutYou data={data} errors={errors} onChange={updateData} />}
                {step === 3 && <Step3Goals data={data} errors={errors} onChange={updateData} />}
                {step === 4 && <Step4HealthLifestyle data={data} errors={errors} onChange={updateData} />}
                {step === 5 && <Step5Preferences data={data} errors={errors} onChange={updateData} />}
                {step === 6 && <Step6Consent data={data} errors={errors} onChange={updateData} />}
            </div>

            {/* Submission error */}
            {submissionError && (
                <div className="fixed bottom-28 left-0 right-0 px-4 z-20">
                    <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                        {submissionError}
                    </div>
                </div>
            )}

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-4 py-4 z-10">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-b from-[#E85A2E] to-[#E85A2E] text-white font-semibold text-base shadow-lg disabled:opacity-60 active:scale-[0.98] transition-all duration-150"
                    >
                        {loading
                            ? 'Submitting…'
                            : isLastStep
                                ? 'Submit Registration'
                                : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PreRegistrationWizard;
