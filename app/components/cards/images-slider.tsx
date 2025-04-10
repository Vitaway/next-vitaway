'use client';

import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';

type ImageSliderProps = {
    images: string[];
    alt?: string;
};

export default function ImageSlider({ images, alt = 'Image' }: ImageSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: { perView: 1, spacing: 10 },
        slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    });

    const goToSlide = (idx: number) => {
        if (instanceRef.current) instanceRef.current.moveToIdx(idx);
    };

    return (
        <div className="relative w-full">
            <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
                {images.map((src, index) => (
                    <div key={index} className="keen-slider__slide">
                        <Image
                            src={src}
                            alt={`${alt} ${index + 1}`}
                            width={500}
                            height={600}
                            className="w-full h-auto max-h-[400px] min-h-[300] object-cover border border-gray-200 rounded-xl"
                        />
                    </div>
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M9.57 5.93L3.5 12l6.07 6.07"></path><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M20.5 12H3.67" opacity=".4"></path></svg>
            </button>
            <button
                onClick={() => instanceRef.current?.next()}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07"></path><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M3.5 12h16.83" opacity=".4"></path></svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-gray-800' : 'bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
