'use client';

import React, { useState } from 'react';

function Chevron({ open }: { open: boolean }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-[#003E48]" aria-hidden>
            <path
                d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function FaqsCollapsable({ faqs }: { faqs: { question: string; answer: string }[] }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="flex flex-col gap-2">
            {faqs.map((faq, index) => {
                const open = openIndex === index;
                return (
                    <div
                        key={faq.question}
                        className={`rounded-[24px] transition-colors ${open ? 'bg-white' : ''}`}
                    >
                        <button
                            type="button"
                            aria-expanded={open}
                            aria-label={open ? 'Close item' : 'Open item'}
                            className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
                            onClick={() => setOpenIndex(open ? -1 : index)}
                        >
                            <Chevron open={open} />
                            <span className="pt-0.5 text-base font-bold text-[#003E48] sm:text-lg">
                                {faq.question}
                            </span>
                        </button>
                        {open && (
                            <div className="px-4 pb-5 pl-12 text-sm leading-relaxed text-[#003E48]/70 sm:px-5 sm:pl-[3.25rem] sm:text-base">
                                {faq.answer.split('\n').map((line, i) => (
                                    <p key={i} className={i > 0 ? 'mt-2' : undefined}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default FaqsCollapsable;
