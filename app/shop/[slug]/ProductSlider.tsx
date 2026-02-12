'use client';

import React, { useState } from 'react';
import ProductCard from '@/app/components/cards/product-card';
import { Products } from '@/types/products';
import { useKeenSlider } from 'keen-slider/react';
import { InlineSpinner } from '@/app/components/spinners';
import 'keen-slider/keen-slider.min.css';

function ProductSlider({ relatedProducts, loading }: { relatedProducts: Products[]; loading: boolean }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: {
            perView: 4,
            spacing: 15,
        },
        slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
        breakpoints: {
            '(max-width: 768px)': {
                slides: { perView: 1, spacing: 10 },
            },
            '(max-width: 1024px)': {
                slides: { perView: 2, spacing: 10 },
            },
        },
    });

    const goToSlide = (idx: number) => {
        if (instanceRef.current) instanceRef.current.moveToIdx(idx);
    };

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-5">You may also like</h2>

            <div className="relative">
                {loading ? (
                    <InlineSpinner message="Loading related products..." />
                ) : (
                    <>
                        <div ref={sliderRef} className="keen-slider">
                            {relatedProducts.map((product, index) => (
                                <div key={index} className="keen-slider__slide">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => instanceRef.current?.prev()}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => instanceRef.current?.next()}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Dots Navigation */}
            {!loading && (
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: instanceRef.current?.track.details.slides.length || 0 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-slate-800' : 'bg-gray-300'
                                }`}
                        ></button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductSlider;