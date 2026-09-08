import React from 'react';
import Link from 'next/link';
import MobileFrame from '../design/mobile-frame';
import SectionCard from './section-card';
import StoreButtons from '../buttons/store-buttons';

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
                        <p className="mt-4 max-w-lg text-[#003E48]/70">
                            The app carries your plan, appointments and measurements between visits.
                        </p>
                        <StoreButtons className="mt-6" />
                        <Link href="/download" className="mt-4 inline-flex text-sm font-semibold text-[#E85A2E] hover:underline">
                            What Vitaway Plus does →
                        </Link>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default DiabeteProgram;
