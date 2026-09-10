import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SectionCard from './section-card';

const cares = [
    {
        title: 'Weight',
        line: 'Losing it in a way that holds.',
        href: '/programs/well-being',
        image: '/images/clinic/body-composition-scale.jpg',
    },
    {
        title: 'Blood pressure',
        line: 'Salt, weight, alcohol, stress.',
        href: '/appointments',
        image: '/images/clinic/clinical-consultation.jpg',
    },
    {
        title: 'Blood sugar',
        line: 'Newly told, or living with it.',
        href: '/programs/well-being',
        image: '/images/clinic/glucose-meter-lifestyle.jpg',
    },
    {
        title: 'Family nutrition',
        line: 'Feeding a household well.',
        href: '/programs/life-stages',
        image: '/images/clinic/family-breakfast.jpg',
    },
];

function Consultation() {
    return (
        <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                    What people come to us <span className="font-accent">for</span>
                </h2>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cares.map((care) => (
                        <Link
                            key={care.title}
                            href={care.href}
                            className="group overflow-hidden rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,62,72,0.06)]"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image src={care.image} alt={care.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-[#003E48]">{care.title}</h3>
                                <p className="mt-1 text-sm text-[#003E48]/65">{care.line}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default Consultation;
