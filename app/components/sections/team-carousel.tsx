'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { memberImageClass } from '@/lib/member-image-focus';
import membersData from '../../../content/members.json';
import SectionCard from './section-card';

type Member = {
    name: string;
    slug: string;
    role: string;
    description: string;
    image: string;
};

const SKIP_ROLES = new Set([
    'Software Engineer',
    'AI Data Engineer',
    'Front Desk & Administrative Assistant',
]);

const members: Member[] = [
    ...membersData.clinical_members,
    ...membersData.coaching_team,
].filter((member) => !SKIP_ROLES.has(member.role));

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
            aria-label={direction === 'prev' ? 'Previous team members' : 'Next team members'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#003E48] transition hover:bg-[#E8F7F4]"
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

function TeamCarousel() {
    const [index, setIndex] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            drag: true,
            rubberband: true,
            mode: 'snap',
            slides: { perView: 1.2, spacing: 16 },
            breakpoints: {
                '(min-width: 640px)': { slides: { perView: 2.25, spacing: 18 } },
                '(min-width: 1024px)': { slides: { perView: 3.35, spacing: 22 } },
            },
            slideChanged(slider) {
                setIndex(slider.track.details.rel);
            },
        },
        [Autoplay],
    );

    return (
        <SectionCard overflow="visible" className="bg-[#F6F3EE] py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                        People you will actually <span className="font-accent">meet</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/our-team"
                            className="text-sm font-semibold text-[#E85A2E] hover:underline"
                        >
                            See everyone
                        </Link>
                        <div className="flex items-center gap-3">
                            <ArrowButton direction="prev" onClick={() => instanceRef.current?.prev()} />
                            <div className="flex items-center gap-1.5">
                                {members.map((member, i) => (
                                    <button
                                        key={member.slug}
                                        type="button"
                                        aria-label={`Show ${member.name}`}
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
            </div>

            <div className="relative mt-10 -mr-2 pl-5 sm:-mr-3 lg:pl-12">
                <div ref={sliderRef} className="keen-slider cursor-grab active:cursor-grabbing select-none">
                    {members.map((member) => (
                        <article
                            key={member.slug}
                            className="keen-slider__slide overflow-hidden rounded-[24px] bg-white shadow-[0_10px_32px_rgba(0,62,72,0.07)]"
                        >
                            <div className="relative aspect-square bg-[#EEF6F4]">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    draggable={false}
                                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 85vw"
                                    className={`pointer-events-none ${memberImageClass(member.slug)}`}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-[#003E48] px-4 py-2">
                                    <p className="truncate text-xs font-semibold text-white sm:text-sm">{member.role}</p>
                                </div>
                            </div>
                            <div className="flex min-h-[168px] flex-col p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#003E48]/45">
                                    Vitaway Health · Kigali
                                </p>
                                <h3 className="mt-1.5 text-xl font-bold leading-tight text-[#003E48]">
                                    {member.name.trim()}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-[#E85A2E]">{member.role} | Niboye</p>
                                <p className="mt-3 line-clamp-2 text-sm text-[#003E48]/65">{member.description}</p>
                                <Link
                                    href={`/our-team/members/${member.slug}`}
                                    className="mt-auto inline-flex w-fit rounded-full bg-[#003E48] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#002f36]"
                                >
                                    Know more
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default TeamCarousel;
