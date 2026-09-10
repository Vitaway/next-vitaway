'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
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
}: {
    card: OfferingCard;
    large?: boolean;
}) {
    return (
        <Link
            href={card.href}
            className={`group relative overflow-hidden rounded-[28px] ${
                large ? 'min-h-[340px] sm:min-h-[400px]' : 'min-h-[240px] sm:min-h-[280px]'
            }`}
        >
            <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={large ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003E48]/95 via-[#003E48]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
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
                    className="object-cover"
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
                <article className="grid min-h-[280px] overflow-hidden rounded-[28px] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.12)] md:grid-cols-2">
                    <div className="flex flex-col justify-center p-6 sm:p-10">
                        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            {section.title}
                        </h2>
                        {section.body ? (
                            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#003E48]/70">{section.body}</p>
                        ) : null}
                    </div>
                    <div className="relative min-h-[220px] md:min-h-full">
                        <Image
                            src={sectionImage(section)}
                            alt=""
                            fill
                            className="object-cover"
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
            </div>
        </SectionCard>
    );
}

type SectionGroup =
    | { type: 'pair'; sections: [OfferingSection, OfferingSection] }
    | { type: 'body'; section: OfferingSection }
    | { type: 'items'; section: OfferingSection };

function groupSections(sections: OfferingSection[]): SectionGroup[] {
    const groups: SectionGroup[] = [];
    let i = 0;
    while (i < sections.length) {
        const current = sections[i];
        const next = sections[i + 1];
        if (isBodyOnly(current) && next && isBodyOnly(next)) {
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
                <SectionCard className="bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            What we help <span className="font-accent">with</span>
                        </h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {content.secondaryCards.map((card) => (
                                <PhotoCard key={card.href} card={card} />
                            ))}
                        </div>
                    </div>
                </SectionCard>
            ) : null}

            {content.sections ? <OfferingSections sections={content.sections} /> : null}

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
    return (
        <GuestLayout>
            <PageHeader
                title={titleWithAccent(content.title, content.accentWord)}
                description={content.description}
                backgroundImage={content.heroImage}
                actions={<CtaRow ctas={content.ctas} tone="hero" />}
            />

            <OfferingSections sections={content.sections} />

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
