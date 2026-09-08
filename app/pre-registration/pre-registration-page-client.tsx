'use client';

import React, { useEffect } from 'react';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';
import PreRegisterButton from '../components/booking/pre-register-button';
import { useBooking } from '../components/booking/booking-context';

function PreRegistrationPageClient() {
    const { openPrereg } = useBooking();

    useEffect(() => {
        openPrereg();
    }, [openPrereg]);

    return (
        <>
            <PageHeader
                title={
                    <>
                        Start your <span className="font-accent">plan</span>
                    </>
                }
                description="A few questions about you, then our team follows up. No account required."
            />
            <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
                <div className="mx-auto max-w-xl px-5 text-center lg:px-12">
                    <p className="text-base text-[#003E48]/70">
                        The form opens in a window on this page. If it closed, you can open it again here.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <PreRegisterButton surface="light" />
                    </div>
                </div>
            </SectionCard>
        </>
    );
}

export default PreRegistrationPageClient;
