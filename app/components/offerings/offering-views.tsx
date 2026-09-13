'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import GuestLayout from '@/app/layouts/GuestLayout';
import PageHeader from '@/app/components/headers/page-header';
import SectionCard from '@/app/components/sections/section-card';
import FaqsCollapsable from '@/app/components/sections/faqs-collapsable';
import PressButton from '@/app/components/buttons/press-button';
import { useBooking } from '@/app/components/booking/booking-context';
import type {
    OfferingCard,
    OfferingCta,
    OfferingHubContent,
    OfferingPageContent,
    OfferingSection,
} from '@/content/offerings';
import { SITE_WHATSAPP_URL } from '@/content/contact';

function titleWithAccent(title: string, accentWord?: string) {
    if (!accentWord || !title.includes(accentWord)) return title;
    const index = title.indexOf(accentWord);
    return (
        <>
            {title.slice(0, index)}
            <span className="font-accent">{accentWord}</span>
            {title.slice(index + accentWord.length)}
        </>
    );
}

function CtaRow({
    ctas,
    className = '',
    tone = 'page',
}: {
    ctas: OfferingCta[];
    className?: string;
    tone?: 'page' | 'hero';
}) {
    const { openBooking } = useBooking();

    return (
        <div className={`flex flex-wrap gap-3 ${className}`}>
            {ctas.map((cta) => {
                const variant = cta.variant ?? 'primary';
                const surface = tone === 'hero' ? 'dark' : variant === 'secondary' ? 'light' : 'dark';
                if (cta.action === 'book') {
                    return (
                        <PressButton key={cta.label} variant={variant} surface={surface} onClick={() => openBooking()}>
                            {cta.label}
                        </PressButton>
                    );
                }
                if (cta.action === 'whatsapp') {
                    return (
                        <PressButton
                            key={cta.label}
                            href={SITE_WHATSAPP_URL}
                            variant={variant}
                            surface={surface}
                        >
                            {cta.label}
                        </PressButton>
                    );
                }
                if (cta.action === 'contact') {
                    return (
                        <PressButton key={cta.label} href="/contacts" variant={variant} surface={surface}>
                            {cta.label}
                        </PressButton>
                    );
                }
                return (
                    <PressButton key={cta.label} href={cta.href} variant={variant} surface={surface}>
                        {cta.label}
                    </PressButton>
                );
            })}
        </div>
    );
}

function PhotoCard({
    card,
    large = false,
    className = '',
}: {
    card: OfferingCard;
    large?: boolean;
    className?: string;
}) {
    return (
        <Link
            href={card.href}
            className={`group relative overflow-hidden rounded-[28px] ${
                large ? 'min-h-[340px] sm:min-h-[400px]' : 'min-h-[240px] sm:min-h-[280px]'
            } ${className}`}
        >
            <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
                sizes={large ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003E48]/95 via-[#003E48]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                {card.label ? (
                    <p className="mb-2 text-sm font-semibold text-[#5CE0C6]">{card.label}</p>
                ) : null}
                <h3 className={`font-bold text-white ${large ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                    {card.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{card.description}</p>
                {card.cta ? (
                    <span className="mt-4 inline-block text-sm font-semibold text-[#5CE0C6]">{card.cta} →</span>
                ) : null}
            </div>
        </Link>
    );
}

function SecondaryCardsSlideshow({ cards }: { cards: OfferingCard[] }) {
    const [index, setIndex] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: 'snap',
        slides: { perView: 1.15, spacing: 14 },
        breakpoints: {
            '(min-width: 640px)': { slides: { perView: 1.5, spacing: 16 } },
            '(min-width: 1024px)': { slides: { perView: 2.2, spacing: 18 } },
        },
        slideChanged(slider) {
            setIndex(slider.track.details.rel);
        },
    });

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                    What we help <span className="font-accent">with</span>
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Previous"
                        onClick={() => instanceRef.current?.prev()}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F3EE] text-[#003E48] transition hover:bg-[#E8F7F4]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-1.5">
                        {cards.map((card, i) => (
                            <button
                                key={card.href}
                                type="button"
                                aria-label={`Show ${card.title}`}
                                onClick={() => instanceRef.current?.moveToIdx(i)}
                                className={`rounded-full transition ${
                                    i === index ? 'h-2.5 w-6 bg-[#003E48]' : 'h-2 w-2 bg-[#003E48]/25'
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        aria-label="Next"
                        onClick={() => instanceRef.current?.next()}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F3EE] text-[#003E48] transition hover:bg-[#E8F7F4]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div ref={sliderRef} className="keen-slider mt-8 !overflow-visible">
                {cards.map((card) => (
                    <div key={card.href} className="keen-slider__slide min-h-[280px] sm:min-h-[300px]">
                        <PhotoCard card={card} className="block h-full min-h-[280px] w-full sm:min-h-[300px]" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProcessStrip({ items }: { items: { title: string; body: string }[] }) {
    return (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
            {items.map((item, index) => (
                <div
                    key={item.title}
                    className="relative overflow-hidden rounded-[24px] bg-[#003E48] p-6 text-white"
                >
                    <span className="font-accent text-5xl leading-none text-[#5CE0C6]/50">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-xl font-bold tracking-wide">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
                </div>
            ))}
        </div>
    );
}

function ItemGrid({ items }: { items: { title: string; body: string }[] }) {
    return (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <div
                    key={item.title}
                    className="rounded-[24px] border border-[#003E48]/08 bg-white p-5 shadow-[0_10px_30px_rgba(0,62,72,0.06)] sm:p-6"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF6F4] text-sm font-bold text-[#003E48]">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#003E48]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#003E48]/65">{item.body}</p>
                </div>
            ))}
        </div>
    );
}

const SECTION_IMAGE_FALLBACK = '/images/clinic/clinical-consultation.jpg';

function isBodyOnly(section: OfferingSection) {
    return Boolean(section.body && !section.items?.length);
}

function isProcessSection(section: OfferingSection) {
    return Boolean(
        section.items?.length === 3 &&
            section.items.every((item) => item.title === item.title.toUpperCase() && item.title.length <= 8),
    );
}

function sectionImage(section: OfferingSection) {
    return section.image?.trim() || SECTION_IMAGE_FALLBACK;
}

/** One narrative card in a side-by-side pair: photo on top, copy below */
function BodyFeatureCard({ section }: { section: OfferingSection }) {
    return (
        <article className="overflow-hidden rounded-[28px] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.12)]">
            <div className="relative h-48 w-full sm:h-56">
                <Image
                    src={sectionImage(section)}
                    alt=""
                    fill
                    className={section.imageClassName?.trim() || 'object-cover'}
                    sizes="(min-width: 768px) 50vw, 100vw"
                />
            </div>
            <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold tracking-tight text-[#003E48] sm:text-[1.65rem] leading-snug">
                    {section.title}
                </h2>
                {section.body ? (
                    <p className="mt-3 text-sm leading-relaxed text-[#003E48]/70 sm:text-[15px]">{section.body}</p>
                ) : null}
            </div>
        </article>
    );
}

/** Full-width narrative: same card language, always with a photo */
function BodySplitSection({ section, tone }: { section: OfferingSection; tone: 'cream' | 'teal' }) {
    return (
        <SectionCard className={`${tone === 'teal' ? 'bg-[#003E48]' : 'bg-[#F6F3EE]'} py-10 sm:py-14`}>
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <article className="grid min-h-[280px] overflow-hidden rounded-[28px] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.12)] md:grid-cols-2 md:min-h-[380px]">
                    <div className="flex flex-col justify-center p-6 sm:p-10">
                        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            {section.title}
                        </h2>
                        {section.body ? (
                            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#003E48]/70">{section.body}</p>
                        ) : null}
                    </div>
                    <div className="relative min-h-[240px] md:min-h-full">
                        <Image
                            src={sectionImage(section)}
                            alt=""
                            fill
                            className={section.imageClassName?.trim() || 'object-cover'}
                            sizes="(min-width: 768px) 45vw, 100vw"
                        />
                    </div>
                </article>
            </div>
        </SectionCard>
    );
}

function ItemsSection({ section, tone }: { section: OfferingSection; tone: 'cream' | 'white' }) {
    return (
        <SectionCard className={`${tone === 'cream' ? 'bg-[#F6F3EE]' : 'bg-white'} py-12 sm:py-16`}>
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">{section.title}</h2>
                {section.body ? (
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#003E48]/70">{section.body}</p>
                ) : null}
                {section.items
                    ? isProcessSection(section)
                        ? <ProcessStrip items={section.items} />
                        : <ItemGrid items={section.items} />
                    : null}
                {section.footer ? (
                    <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-[#003E48] sm:text-lg">
                        {section.footer}
                    </p>
                ) : null}
            </div>
        </SectionCard>
    );
}

function ChecklistSection({ section }: { section: OfferingSection }) {
    return (
        <SectionCard className="bg-[#003E48] py-12 sm:py-16">
            <div className="mx-auto max-w-[900px] px-5 lg:px-12">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{section.title}</h2>
                {section.body ? (
                    <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">{section.body}</p>
                ) : null}
                {section.items?.length ? (
                    <ul className="mt-8 space-y-4">
                        {section.items.map((item) => (
                            <li key={item.title} className="flex gap-3">
                                <span
                                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E85A2E] text-white"
                                    aria-hidden
                                >
                                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                                        <path
                                            d="M5 12.5l4.5 4.5L19 7.5"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <p className="text-base leading-relaxed text-white sm:text-[17px]">
                                    {item.title}
                                    {item.body ? ` — ${item.body}` : ''}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </SectionCard>
    );
}

type SectionGroup =
    | { type: 'pair'; sections: [OfferingSection, OfferingSection] }
    | { type: 'body'; section: OfferingSection }
    | { type: 'items'; section: OfferingSection }
    | { type: 'checklist'; section: OfferingSection };

function groupSections(sections: OfferingSection[]): SectionGroup[] {
    const groups: SectionGroup[] = [];
    let i = 0;
    while (i < sections.length) {
        const current = sections[i];
        const next = sections[i + 1];
        if (current.layout === 'checklist') {
            groups.push({ type: 'checklist', section: current });
            i += 1;
            continue;
        }
        if (isBodyOnly(current) && next && isBodyOnly(next) && next.layout !== 'checklist') {
            groups.push({ type: 'pair', sections: [current, next] });
            i += 2;
            continue;
        }
        if (isBodyOnly(current)) {
            groups.push({ type: 'body', section: current });
            i += 1;
            continue;
        }
        groups.push({ type: 'items', section: current });
        i += 1;
    }
    return groups;
}

function OfferingSections({ sections }: { sections: OfferingSection[] }) {
    const groups = groupSections(sections);

    return (
        <>
            {groups.map((group, index) => {
                if (group.type === 'checklist') {
                    return <ChecklistSection key={group.section.title} section={group.section} />;
                }
                if (group.type === 'pair') {
                    return (
                        <SectionCard
                            key={`${group.sections[0].title}-${group.sections[1].title}`}
                            className="bg-[#003E48] py-10 sm:py-14"
                        >
                            <div className="mx-auto grid max-w-[1440px] gap-4 px-5 md:grid-cols-2 lg:gap-5 lg:px-12">
                                {group.sections.map((section) => (
                                    <BodyFeatureCard key={section.title} section={section} />
                                ))}
                            </div>
                        </SectionCard>
                    );
                }
                if (group.type === 'body') {
                    const tone = index % 2 === 0 ? 'teal' : 'cream';
                    return <BodySplitSection key={group.section.title} section={group.section} tone={tone} />;
                }
                const tone: 'cream' | 'white' = index % 2 === 0 ? 'cream' : 'white';
                return <ItemsSection key={group.section.title} section={group.section} tone={tone} />;
            })}
        </>
    );
}

export function OfferingHubView({ content }: { content: OfferingHubContent }) {
    return (
        <GuestLayout>
            <PageHeader
                title={titleWithAccent(content.title, content.accentWord)}
                description={content.description}
                backgroundImage={content.heroImage}
                imageClassName={content.heroImageClassName}
                actions={<CtaRow ctas={content.ctas} tone="hero" />}
            />

            <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <div className={`grid gap-4 ${content.cards.length > 2 ? 'md:grid-cols-2' : 'lg:grid-cols-2'}`}>
                        {content.cards.map((card) => (
                            <PhotoCard key={card.href} card={card} large={content.cards.length <= 2} />
                        ))}
                    </div>
                </div>
            </SectionCard>

            {content.secondaryCards && content.secondaryCards.length > 0 ? (
                <SectionCard overflow="visible" className="bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                        <SecondaryCardsSlideshow cards={content.secondaryCards} />
                    </div>
                </SectionCard>
            ) : null}

            {content.sections ? <OfferingSections sections={content.sections} /> : null}

            {content.prevention ? (
                <SectionCard className="bg-[#003E48] py-12 sm:py-16">
                    <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {titleWithAccent(content.prevention.title, content.prevention.accentWord)}
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                            {content.prevention.body}
                        </p>
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {content.prevention.stats.map((stat) => (
                                <div key={stat.value}>
                                    <p className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                                        {stat.value}
                                    </p>
                                    <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        {content.prevention.source ? (
                            <p className="mt-8 text-xs text-white/45">{content.prevention.source}</p>
                        ) : null}
                    </div>
                </SectionCard>
            ) : null}

            {content.faqs && content.faqs.length > 0 ? (
                <SectionCard className="bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-[900px] px-5 lg:px-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            Questions people ask before <span className="font-accent">booking</span>
                        </h2>
                        <div className="mt-8 rounded-[28px] bg-[#F6F3EE] p-3 sm:p-4">
                            <FaqsCollapsable faqs={content.faqs} />
                        </div>
                    </div>
                </SectionCard>
            ) : null}
        </GuestLayout>
    );
}

export function OfferingPageView({ content }: { content: OfferingPageContent }) {
    const sections = content.sections ?? [];
    const firstSection = sections[0] ? [sections[0]] : [];
    const restSections = sections.slice(1);
    const highlightBefore = content.highlight?.position === 'before';

    const highlightBlock = content.highlight ? (
        <SectionCard className="bg-[#003E48] py-12 sm:py-16">
            <div className="mx-auto max-w-[900px] px-5 text-center lg:px-12">
                <p className="text-5xl font-bold tracking-tight text-[#E85A2E] sm:text-6xl lg:text-7xl">
                    {content.highlight.value}
                </p>
                <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">{content.highlight.label}</p>
                {content.highlight.source ? (
                    <p className="mt-6 text-xs text-white/45">{content.highlight.source}</p>
                ) : null}
            </div>
        </SectionCard>
    ) : null;

    return (
        <GuestLayout>
            <PageHeader
                title={titleWithAccent(content.title, content.accentWord)}
                description={content.description}
                backgroundImage={content.heroImage}
                imageClassName={content.heroImageClassName}
                actions={<CtaRow ctas={content.ctas} tone="hero" />}
            />

            {highlightBefore ? highlightBlock : null}
            {firstSection.length > 0 ? <OfferingSections sections={firstSection} /> : null}
            {!highlightBefore ? highlightBlock : null}
            {restSections.length > 0 ? <OfferingSections sections={restSections} /> : null}

            {content.faqs && content.faqs.length > 0 ? (
                <SectionCard className="bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-[900px] px-5 lg:px-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            Questions people <span className="font-accent">ask</span>
                        </h2>
                        <div className="mt-8 rounded-[28px] bg-[#F6F3EE] p-3 sm:p-4">
                            <FaqsCollapsable faqs={content.faqs} />
                        </div>
                    </div>
                </SectionCard>
            ) : null}

            {content.related && content.related.length > 0 ? (
                <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
                    <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                        <h2 className="text-2xl font-bold text-[#003E48] sm:text-3xl">
                            Related <span className="font-accent">next</span>
                        </h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {content.related.map((item) =>
                                item.image ? (
                                    <PhotoCard
                                        key={item.href}
                                        card={{
                                            href: item.href,
                                            title: item.label,
                                            description: item.description,
                                            image: item.image,
                                            cta: 'Learn more',
                                        }}
                                    />
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-[24px] bg-white p-6 transition hover:bg-[#EEF6F4]"
                                    >
                                        <h3 className="text-lg font-bold text-[#003E48]">{item.label}</h3>
                                        <p className="mt-2 text-sm text-[#003E48]/65">{item.description}</p>
                                    </Link>
                                ),
                            )}
                        </div>
                    </div>
                </SectionCard>
            ) : null}
        </GuestLayout>
    );
}
