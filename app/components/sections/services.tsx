import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionCard from './section-card';

const audiences = [
    {
        title: 'You and your family',
        line: 'Get checked. Then get a plan around the food you already eat.',
        href: '/indivituals',
        image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'Your organisation',
        line: 'Screen staff or pupils. Get a report a board can read.',
        href: '/serves',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'Insurance partners',
        line: 'A prevention benefit you can put in a tender.',
        href: '/contacts',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1400&q=80',
    },
];

function Services() {
    return (
        <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                    Who is this <span className="font-accent">for</span>?
                </h2>
                <div className="mt-10 grid gap-4 lg:grid-cols-3">
                    {audiences.map((item) => (
                        <Link key={item.title} href={item.href} className="group relative min-h-[320px] overflow-hidden rounded-[28px]">
                            <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#003E48]/90 via-[#003E48]/25 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                <p className="mt-1 text-sm text-white/80">{item.line}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default Services;
