import React from 'react'
import PageHeader from '../components/headers/page-header';
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import Image from 'next/image';
import SectionCard from '../components/sections/section-card';

export const metadata: Metadata = {
    title: "Who we serve",
    description: "At Vitaway, we’re on a mission to make preventive and personalized healthcare accessible to individuals, families, companies, and institutions across Rwanda and beyond. Whether you're managing a chronic condition, looking to build healthier habits, or aiming to boost your organization's wellness strategy—we’re here to support your journey.",
    keywords: "Vitaway, Blogs, Articles, Health, Wellness, Trends, News, Information, vitaway health ltd, vitaway health, health rwanda, who we serve, health programs, health management, wellness management",
    metadataBase: new URL("https://www.vitaway.org"),
    openGraph: {
        title: "Who we serve",
        description: "At Vitaway, we’re on a mission to make preventive and personalized healthcare accessible to individuals, families, companies, and institutions across Rwanda and beyond. Whether you're managing a chronic condition, looking to build healthier habits, or aiming to boost your organization's wellness strategy—we’re here to support your journey.",
        type: "website",
        url: "https://vitaway.com/serves",
        images: [
            {
                url: "https://vitaway.com/images/vitaway-logo.png",
                width: 1200,
                height: 630,
                alt: "Vitaway Logo",
            },
        ],
    },
}

const services = [
    {
        title: 'Individuals & Families',
        heading: <>Individuals & <span className="font-accent">Families</span></>,
        descriptioin: 'Personalized Health Support for Your Wellness Journey Every health journey is unique.Whether you’re living with or at risk of diabetes, hypertension, obesity, or high cholesterol, we help you take control through:',
        image: "https://images.unsplash.com/photo-1636830632657-1dcda9360a3a?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subServices: [
            {
                title: "Cabinet",
                description: "In-person support at the Vitaway Nutritional Cabinet in Kimironko.",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Coaching",
                description: "Digital coaching and care via the Vitaway+ mobile app",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Release & launch",
                description: "Personalized meal plans, physical activity guidance, mental health tools, and health tracking",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Professionals",
                description: "Ongoing coaching from licensed professionals to keep you on track",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
        ]
    },
    {
        title: 'Employers & Workplace Wellness Programs',
        heading: <>Employers & Workplace Wellness <span className="font-accent">Programs</span></>,
        descriptioin: 'Empowering Your Team, Improving Performance Healthier employees are more productive, motivated, and loyal. Vitaway partners with organizations to improve workforce well-being through:',
        image: "https://images.unsplash.com/photo-1573496130141-209d200cebd8?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subServices: [
            {
                title: "Corporate Wellness Packages ",
                description: "Pay-per-employee plans with screenings, nutrition consultations, and follow-ups",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "On-site or Virtual Workshops ",
                description: "Sessions on stress, sleep, diet, movement, and mental wellness",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Annual Subscriptions ",
                description: "Comprehensive health plans for year-round employee support",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Incentive Programs",
                description: "Employees earn rewards (badges, discounts, recognition) for healthy engagement",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
        ]
    },
    {
        title: 'Insurance Companies',
        heading: <>Insurance <span className="font-accent">Companies</span></>,
        descriptioin: 'Innovating Preventive Care with Technology We help insurers shift from reactive claims to proactive health management by integrating digital tools and data-driven insights into member care.',
        image: 'https://images.unsplash.com/photo-1610374792793-f016b77ca51a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        subServices: [
            {
                title: "Preventive Health Packages",
                description: "Co-branded health programs for early diagnosis and lifestyle management",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "AI-Powered Monitoring ",
                description: "Continuous data collection and coaching to reduce high-cost claims",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Data & Insights Licensing ",
                description: "Access to anonymized health trends for smarter underwriting and plan design",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
            {
                title: "Co-Funded Wellness Benefits ",
                description: "Joint ventures to improve client retention and population health",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>),
            },
        ]
    }
];

function WhoWeServe() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        Your well being with vitaway’s Health <span className="font-accent">Plan</span>
                    </>
                }
                description="At Vitaway, we’re on a mission to make preventive and personalized healthcare accessible to individuals, families, companies, and institutions across Rwanda and beyond. Whether you're managing a chronic condition, looking to build healthier habits, or aiming to boost your organization's wellness strategy."
                backgroundImage='https://res.cloudinary.com/dzhuhtn30/image/upload/v1671533556/vite-guest-imgs/allgo-an-app-for-plus-size-people-eqlRthvN188-unsplash_mjb1s7.jpg'
            />

            {services.map((service, serviceIndex) => (
                <SectionCard
                    key={serviceIndex}
                    className={`py-16 sm:py-20 ${serviceIndex % 2 === 0 ? 'bg-white' : 'bg-[#F6F3EE]'}`}
                >
                    <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                            <div className={serviceIndex % 2 === 1 ? 'lg:order-2' : ''}>
                                <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                                    {service.heading}
                                </h2>
                                <p className="mt-4 text-base leading-relaxed text-[#003E48]/70">
                                    {service.descriptioin}
                                </p>

                                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                                    {service.subServices.map((subService, subServiceIndex) => (
                                        <li
                                            key={subServiceIndex}
                                            className={`rounded-[24px] p-5 ${serviceIndex % 2 === 0 ? 'bg-[#F6F3EE]' : 'bg-white'}`}
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003E48] [&_g]:stroke-[#5CE0C6] [&_path]:stroke-[#5CE0C6] [&_svg]:h-5 [&_svg]:w-5">
                                                {subService.icon}
                                            </div>
                                            <h3 className="mt-4 text-lg font-bold text-[#003E48]">{subService.title}</h3>
                                            <p className="mt-1.5 text-sm leading-relaxed text-[#003E48]/65">{subService.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`relative min-h-[320px] overflow-hidden rounded-[28px] sm:min-h-[420px] ${serviceIndex % 2 === 1 ? 'lg:order-1' : ''}`}>
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    sizes="(min-width: 1024px) 45vw, 100vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#003E48]/90 via-[#003E48]/25 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            ))}
        </GuestLayout>
    )
}

export default WhoWeServe
