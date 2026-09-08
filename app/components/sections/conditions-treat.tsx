'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import PressButton from '../buttons/press-button';
import SectionCard from './section-card';

const conditions = [
    {
        id: 'weight',
        label: 'Weight',
        headline: 'Losing it in a way that holds — on Rwandan food, not an imported diet sheet.',
        href: '/programs/well-being',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80',
        clinician: {
            name: 'Joseph Karemera',
            role: 'Senior Nutritionist',
            image: '/images/members/Joseph.jpg',
            quote: 'We do not chase a number on a scale. We change what is on the plate until the number follows.',
        },
        treatments: ['Meal plans that hold', 'Weekly coaching'],
    },
    {
        id: 'pressure',
        label: 'Blood pressure',
        headline: 'Salt, weight, alcohol, stress — named, measured, and worked on until the reading drops.',
        href: '/appointments',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=80',
        clinician: {
            name: 'Martine Umuhire',
            role: 'Nutritionist',
            image: '/images/members/marthe-umuhire.jpeg',
            quote: 'Most people have never had their blood pressure explained. We sit with the reading until it makes sense.',
        },
        treatments: ['Diet for hypertension', 'Follow-up checks'],
    },
    {
        id: 'sugar',
        label: 'Blood sugar',
        headline: 'Newly told, or living with it. Type 1 and Type 2 counselling that stays with you.',
        href: '/programs/well-being',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=80',
        clinician: {
            name: 'Ally Niyonkuru',
            role: 'Nutritionist',
            image: '/images/members/ally.jpeg',
            quote: 'Glucose is a number you can move. We show you how, then we check again at week twelve.',
        },
        treatments: ['Diabetes counselling', 'Glucose tracking'],
    },
    {
        id: 'family',
        label: 'Family nutrition',
        headline: 'Feeding a household well — children, pregnancy, and the food you already cook.',
        href: '/programs/life-stages',
        image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1800&q=80',
        clinician: {
            name: 'Ange Celeste',
            role: 'Nurse & Nutrition Associate',
            image: '/images/members/Ange.jpeg',
            quote: 'A plan that only works for one person in the house does not last. We build for the table.',
        },
        treatments: ['Life-stage plans', 'Household meals'],
    },
];

const Autoplay: KeenSliderPlugin = (slider) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;

    const clearNextTimeout = () => clearTimeout(timeout);
    const nextTimeout = () => {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => slider.next(), 6500);
    };

    slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
        });
        slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
        });
        nextTimeout();
    });
    slider.on('dragStarted', clearNextTimeout);
    slider.on('animationEnded', nextTimeout);
    slider.on('updated', nextTimeout);
};

function ArrowButton({
    direction,
    onClick,
}: {
    direction: 'prev' | 'next';
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={direction === 'prev' ? 'Previous condition' : 'Next condition'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F3EE] text-[#003E48] transition hover:bg-[#E8F7F4]"
        >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                {direction === 'prev' ? (
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                )}
            </svg>
        </button>
    );
}

function ConditionsTreat() {
    const [index, setIndex] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            drag: true,
            rubberband: true,
            mode: 'snap',
            slides: { perView: 1.12, spacing: 16 },
            breakpoints: {
                '(min-width: 768px)': { slides: { perView: 1.18, spacing: 20 } },
                '(min-width: 1280px)': { slides: { perView: 1.22, spacing: 22 } },
            },
            slideChanged(slider) {
                setIndex(slider.track.details.rel);
            },
        },
        [Autoplay],
    );

    return (
        <SectionCard overflow="visible" className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                        Conditions we <span className="font-accent">treat</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <ArrowButton direction="prev" onClick={() => instanceRef.current?.prev()} />
                        <div className="flex items-center gap-1.5">
                            {conditions.map((item, i) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-label={`Show ${item.label}`}
                                    onClick={() => instanceRef.current?.moveToIdx(i)}
                                    className={`rounded-full transition ${
                                        i === index ? 'h-2.5 w-6 bg-[#003E48]' : 'h-2 w-2 bg-[#003E48]/25'
                                    }`}
                                />
                            ))}
                        </div>
                        <ArrowButton direction="next" onClick={() => instanceRef.current?.next()} />
                    </div>
                </div>
            </div>

            <div className="relative mt-8 -mr-2 pl-5 sm:-mr-3 lg:pl-10">
                <div ref={sliderRef} className="keen-slider cursor-grab active:cursor-grabbing select-none">
                    {conditions.map((item) => (
                        <div key={item.id} className="keen-slider__slide">
                            <article className="relative min-h-[460px] overflow-hidden rounded-[24px] sm:min-h-[500px] sm:rounded-[28px] lg:min-h-[540px]">
                                <Image
                                    src={item.image}
                                    alt={item.label}
                                    fill
                                    draggable={false}
                                    sizes="90vw"
                                    className="pointer-events-none object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#003E48]/88 via-[#003E48]/45 to-[#003E48]/20" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#003E48]/70 via-transparent to-transparent" />

                                <div className="relative z-10 flex min-h-[460px] flex-col justify-end gap-6 p-6 sm:min-h-[500px] sm:p-8 lg:min-h-[540px] lg:flex-row lg:items-end lg:justify-between lg:p-10">
                                    <div className="max-w-xl">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5CE0C6]">
                                            {item.label}
                                        </p>
                                        <h3 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-[34px]">
                                            {item.headline}
                                        </h3>
                                        <div className="mt-5">
                                            <PressButton href={item.href} size="sm">
                                                Learn more
                                            </PressButton>
                                        </div>
                                    </div>

                                    <aside className="w-full max-w-sm rounded-[24px] bg-white/95 p-5 shadow-[0_12px_40px_rgba(0,62,72,0.18)] backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                                <Image
                                                    src={item.clinician.image}
                                                    alt={item.clinician.name}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover object-top"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#003E48]">{item.clinician.name}</p>
                                                <p className="text-xs text-[#003E48]/60">{item.clinician.role}</p>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm italic leading-relaxed text-[#003E48]/80">
                                            “{item.clinician.quote}”
                                        </p>
                                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#003E48]/45">
                                            How we work
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item.treatments.map((treatment) => (
                                                <Link
                                                    key={treatment}
                                                    href={item.href}
                                                    className="rounded-full border border-[#003E48]/20 px-3 py-1.5 text-xs font-semibold text-[#003E48] transition hover:border-[#5CE0C6] hover:bg-[#E8F7F4]"
                                                >
                                                    {treatment}
                                                </Link>
                                            ))}
                                        </div>
                                    </aside>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default ConditionsTreat;
