import React from 'react'
import PageHeader from '../components/headers/page-header'
import Image from 'next/image'
import Link from 'next/link'
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import SectionCard from '../components/sections/section-card';
import PressButton from '../components/buttons/press-button';
import PreRegisterButton from '../components/booking/pre-register-button';

export const metadata: Metadata = {
    title: "For Individuals",
    description: "Discover how Vitaway helps individuals transform their lives and achieve optimal health through mindset shifts and personalized virtual care.",
    keywords: "Vitaway, Individuals, Health, Virtual Care, Mindset Shift, Personalized Care, Health Transformation, Vitaway Health, Wellness, Optimal Health",
    metadataBase: new URL("https://www.vitaway.org/individuals"),
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

const cardData = [
    {
        imgSrc: "https://cdn-icons-png.flaticon.com/512/4436/4436450.png",
        imgAlt: "Small steps, long-term change",
        title: "Small steps, long-term change",
        description: "When life happens, Vitaway helps you stay on track with a plan that constantly adapts to meet your needs."
    },
    {
        imgSrc: "https://cdn-icons-png.flaticon.com/512/4288/4288923.png",
        imgAlt: "Find your Joy",
        title: "Find your Joy",
        description: "Try new things you’ll actually enjoy, rather than avoiding foods you 'Can’t eat' or things you 'shouldn’t do'."
    },
    {
        imgSrc: "https://cdn-icons-png.flaticon.com/512/1685/1685803.png",
        imgAlt: "Virtual Care, uniquely yours",
        title: "Virtual Care, Uniquely yours",
        description: "Your health journey is unique to you. That’s why Vitaway offers personalized support and guidance."
    }
];
function Indivituals() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        Transform your life and Mindset shift for <span className="font-accent">Optimal</span> health
                    </>
                }
                description='Discover how changing your mindset can be the key to improving your overall health and well-being. Explore the power of a positive perspective in this journey toward a healthier you.'
                backgroundImage='https://images.unsplash.com/photo-1613089222731-8841ac989caa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU4fHxoZWFydCUyMGF0dGFja3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
            />

            <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="lg:col-span-6">
                        <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            It takes only one <span className="font-accent">minute</span> to see if Vitaway is right for you and at no cost.
                        </h2>
                    </div>
                    <div className="lg:col-span-6">
                        <p className="text-sm leading-relaxed text-[#003E48]/70 sm:text-base">
                            Your path to better well-being with Vitaway&rsquo;s one-minute wellness assessment.
                            Find out if our tailored solutions are right for you, at no cost.
                            Your journey to improved health begins now!
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <PressButton href="/indivituals/canrisk">
                                I am Eligible
                            </PressButton>
                            <PreRegisterButton surface="light" />
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <h2 className="max-w-lg text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                        Accessible <span className="font-accent">Programs</span>
                    </h2>
                    <p className="mt-4 max-w-xl text-base text-[#003E48]/70">
                        Virtual care is the first integrated solution. To achieve long-lasting health changes on their terms, Vitaway supports members in changing their thinking.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {programs.map((program, index) => (
                            <Link href="/" key={index} className="rounded-[24px] bg-[#F6F3EE] p-6 sm:p-8">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#003E48]">
                                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path
                                            d="M18.6746 0.26779C10.0637 -1.33065 1.86522 4.39279 0.266779 13.0037C-0.506658 17.1803 0.421467 21.3568 2.79334 24.8631C5.21678 28.3693 8.82615 30.6897 12.9512 31.4631C13.9308 31.6178 14.859 31.7209 15.7871 31.7209C23.2637 31.7209 29.9668 26.3584 31.359 18.6756C32.9574 10.0647 27.234 1.81466 18.6746 0.26779ZM29.6574 18.3662C29.5543 18.8819 29.4512 19.449 29.2965 19.9131L16.7668 15.2209V1.81466C17.2824 1.86623 17.8496 1.91779 18.3652 2.02091C25.9449 3.4131 30.998 10.735 29.6574 18.3662ZM14.9105 1.81466V14.9115H1.86522C1.91678 14.3959 1.96834 13.8287 2.07147 13.3131C3.20584 6.86779 8.67147 2.22716 14.9105 1.81466ZM13.3121 29.6584C9.65115 28.9881 6.45428 26.9256 4.28865 23.8318C2.79334 21.7178 1.96834 19.2428 1.81365 16.7678H15.6324L28.5746 21.6147C26.048 27.3381 19.7574 30.8443 13.3121 29.6584Z"
                                            fill="#5CE0C6" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-bold text-[#003E48]">{program.title}</h4>
                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#003E48]/65">{program.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cardData.map((card, index) => (
                            <article className="rounded-[24px] bg-white p-6 sm:p-8" key={index}>
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003E48]">
                                    <Image src={card.imgSrc} alt={card.imgAlt} className="h-7 w-7 brightness-0 invert" width={50} height={50} />
                                </div>
                                <h3 className="mt-5 text-xl font-bold text-[#003E48]">
                                    {card.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#003E48]/65">
                                    {card.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default Indivituals
