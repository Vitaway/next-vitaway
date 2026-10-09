import React from 'react';
import MobileFrame from '../design/mobile-frame';
import SectionCard from './section-card';
import StoreButtons from '../buttons/store-buttons';
import PressButton from '../buttons/press-button';

const plusFeatures = [
    'Your plan and your meal guidance.',
    'Your measurements, charted against week one.',
    'Appointment reminders by SMS and in-app.',
    'Chat and Call your Coach.',
    'Messages to your own named nutritionist, not a chatbot.',
];

function DiabeteProgram() {
    return (
        <SectionCard id="about" className="bg-[#F6F3EE] py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                    <div className="flex w-full justify-center lg:w-2/5">
                        <MobileFrame title="Vitaway Plus" image="/images/screens/learn.png" />
                    </div>
                    <div className="w-full lg:w-3/5">
                        <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                            Your care does not end when you leave the <span className="font-accent">clinic</span>.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#003E48]/70 sm:text-lg">
                            Vitaway Plus carries your plan, your appointments and your measurements between
                            visits so week seven is not a guess, and your nutritionist can see what actually
                            happened.
                        </p>
                        <ul className="mt-6 max-w-xl space-y-2.5">
                            {plusFeatures.map((feature) => (
                                <li key={feature} className="flex gap-3 text-sm leading-relaxed text-[#003E48]/80 sm:text-base">
                                    <span
                                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85A2E]"
                                        aria-hidden="true"
                                    />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <StoreButtons className="mt-8" />
                        <div className="mt-5">
                            <PressButton href="/download" variant="secondary" surface="light">
                                What Vitaway Plus does
                            </PressButton>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default DiabeteProgram;
