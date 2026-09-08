import React from 'react';
import SectionCard from './section-card';

const steps = [
    { n: '01', title: 'Measure', line: 'Weight, waist, BP, sugar — and what you eat.' },
    { n: '02', title: 'Understand', line: 'A nutritionist explains the numbers.' },
    { n: '03', title: 'Plan', line: 'Built on Rwandan food and your budget.' },
    { n: '04', title: 'Measure again', line: 'Week twelve, compared to week one.' },
];

function Steps() {
    return (
        <SectionCard className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                    Four steps. The last one is the <span className="font-accent">point</span>.
                </h2>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step) => (
                        <div key={step.n} className="rounded-[24px] bg-[#F6F3EE] p-6">
                            <p className="text-xs font-semibold tracking-[0.16em] text-[#E85A2E]">{step.n}</p>
                            <h3 className="mt-3 text-xl font-bold text-[#003E48]">{step.title}</h3>
                            <p className="mt-2 text-sm text-[#003E48]/65">{step.line}</p>
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default Steps;
