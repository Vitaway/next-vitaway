'use client';

import React, { useState } from 'react';

function FaqsCollapsable({ faqs }: { faqs: { question: string, answer: string }[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (<>
        {faqs.map((faq, index) => (
            <div className="border rounded shadow-sm mb-4 transition-shadow hover:shadow-md" key={index}>
                <button
                    type="button"
                    aria-label={openIndex === index ? "Close item" : "Open item"}
                    title={openIndex === index ? "Close item" : "Open item"}
                    className="flex items-center justify-between w-full p-4 focus:outline-none bg-white"
                    onClick={() => handleToggle(index)}
                >
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-lg">
                            {index + 1}
                        </span>
                        <p className="text-base text-slate-700 font-bold">{faq.question}</p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border rounded-full bg-gray-50">
                        <svg
                            viewBox="0 0 24 24"
                            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                        >
                            <polyline
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                points="2,7 12,17 22,7"
                                strokeLinejoin="round"
                            ></polyline>
                        </svg>
                    </div>
                </button>

                {openIndex === index && (
                    <div className="p-4 text-slate-700 bg-blue-50 border-t animate-fade-in">
                        <ul className="list-disc list-inside space-y-2">
                            {faq.answer.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ))}
    </>)
}

export default FaqsCollapsable