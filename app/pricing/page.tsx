import React from 'react'
import { Metadata } from 'next';
import pricingTable from '../../content/pricing.json';
import GuestLayout from '../layouts/GuestLayout';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';
import PressButton from '../components/buttons/press-button';

export const metadata: Metadata = {
    title: "Pricings",
    description: "Discover Vitaway's affordable healthcare plans designed to empower Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.",
    keywords: "Rwanda, healthcare, digital health, nutrition, NCDs, youth health, Vitaway, e-clinic, health education, healthy lifestyle, affordable healthcare, pricing plans",
    metadataBase: new URL("https://www.vitaway.org"),
    openGraph: {
        title: "Affordable Healthcare Solutions for Everyone",
        description: "Discover Vitaway's affordable healthcare plans designed to empower Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.",
        type: "website",
        url: "https://vitaway.com/pricing",
        images: [
            {
                url: "https://vitaway.com/images/vitaway-logo.png",
                width: 1200,
                height: 630,
                alt: "Vitaway Logo",
            },
        ],
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

function CheckIcon({ onDark }: { onDark?: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" className={`mr-3 shrink-0 rounded-full p-[3px] ${onDark ? 'bg-white/15 fill-[#5CE0C6]' : 'bg-[#003E48] fill-[#5CE0C6]'}`} viewBox="0 0 24 24" aria-hidden>
            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" />
        </svg>
    );
}

function Pricing() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        Accessible Healthcare for All on <span className="font-accent">Affordable</span> Pricing
                    </>
                }
                description="We believe that good health shouldn't be a luxury, and our transparent and budget-friendly pricing options reflect that commitment, Discover how Vitaway puts your well-being first, without compromise."
            />

            <SectionCard className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <div className="mx-auto grid max-w-sm grid-cols-1 gap-5 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
                        {pricingTable.map((plan, index) => {
                            const highlighted = Boolean(plan.highlighted);
                            const isWide = Boolean(plan.pricing);

                            return (
                                <article
                                    key={index}
                                    className={`overflow-hidden rounded-[24px] p-6 sm:p-8 ${
                                        isWide ? 'lg:col-span-3 lg:flex lg:gap-10' : ''
                                    } ${highlighted ? 'bg-[#003E48]' : 'bg-[#F6F3EE]'}`}
                                >
                                    <div className="text-left">
                                        <h4 className={`text-2xl font-bold sm:text-3xl ${highlighted ? 'text-white' : 'text-[#003E48]'}`}>
                                            {plan.title}
                                        </h4>

                                        <p className={`mt-2 text-sm font-semibold sm:text-base ${highlighted ? 'text-[#5CE0C6]' : 'text-[#E85A2E]'}`}>
                                            {plan.short_desc}
                                        </p>
                                        <p className={`mt-2 line-clamp-2 text-sm sm:text-base ${highlighted ? 'text-white/70' : 'text-[#003E48]/65'}`}>
                                            {plan.description}
                                        </p>

                                        {plan.price && (
                                            <h3 className={`mt-4 text-lg font-semibold sm:text-xl ${highlighted ? 'text-white' : 'text-[#003E48]'}`}>
                                                {plan.price}
                                                <sub className={`ml-2 text-xs font-normal sm:text-sm ${highlighted ? 'text-white/50' : 'text-[#003E48]/45'}`}>/ Month</sub>
                                            </h3>
                                        )}

                                        {plan.pricing && (
                                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {plan.pricing.map((price, priceIndex) => (
                                                    <div key={priceIndex} className="overflow-hidden rounded-[20px] bg-white p-5 text-[#003E48]">
                                                        <h3 className="text-sm font-semibold sm:text-base">
                                                            <span>{price.employees}</span>
                                                            <ul className="mt-2">
                                                                {price.price_per_employee && (
                                                                    <li className="ml-2 flex items-center text-xs font-normal text-[#003E48]/60 sm:text-sm">
                                                                        <CheckIcon />
                                                                        <span>{price.price_per_employee}</span>
                                                                    </li>
                                                                )}
                                                                <li className="ml-2 flex items-center text-xs font-normal text-[#003E48]/60 sm:text-sm">
                                                                    <CheckIcon />
                                                                    <span>{price.price_per_company}</span>
                                                                </li>
                                                            </ul>
                                                        </h3>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-8">
                                            <PressButton href={plan.cta_button_link} className="w-full">
                                                {plan.cta_button}
                                            </PressButton>
                                        </div>
                                    </div>

                                    <div className={`mt-8 ${plan.pricing ? 'lg:ml-0 lg:mt-0 lg:flex-1' : ''}`}>
                                        <h4 className={`mb-4 text-base font-bold sm:text-lg ${highlighted ? 'text-white' : 'text-[#003E48]'}`}>
                                            Plan Included
                                        </h4>

                                        <ul className="space-y-4">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li
                                                    className={`flex items-start text-xs sm:text-sm ${highlighted ? 'text-white/80' : 'text-[#003E48]/70'}`}
                                                    key={featureIndex}
                                                >
                                                    <CheckIcon onDark={highlighted} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default Pricing
