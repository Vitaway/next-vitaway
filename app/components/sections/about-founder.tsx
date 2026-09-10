import React from 'react';
import Image from 'next/image';
import PressButton from '../buttons/press-button';
import SectionCard from './section-card';

const stats = [
    {
        title: 'MoH licensed',
        line: 'Licence L031072025. A real clinic, not an app with a logo.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                <path d="M12 3l1.8 4.6L18.6 9l-3.6 3.2.9 4.8L12 14.8 7.1 17l.9-4.8L4.4 9l4.8-1.4L12 3Z" fill="#5CE0C6" />
            </svg>
        ),
    },
    {
        title: 'Named clinicians',
        line: 'Nutritionists and coaches you sit with. Not a chatbot.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-7 2-7 4.5V20h14v-1.5C19 16 16 14 12 14Z" fill="#5CE0C6" />
            </svg>
        ),
    },
    {
        title: 'Kigali clinic',
        line: 'CPR-Unit House, KK21 Ave, Niboye, Kicukiro.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="#5CE0C6" />
            </svg>
        ),
    },
];

function AboutFounder() {
    return (
        <SectionCard className="bg-white py-16 sm:py-20">
            <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 lg:grid-cols-12 lg:gap-14 lg:px-12">
                <div className="lg:col-span-5">
                    <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                        A trusted nutrition clinic — built for every <span className="font-accent">patient</span>, backed by named clinicians.
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[#003E48]/70 sm:text-base">
                        We measure, explain, and stay until the numbers move. Founded by Emmanuel Hakuzimana, RND
                        &amp; RN — so prevention in Rwanda has a door you can walk through.
                    </p>
                    <div className="mt-7">
                        <PressButton href="/about-us" size="sm">
                            Know more
                        </PressButton>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {stats.slice(0, 2).map((stat) => (
                            <article key={stat.title} className="rounded-[24px] bg-[#F6F3EE] p-5 sm:p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003E48]">
                                    {stat.icon}
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-[#003E48] sm:text-xl">{stat.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-[#003E48]/65">{stat.line}</p>
                            </article>
                        ))}
                    </div>

                    <div className="relative min-h-[280px] overflow-hidden rounded-[24px] sm:min-h-[340px] sm:rounded-[28px] lg:min-h-[380px]">
                        <Image
                            src="/images/members/emmanuel-hakuzimana-founder.jpg"
                            alt="Emmanuel Hakuzimana, Founder and CEO of Vitaway Health"
                            fill
                            sizes="(min-width: 1024px) 28vw, 50vw"
                            className="object-cover object-[center_20%]"
                        />
                    </div>

                    <div className="relative min-h-[140px] overflow-hidden rounded-[24px] sm:min-h-[170px] sm:rounded-[28px]">
                        <Image
                            src="/images/Gallery/image-8.jpg"
                            alt="Nutrition consultation at Vitaway"
                            fill
                            sizes="(min-width: 1024px) 28vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    <article className="rounded-[24px] bg-[#F6F3EE] p-5 sm:p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003E48]">
                            {stats[2].icon}
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-[#003E48] sm:text-xl">{stats[2].title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#003E48]/65">{stats[2].line}</p>
                    </article>
                </div>
            </div>
        </SectionCard>
    );
}

export default AboutFounder;
