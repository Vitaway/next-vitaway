import Image from 'next/image'
import React from 'react'
import PageHeader from '../components/headers/page-header'
import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import SectionCard from '../components/sections/section-card';

export const metadata: Metadata = {
    title: "About Vitaway Health | Our Mission to Transform Healthcare in Rwanda",
    description: "Learn about Vitaway Health's journey to revolutionize healthcare in Rwanda. Meet our expert team of nutritionists and discover how we're making quality healthcare accessible through innovative digital solutions.",
    keywords: [
        "Vitaway Health team",
        "Rwanda healthcare innovation",
        "digital health company Rwanda",
        "nutrition experts Kigali",
        "healthcare transformation",
        "preventive medicine Rwanda",
        "health tech startup",
        "telehealth pioneers",
        "wellness company Rwanda",
        "NCD prevention specialists"
    ],
    authors: [{ name: "Vitaway Health Ltd" }],
    openGraph: {
        title: "About Vitaway Health | Our Mission to Transform Healthcare in Rwanda",
        siteName: "Vitaway Health",
        description: "Learn about Vitaway Health's journey to revolutionize healthcare in Rwanda. Meet our expert team and discover our innovative digital solutions.",
        type: "website",
        url: "https://www.vitaway.org/about-us",
        images: [
            {
                url: "/images/Gallery/image-12.jpg",
                width: 1200,
                height: 630,
                alt: "Vitaway Health core team - Healthcare professionals in Rwanda"
            },
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "About Vitaway Health | Our Mission to Transform Healthcare in Rwanda",
        description: "Learn about Vitaway Health's journey to revolutionize healthcare in Rwanda. Meet our expert team and discover our innovative digital solutions.",
        images: ["/images/Gallery/image-12.jpg"],
    },
    alternates: {
        canonical: "https://www.vitaway.org/about-us",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

function AboutUs() {
    const gallery = [
        {
            image: "/images/members/emmanuel-hakuzimana-founder.jpg",
            caption: "Founder & CEO of Vitaway Health",
            description: "Emmanuel Hakuzimana, Founder & CEO of Vitaway Health, leading with purpose, passion, and a vision for a healthier Africa. We created this company to inspire and engage people in lifelong health, one step at a time.",
        },
        {
            image: "/images/clinic/finger-prick-glucometer.jpg",
            caption: "Health check in the cabinet",
            description: "Blood sugar and clinical measurements — the numbers that start every plan.",
        },
        {
            image: "/images/clinic/body-composition-scale.jpg",
            caption: "Body composition measurement",
            description: "Weight and metabolic markers, measured properly in clinic.",
        },
        {
            image: "/images/Gallery/image-5.jpg",
            caption: "All Nutritionists at Vitaway Health",
            description: "A powerhouse team of qualified nutritionists dedicated to transforming lives through evidence-based nutritional care.",
        },
        {
            image: "/images/clinic/clinical-consultation.jpg",
            caption: "Consultation in progress",
            description: "Personalised nutrition counselling — explaining the numbers until they make sense.",
        },
        {
            image: "/images/clinic/clinic-storefront-banner.jpg",
            caption: "Vitaway Nutrition Clinic",
            description: "Our branded clinic front — personalized and preventive nutrition care in Kigali.",
        },
        {
            image: "/images/clinic/clinic-exterior.jpg",
            caption: "Clinic location",
            description: "Welcome to Vitaway Nutritional Cabinet in Niboye, Kicukiro — a modern, accessible space where health and care meet.",
        },
    ];

    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        A licensed nutrition clinic. Built to stay with you after you <span className="font-accent">leave</span>.
                    </>
                }
                description="We measure, explain, and stay until the numbers move. Founded by Emmanuel Hakuzimana, RND & RN."
                backgroundImage="/images/Gallery/image-12.jpg"
            />

            <SectionCard className="bg-white py-16 sm:py-20">
                <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="space-y-6 lg:col-span-6">
                        <article className="rounded-[24px] bg-[#F6F3EE] p-6">
                            <h2 className="text-xl font-bold text-[#003E48]">Your health and time <span className="font-accent">matter</span></h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#003E48]/70">
                                At Vitaway Plus, we are committed to helping you live your best life. Accessible, convenient care for a busy lifestyle.
                            </p>
                        </article>
                        <article className="rounded-[24px] bg-[#F6F3EE] p-6">
                            <h2 className="text-xl font-bold text-[#003E48]">A formula that holds</h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#003E48]/70">
                                Leading-edge science, personal health management, and ongoing support — so the change lasts past week one.
                            </p>
                        </article>
                    </div>
                    <div className="relative min-h-[320px] overflow-hidden rounded-[28px] lg:col-span-6">
                        <Image fill className="object-cover" src="/images/Gallery/image-12.jpg" alt="Vitaway core team" sizes="(min-width: 1024px) 45vw, 100vw" />
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                        Inside the clinic, and the people who <span className="font-accent">work</span> there
                    </h2>
                    <p className="mt-4 max-w-lg text-[#003E48]/70">
                        A visual tour of the cabinet, the team, and the rooms where the numbers get explained.
                    </p>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {gallery.map((item) => (
                            <figure key={item.image} className="group relative overflow-hidden rounded-[24px]">
                                <Image width={600} height={600} className="h-64 w-full object-cover sm:h-72" src={item.image} alt={item.caption} />
                                <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#003E48] via-[#003E48]/40 to-transparent p-5 opacity-0 transition group-hover:opacity-100">
                                    <p className="text-sm font-bold text-white">{item.caption}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-white/80">{item.description}</p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default AboutUs
