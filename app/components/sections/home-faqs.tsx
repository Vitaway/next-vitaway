'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import SectionCard from './section-card';

const faqs = [
    {
        question: 'What happens at a first visit?',
        answer: 'About an hour. We measure weight, waist, blood pressure, sugar, and what you eat. A nutritionist explains the numbers, then you leave with a plan built on food you already cook.',
    },
    {
        question: 'Do I have to come to the clinic in Kigali?',
        answer: 'The cabinet is in Niboye, Kicukiro. Vitaway Plus carries your plan, appointments, and measurements between visits, and remote coaching is available if you cannot come in.',
    },
    {
        question: 'Is the app free?',
        answer: 'Basic access is free. Premium coaching and personalised meal planning are paid. You can book a clinic visit without downloading anything.',
    },
    {
        question: 'Who is this for?',
        answer: 'Families, organisations, and people living with — or at risk of — diabetes, hypertension, and weight-related conditions. If the numbers matter, you can start here.',
    },
    {
        question: 'How do I book?',
        answer: 'Use the bar at the bottom of this page, or WhatsApp us. A health check takes about an hour.',
    },
];

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

function HomeFaqs() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
            <div className="mx-auto grid max-w-[1440px] gap-10 px-5 lg:grid-cols-12 lg:gap-16 lg:px-12">
                <div className="lg:col-span-5">
                    <h2 className="max-w-sm text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                        Before you book, here is what people <span className="font-accent">ask</span>.
                    </h2>
                    <a
                        href="https://wa.me/250787279560"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#E85A2E] hover:underline"
                    >
                        Still stuck? WhatsApp us
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                        </svg>
                    </a>
                    <div className="mt-3">
                        <Link href="/faqs" className="text-sm font-medium text-[#003E48]/60 hover:text-[#003E48] hover:underline">
                            See every answer →
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-7">
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
                                        onClick={() => setOpenIndex(open ? -1 : index)}
                                        className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
                                    >
                                        <Chevron open={open} />
                                        <span className="pt-0.5 text-base font-bold text-[#003E48] sm:text-lg">
                                            {faq.question}
                                        </span>
                                    </button>
                                    {open && (
                                        <p className="px-4 pb-5 pl-12 text-sm leading-relaxed text-[#003E48]/70 sm:px-5 sm:pl-[3.25rem] sm:text-base">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default HomeFaqs;
