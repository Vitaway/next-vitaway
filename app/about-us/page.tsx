import Image from 'next/image'
import React from 'react'
import PageHeader from '../components/headers/page-header'
import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';

export const metadata: Metadata = {
    title: "About us",
    description: "Discover the Vitaway difference as we pledge to provide you with the highest quality healthcare solutions, personalized to your unique well-being.",
    keywords: "Vitaway Health Ltd, Vitaway Health, healthcare solutions, personalized well-being, high-quality healthcare, wellness, health transformation, virtual health companion, about us, vitaway about us, vitaway health about us",
    authors: [{ name: "Vitaway Health Ltd" }],
    metadataBase: new URL("https://www.vitaway.org"),
    openGraph: {
        title: "About us",
        siteName: "Vitaway Health Ltd",
        description: "Discover the Vitaway difference as we pledge to provide you with the highest quality healthcare solutions, personalized to your unique well-being.",
        type: "website",
        url: "https://www.vitaway.org/about-us",
        images: [
            {
                url: "/images/Gallery/image-12.jpg",
                width: 800,
                height: 600,
                alt: "Vitaway core team"
            },
        ]
    }
};

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

function AboutUs() {
    const gallery = [
        {
            image: "/images/Team/bg.jpeg",
            caption: "Co-founders discussion",
            description: "Vitaway Health co-founders engaged in a visionary dialogue, driving innovation and impact in preventive healthcare",
        },
        {
            image: "/images/Gallery/image-2.jpg",
            caption: "Founder & CEO of Vitaway Health",
            description: "Emmanuel Hakuzimana, Founder & CEO of Vitaway Health, leading with purpose, passion, and a vision for a healthier Africa.” We created this company to inspire and engage people in lifelong health, one step at a time.",
        },
        {
            image: "/images/Gallery/image-8.jpg",
            caption: "Photo of Nutritionist and Patient in consultation room",
            description: "Personalised nutrition counselling in action—empowering patients to take charge of their health.",
        },
        {
            image: "/images/Gallery/image-1.jpg",
            caption: "Vitaway Gallery",
            description: "A snapshot of the Vitaway gallery, dedicated to transforming healthcare through innovation and compassion.",
        },
        {
            image: "/images/Gallery/image-5.jpg",
            caption: "All Nutritionists at Vitaway Health",
            description: "A powerhouse team of qualified nutritionists dedicated to transforming lives through evidence-based nutritional care.",
        },
        {
            image: "/images/Gallery/image-3.jpg",
            caption: "Dedicated Nutritionist at Vitaway Health",
            description: "Personalised nutrition counselling in action—empowering patients to take charge of their health.",
        },
        {
            image: "/images/Gallery/image-13.jpg",
            caption: "Photo of Nutritionist and Patient in consultation room",
            description: "Personalised nutrition counselling in action—empowering patients to take charge of their health.",
        },
        {
            image: "/images/Gallery/image-15.jpg",
            caption: "Photo of the location",
            description: "Welcome to Vitaway Nutritional Cabinet in Kimironko, 7KG 165ST a modern, accessible space where health and care meet",
        },
    ];

    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Our Pledge to You'
                title='Elevating Your Wellness - Your Journey with Our Commitment'
                description='Discover the Vitaway difference as we pledge to provide you with the highest quality healthcare solutions, personalized to your unique well-being.'
            />

            <div className="px-4 py-20 mx-auto text-slate-700 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="grid max-w-screen-xl gap-8 lg:grid-cols-2 sm:mx-auto" style={{ marginTop: '30px' }}>
                    <div className="flex flex-col justify-center">
                        <div className="flex">
                            <div className="mr-4">
                                <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-indigo-50">
                                    <svg className="w-8 h-8 text-deep-purple-accent-400" stroke="currentColor" viewBox="0 0 52 52">
                                        <polygon strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h6 className="mb-2 font-semibold leading-5">
                                    Your Health and Time Matter that Committed to Your Best Life
                                </h6>
                                <p className="text-sm text-gray-900">
                                    At Vitaway + , your health and time matter. We are committed to helping you live your best life. We offer accessible, convenient care for your busy lifestyle.
                                </p>
                                <hr className="w-full my-6 border-gray-300" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mr-4">
                                <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-indigo-50">
                                    <svg className="w-8 h-8 text-deep-purple-accent-400" stroke="currentColor" viewBox="0 0 52 52">
                                        <polygon strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h6 className="mb-2 font-semibold leading-5">
                                    Our Formula for Lasting Health Transformation
                                </h6>
                                <p className="text-sm text-gray-900">
                                    We employ leading-edge science, personal health management and ongoing support to provide lasting changes.
                                </p>
                                <hr className="w-full my-6 border-gray-300" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <Image width={600} height={600} className="object-cover w-full h-[400px] col-span-2 rounded" src="/images/Gallery/image-12.jpg" alt="vitaway core team" />
                    </div>
                </div>
            </div>

            <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                <div className="flex flex-col mb-6 lg:justify-between lg:flex-row md:mb-8">
                    <h2 className="max-w-lg mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none md:mb-6 group">
                        <span className="inline-block mb-1 sm:mb-4  font-normal leading-10">
                            Real people who have experienced positive changes in their lives through Vitaway
                        </span>
                        <div className="h-1 ml-auto duration-300 origin-left transform bg-deep-purple-accent-400 scale-x-30 group-hover:scale-x-100"></div>
                    </h2>
                    <p className="text-gray-700 lg:text-md leading-6 lg:max-w-md  font-normal">
                        Where our healthcare journey comes to life. Take a visual tour through the heart of our startup and discover the world of innovative solutions and compassionate care that define us.
                    </p>
                </div>

                <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                    {gallery.map((item, index) => (
                        <a href="#" key={index}>
                            <div className="relative overflow-hidden transition duration-200 transform rounded hover:-translate-y-2 hover:shadow-2xl">
                                <Image width={600} height={600} className="object-cover w-full h-56 md:h-64 xl:h-80" src={item.image} alt={item.caption} />
                                <div className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                                    <p className="mb-4 text-lg font-bold text-gray-100">{item.caption}</p>
                                    <p className="text-sm tracking-wide text-gray-300">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </GuestLayout>
    </>)
}

export default AboutUs