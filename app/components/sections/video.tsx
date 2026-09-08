import React from 'react';
import PressButton from '../buttons/press-button';
import SectionCard from './section-card';

function Video() {
    return (
        <SectionCard id="watch" className="bg-white py-16 sm:py-20">
            <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 lg:grid-cols-12 lg:px-12">
                <div className="lg:col-span-4">
                    <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                        See how a visit <span className="font-accent">works</span>.
                    </h2>
                    <PressButton href="/appointments" className="mt-8">
                        Book a health check
                    </PressButton>
                </div>
                <div className="lg:col-span-8">
                    <div className="aspect-video overflow-hidden rounded-[24px] bg-black/10">
                        <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/T73sfGzsUeU?rel=0"
                            title="Vitaway welcome video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default Video;
