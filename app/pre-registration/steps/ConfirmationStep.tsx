'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import PressButton from '@/app/components/buttons/press-button';

interface Props {
    referenceNumber: string;
    onDone?: () => void;
    hideHeader?: boolean;
}

function ConfirmationStep({ referenceNumber, onDone, hideHeader = false }: Props) {
    return (
        <div className={hideHeader ? 'text-left' : 'flex flex-col items-center px-2 text-center'}>
            {hideHeader ? null : (
                <>
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#5CE0C6]/30">
                        <CheckCircle className="h-10 w-10 text-[#003E48]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-[#003E48]">You&apos;re <span className="font-accent">registered</span></h1>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#003E48]/60">
                        Your pre-registration has been submitted successfully. Our team will review it and reach out to you.
                    </p>
                </>
            )}

            {referenceNumber && (
                <div className={`mt-2 w-full rounded-2xl p-4 ${hideHeader ? 'bg-[#F6F3EE]' : 'mt-6 rounded-[24px] bg-white'}`}>
                    <p className="text-xs font-medium text-[#003E48]/55">Your reference number</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-[#003E48]">{referenceNumber}</p>
                    <p className="mt-1 text-xs text-[#003E48]/45">Keep this for your records</p>
                </div>
            )}

            {/* What happens next */}
            <div className="mt-6 w-full space-y-3 text-left">
                <p className="text-sm font-semibold text-[#003E48]">What happens next?</p>
                {[
                    { step: '1', text: 'Our team reviews your registration (within 24–48 hours)' },
                    { step: '2', text: 'A nutrition specialist contacts you to confirm your appointment' },
                    { step: '3', text: 'You receive your personalised wellness plan' },
                ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#003E48]">
                            <span className="text-xs font-bold text-white">{step}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#003E48]/65">{text}</p>
                    </div>
                ))}
            </div>

            {hideHeader ? null : onDone ? (
                <PressButton onClick={onDone} className="mt-8 w-full">
                    Done
                </PressButton>
            ) : (
                <PressButton href="/" className="mt-8 w-full">
                    Back to Home
                </PressButton>
            )}

            <p className="mt-3 text-xs text-[#003E48]/45">
                Questions? Contact us at{' '}
                <a href="mailto:vitawayeclinic@gmail.com" className="font-semibold text-[#E85A2E] hover:underline">
                    vitawayeclinic@gmail.com
                </a>
            </p>
        </div>
    );
}

export default ConfirmationStep;
