import React from 'react';
import Image from 'next/image';
import BookAppointmentButton from '../booking/book-appointment-button';
import DownloadAppButton from '../buttons/download-app-button';

const HERO_IMAGE =
    'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=2400&q=80';

function Hero() {
    return (
        <section className="relative min-h-[540px] overflow-hidden rounded-b-[22px] bg-[#003E48] sm:min-h-[620px] sm:rounded-b-[28px] lg:min-h-[730px]">
            <Image
                src={HERO_IMAGE}
                alt="Family together"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-[#003E48]/50" />

            <div className="relative z-10 mx-auto flex min-h-[540px] max-w-[900px] flex-col items-center justify-center px-5 pb-28 pt-10 text-center sm:min-h-[620px] lg:min-h-[730px]">
                <h1 className="text-[36px] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[64px]">
                    Know your numbers. Then <span className="font-accent">change them</span>.
                </h1>
                <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
                    A licensed nutrition clinic in Kigali. We measure, explain, and stay until the numbers move.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <BookAppointmentButton>Book a health check</BookAppointmentButton>
                    <DownloadAppButton />
                </div>
            </div>
        </section>
    );
}

export default Hero;
