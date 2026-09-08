import Link from 'next/link';
import React from 'react';
import BookAppointmentButton from '../booking/book-appointment-button';
import PreRegisterButton from '../booking/pre-register-button';
import { DotGrid } from '../design/pattern-design';

function CloseCta() {
    return (
        <section className="relative overflow-hidden bg-[#003E48] py-16 text-center sm:py-20">
            <DotGrid className="pointer-events-none absolute left-6 top-8 hidden opacity-45 sm:block lg:left-12" />
            <DotGrid className="pointer-events-none absolute bottom-8 right-6 hidden opacity-35 sm:block lg:right-12" />
            <div className="relative z-10 mx-auto max-w-2xl px-5">
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                    Most people find out too <span className="font-accent">late</span>.
                </h2>
                <p className="mt-4 text-base text-white/80">
                    A health check takes about an hour.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <BookAppointmentButton>Book a health check</BookAppointmentButton>
                    <PreRegisterButton />
                    <Link
                        href="/contacts"
                        className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                        WhatsApp us
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CloseCta;
