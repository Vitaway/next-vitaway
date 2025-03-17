'use client';

import React, { useState } from 'react';

function FaqsCollapsable({ faqs }: { faqs: { question: string, answer: string }[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (<>
        {faqs.map((faq, index) => (
            <div className="border rounded shadow-sm" key={index}>
                <button type="button" aria-label="Open item" title="Open item" className="flex items-center justify-between w-full p-4 focus:outline-none" onClick={() => handleToggle(index)}>
                    <p className="text-base text-slate-700 font-bold">{faq.question}</p>

                    <div className="flex items-center justify-center w-8 h-8 border rounded-full">
                        <svg viewBox="0 0 24 24" className={`w-3 text-gray-600 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                            <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" points="2,7 12,17 22,7" strokeLinejoin="round"></polyline>
                        </svg>
                    </div>
                </button>

                {openIndex === index && (
                    <div className="p-4 text-slate-700">
                        {faq.answer}
                    </div>
                )}
            </div>
        ))}
    </>)
}

export default FaqsCollapsable