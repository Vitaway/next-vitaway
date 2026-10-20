'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import PressButton from '@/app/components/buttons/press-button';
import { SITE_EMAIL, SITE_MAILTO } from '@/content/contact';

interface Props {
    referenceNumber: string;
    when?: string;
    amount?: string;
    onDone?: () => void;
    hideHeader?: boolean;
}

function ConfirmationStep({ referenceNumber, when, amount, onDone, hideHeader = false }: Props) {
    return (
        <div className={hideHeader ? 'text-left' : 'flex flex-col items-center px-2 text-center'}>
            {hideHeader ? null : (
                <>
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#5CE0C6]/30">
                        <CheckCircle className="h-10 w-10 text-[#003E48]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-[#003E48]">You&apos;re <span className="font-accent">booked</span></h1>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#003E48]/60">
                        {when ? `${when}${amount ? ` · ${amount}` : ''}` : 'Your visit is confirmed.'}
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

            {when ? (
                <p className="mt-6 text-sm text-[#003E48]/70">{when}{amount ? ` · ${amount}` : ''}</p>
            ) : null}

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
                <a href={SITE_MAILTO} className="font-semibold text-[#E85A2E] hover:underline">
                    {SITE_EMAIL}
                </a>
            </p>
        </div>
    );
}

export default ConfirmationStep;
