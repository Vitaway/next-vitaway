import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SectionCard from './section-card';

const featured = {
    quote: 'The nutrition plan was simple enough to cook after work. My numbers actually moved.',
    name: 'Emmanuel',
    role: 'Diabetes programme · Kigali',
    image: '/images/Gallery/image-8.jpg',
};

const stories = [
    {
        quote: 'We finally had a clinician the same day. No waiting room, no guessing.',
        name: 'Noela',
        role: 'Vitaway member, Kigali',
    },
    {
        quote: 'Booking a consult for my family took minutes. It feels like care that respects our time.',
        name: 'Eric',
        role: 'Vitaway member',
    },
];

function Stories() {
    return (
        <SectionCard className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                            They came in. Then the numbers <span className="font-accent">moved</span>.
                        </h2>
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#003E48]/70 sm:text-base">
                            People who sat with a nutritionist, cooked the plan, and measured again at week twelve.
                        </p>
                    </div>
                    <Link href="/blogs" className="text-sm font-semibold text-[#E85A2E] hover:underline">
                        Read more stories →
                    </Link>
                </div>

                <div className="mt-10 grid gap-4 lg:grid-cols-12">
                    <figure className="relative min-h-[380px] overflow-hidden rounded-[28px] lg:col-span-7 lg:min-h-[460px]">
                        <Image
                            src={featured.image}
                            alt="Nutrition consultation at Vitaway"
                            fill
                            sizes="(min-width: 1024px) 55vw, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003E48] via-[#003E48]/45 to-transparent" />
                        <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                            <p className="text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-[28px] lg:leading-[1.25]">
                                “{featured.quote}”
                            </p>
                            <div className="mt-5 flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5CE0C6] text-sm font-bold text-[#003E48]">
                                    {featured.name.slice(0, 1)}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-white">{featured.name}</p>
                                    <p className="text-sm text-white/70">{featured.role}</p>
                                </div>
                            </div>
                        </figcaption>
                    </figure>

                    <div className="flex flex-col gap-4 lg:col-span-5">
                        {stories.map((story) => (
                            <figure key={story.name} className="flex flex-1 flex-col justify-between rounded-[24px] bg-[#F6F3EE] p-6 sm:p-7">
                                <blockquote className="text-[17px] leading-relaxed text-[#003E48]">
                                    “{story.quote}”
                                </blockquote>
                                <figcaption className="mt-8 flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#003E48] text-sm font-bold text-[#5CE0C6]">
                                        {story.name.slice(0, 1)}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-[#003E48]">{story.name}</p>
                                        <p className="text-sm text-[#003E48]/55">{story.role}</p>
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default Stories;
