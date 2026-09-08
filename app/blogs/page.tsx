import React from 'react'
import PageHeader from '../components/headers/page-header'
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import AllBlogs from '../components/sections/all-blogs';
import SectionCard from '../components/sections/section-card';

export const metadata: Metadata = {
    title: "Health & Wellness Blog | Expert Nutrition Tips from Rwanda",
    description: "Discover expert health and wellness insights from Vitaway Health's team of qualified nutritionists. Read about NCD prevention, healthy eating, lifestyle tips, and medical breakthroughs in Rwanda and Africa.",
    keywords: [
        "health blog Rwanda",
        "nutrition articles",
        "wellness tips Kigali",
        "NCD prevention blog",
        "healthy lifestyle Rwanda",
        "nutrition education",
        "health insights Africa",
        "preventive healthcare blog",
        "medical advice Rwanda",
        "wellness articles",
        "healthy eating tips",
        "lifestyle medicine"
    ],
    openGraph: {
        title: "Health & Wellness Blog | Expert Nutrition Tips from Rwanda",
        description: "Discover expert health and wellness insights from Vitaway Health's team of qualified nutritionists. Read about NCD prevention, healthy eating, and lifestyle tips.",
        type: "website",
        url: "https://www.vitaway.org/blogs",
        images: [
            {
                url: "/images/blog-cover.png",
                width: 1200,
                height: 630,
                alt: "Vitaway Health Blog - Expert Health & Wellness Tips",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Health & Wellness Blog | Expert Nutrition Tips from Rwanda",
        description: "Discover expert health insights from Vitaway Health's nutritionists. NCD prevention, healthy eating, and lifestyle tips for better health.",
        images: ["/images/blog-cover.png"],
    },
    alternates: {
        canonical: "https://www.vitaway.org/blogs",
        types: {
            'application/rss+xml': 'https://www.vitaway.org/rss.xml',
        },
    },
}

function Blogs() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        Stories, lessons, and the numbers that <span className="font-accent">moved</span>
                    </>
                }
                description="What our nutritionists write between visits — food, conditions, and care you can use."
            />

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <AllBlogs />
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default Blogs
