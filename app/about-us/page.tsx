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
                imageClassName="object-cover object-[center_18%]"
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
                        <Image
                            fill
                            className="object-cover object-[center_18%]"
                            src="/images/Gallery/image-12.jpg"
                            alt="Vitaway core team"
                            sizes="(min-width: 1024px) 45vw, 100vw"
                        />
                    </div>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default AboutUs
