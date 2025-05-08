import React from 'react'
import PageHeader from '../components/headers/page-header';
import Link from 'next/link';
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';

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

const programs = [
    {
        title: 'Diabetes',
        description: 'Simply Diabetes management with quick checks and a Proper...',
        image: '/images/screens/learn.png'
    },
    {
        title: 'Hypertension',
        description: 'Track Your health trends to work toward reaching your health...',
        image: '/images/screens/learn.png'
    },
    {
        title: 'Weight Management',
        description: 'Find tools and strategies to help healthy weight…',
        image: '/images/screens/learn.png'
    },
    {
        title: 'Mental Health',
        description: 'we care about your mental health.',
        image: '/images/screens/learn.png'
    }
];

const services = [
    {
        title: 'Individuals & Families',
        descriptioin: 'Personalized Health Support for Your Wellness Journey Every health journey is unique.Whether you’re living with or at risk of diabetes, hypertension, obesity, or high cholesterol, we help you take control through:',
        backgroundColor: '#f8fafc',
        subServices: [
            {
                title: "Cabinet",
                description: "In-person support at the Vitaway Nutritional Cabinet in Kimironko.",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Coaching",
                description: "Digital coaching and care via the Vitaway+ mobile app",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Release & launch",
                description: "Personalized meal plans, physical activity guidance, mental health tools, and health tracking",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Professionals",
                description: "Ongoing coaching from licensed professionals to keep you on track",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
        ]
    },
    {
        title: 'Employers & Workplace Wellness Programs',
        descriptioin: 'Empowering Your Team, Improving Performance Healthier employees are more productive, motivated, and loyal. Vitaway partners with organizations to improve workforce well-being through:',
        backgroundColor: '#fff',
        subServices: [
            {
                title: "Corporate Wellness Packages ",
                description: "Pay-per-employee plans with screenings, nutrition consultations, and follow-ups",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "On-site or Virtual Workshops ",
                description: "Sessions on stress, sleep, diet, movement, and mental wellness",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Annual Subscriptions ",
                description: "Comprehensive health plans for year-round employee support",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Incentive Programs",
                description: "Employees earn rewards (badges, discounts, recognition) for healthy engagement",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
        ]
    },
    {
        title: 'Insurance Companies',
        descriptioin: 'Innovating Preventive Care with Technology We help insurers shift from reactive claims to proactive health management by integrating digital tools and data-driven insights into member care.',
        backgroundColor: '#f3f4f6',
        subServices: [
            {
                title: "Preventive Health Packages",
                description: "Co-branded health programs for early diagnosis and lifestyle management",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "AI-Powered Monitoring ",
                description: "Continuous data collection and coaching to reduce high-cost claims",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Data & Insights Licensing ",
                description: "Access to anonymized health trends for smarter underwriting and plan design",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
            {
                title: "Co-Funded Wellness Benefits ",
                description: "Joint ventures to improve client retention and population health",
                icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3.172 7.441 8.83 5.11 8.77-5.08M12 21.61v-9.07"></path><path d="M9.93 2.48 4.59 5.45c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0Z"></path></g><path d="M17.002 13.242v-3.66l-9.49-5.48" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>),
            },
        ]
    }
];

function WhoWeServe() {
    return (<>
        <GuestLayout>
            <PageHeader
                title='Your well being with vitaway’s Health Plan'
                description="At Vitaway, we’re on a mission to make preventive and personalized healthcare accessible to individuals, families, companies, and institutions across Rwanda and beyond. Whether you're managing a chronic condition, looking to build healthier habits, or aiming to boost your organization's wellness strategy."
                sup_title='Who We Serve'
                // backgroundImage='https://res.cloudinary.com/dzhuhtn30/image/upload/v1671533556/vite-guest-imgs/allgo-an-app-for-plus-size-people-eqlRthvN188-unsplash_mjb1s7.jpg'
            />

            <section id="services" className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    <div>
                        <p className="inline-block  font-normal px-3 py-px mb-4 text-xs tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                            programs
                        </p>
                    </div>
                    <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-slate-900 sm:text-4xl md:mx-auto">
                        <span className="relative inline-block">
                            <svg viewBox="0 0 52 24" fill="currentColor" className="absolute top-9 right-10 z-0 hidden w-28 -mt-8 -ml-20 text-blue-gray-100 lg:w-28 lg:-ml-28 lg:-mt-10 sm:block">
                                <defs>
                                    <pattern id="18302e52-9e2a-4c8e-9550-0cbb21b38e55" x="0" y="0" width=".135"
                                        height=".30">
                                        <circle cx="1" cy="1" r=".7"></circle>
                                    </pattern>
                                </defs>
                                <rect fill="url(#18302e52-9e2a-4c8e-9550-0cbb21b38e55)" width="52" height="24"></rect>
                            </svg>
                            <span className="relative  font-normal"></span>
                        </span>
                        Accessible Programs
                    </h2>
                    <p className="text-base text-gray-700 md:text-lg font-merri font-normal">
                        Virtual care is the first integrated solution. To achieve long-lasting health changes on their terms, Vitaway supports members in changing their thinking.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
                    {programs.map((program, index) => (
                        <Link href="/" key={index}>
                            <div className="rounded-xl bg-white border border-gray-200 p-6 sm:p-8 md:p-10">
                                <div className="mb-6 sm:mb-8 flex h-[50px] w-[50px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-2xl bg-[#3268b9]">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.6746 0.26779C10.0637 -1.33065 1.86522 4.39279 0.266779 13.0037C-0.506658 17.1803 0.421467 21.3568 2.79334 24.8631C5.21678 28.3693 8.82615 30.6897 12.9512 31.4631C13.9308 31.6178 14.859 31.7209 15.7871 31.7209C23.2637 31.7209 29.9668 26.3584 31.359 18.6756C32.9574 10.0647 27.234 1.81466 18.6746 0.26779ZM29.6574 18.3662C29.5543 18.8819 29.4512 19.449 29.2965 19.9131L16.7668 15.2209V1.81466C17.2824 1.86623 17.8496 1.91779 18.3652 2.02091C25.9449 3.4131 30.998 10.735 29.6574 18.3662ZM14.9105 1.81466V14.9115H1.86522C1.91678 14.3959 1.96834 13.8287 2.07147 13.3131C3.20584 6.86779 8.67147 2.22716 14.9105 1.81466ZM13.3121 29.6584C9.65115 28.9881 6.45428 26.9256 4.28865 23.8318C2.79334 21.7178 1.96834 19.2428 1.81365 16.7678H15.6324L28.5746 21.6147C26.048 27.3381 19.7574 30.8443 13.3121 29.6584Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h4 className="text-sm sm:text-md font-bold text-slate-700">{program.title}</h4>
                                <p className="text-slate-600 font-medium text-sm sm:text-base leading-5 sm:leading-6 sm:mt-5 line-clamp-2">{program.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {services.map((service, serviceIndex) => (
                <section key={serviceIndex} style={{ backgroundColor: service.backgroundColor }} className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div>
                            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">{service.title}</h2>
                            <blockquote className="mt-4">
                                <p className="text-base text-gray-700 md:text-lg font-merri font-normal">
                                    {service.descriptioin}
                                </p>
                            </blockquote>

                            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="relative flex items-center justify-center">
                                    <ul>
                                        {service.subServices.map((subService, subServiceIndex) => (
                                            <li key={subServiceIndex} className="relative flex items-start my-5">
                                                <div className="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                                                    {subService.icon}
                                                </div>
                                                <div className="ml-6">
                                                    <h3 className="text-lg font-semibold text-black">{subService.title}</h3>
                                                    <p className="text-base text-gray-600">{subService.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </GuestLayout>
    </>)
}

export default WhoWeServe;