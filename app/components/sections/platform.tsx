import React from 'react';
import Link from 'next/link';
import PressButton from '../buttons/press-button';
import { DotGrid } from '../design/pattern-design';

const stats = [
    { value: '52.1%', label: 'never had blood pressure measured' },
    { value: '88.7%', label: 'never had blood sugar checked' },
    { value: '97.6%', label: 'never been tested for cholesterol' },
];

function Platform() {
    return (
        <section className="relative overflow-hidden bg-[#003E48] py-16 sm:py-20">
            <DotGrid className="pointer-events-none absolute right-6 top-8 hidden opacity-45 sm:block lg:right-12" />
            <DotGrid className="pointer-events-none absolute bottom-8 left-6 hidden opacity-35 sm:block lg:left-12" />
            <div className="relative z-10 mx-auto max-w-[1440px] px-5 lg:px-12">
                <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Most of your people have never had these <span className="font-accent">numbers</span> taken.
                </h2>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.value}>
                            <p className="text-5xl font-bold tracking-tight text-white sm:text-6xl">{stat.value}</p>
                            <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                    <PressButton href="/serves">Build your programme</PressButton>
                    <Link href="/contacts" className="inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[1.5px] text-white hover:bg-white/10">
                        See a sample report
                    </Link>
                </div>
                <p className="mt-6 text-xs text-white/45">Rwanda STEPS NCD Risk Factor Survey 2021–22.</p>
            </div>
        </section>
    );
}

export default Platform;
