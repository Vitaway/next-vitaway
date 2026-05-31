'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface Props {
    referenceNumber: string;
}

function ConfirmationStep({ referenceNumber }: Props) {
    return (
        <div className="flex flex-col items-center text-center px-2">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800">You&apos;re registered!</h1>
            <p className="text-gray-500 text-sm mt-2 max-w-xs leading-relaxed">
                Your pre-registration has been submitted successfully. Our team will review it and reach out to you.
            </p>

            {/* Reference number */}
            {referenceNumber && (
                <div className="mt-6 w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Your Reference Number</p>
                    <p className="text-2xl font-bold font-mono text-[#003E48] mt-1">{referenceNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">Keep this for your records</p>
                </div>
            )}

            {/* What happens next */}
            <div className="mt-6 w-full space-y-3 text-left">
                <p className="text-sm font-semibold text-slate-700">What happens next?</p>
                {[
                    { step: '1', text: 'Our team reviews your registration (within 24–48 hours)' },
                    { step: '2', text: 'A nutrition specialist contacts you to confirm your appointment' },
                    { step: '3', text: 'You receive your personalised wellness plan' },
                ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#003E48] to-[#282e33] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{step}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                    </div>
                ))}
            </div>

            <Link href="/" className="mt-8 w-full">
                <button className="w-full py-4 rounded-2xl bg-gradient-to-b from-[#003E48] to-[#282e33] text-white font-semibold text-base shadow-md active:scale-[0.98] transition-transform duration-150">
                    Back to Home
                </button>
            </Link>

            <p className="text-xs text-gray-400 mt-3">
                Questions? Contact us at{' '}
                <a href="mailto:vitawayeclinic@gmail.com" className="text-[#003E48] underline">
                    vitawayeclinic@gmail.com
                </a>
            </p>
        </div>
    );
}

export default ConfirmationStep;
