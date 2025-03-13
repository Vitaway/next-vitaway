import React from 'react';
import MobileFrame from '../design/mobile-frame';
import PatternDesign from '../design/pattern-design';
import BackgroundBlurImage from '../design/background-blur-image';
import Link from 'next/link';

function Hero() {
    return (<>
        <section className="bg-gradient-to-b from-[#1a1a2e] to-[#111827] border-t px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20 relative">
            <div className="absolute inset-0 z-1 bg-gray-900/90"></div>

            <div className="z-[5] absolute left-1/2 top-0 aspect-[1204/394] w-full max-w-[1204px] -translate-x-1/2">
                <BackgroundBlurImage />
            </div>

            <div className="relative grid items-center grid-cols-1 gap-12 lg:grid-cols-2 z-10 bg-transparent">
                <div className='ml-5'>
                    <div className="w-auto max-w-2xl">
                        <span className='font-semibold bg-blue-50 text-blue-600 text-sm border border-blue-300 rounded-full px-3 py-2'>A social media for learners</span>
                    </div>

                    <h1 className="text-4xl font-bold sm:text-6xl mt-10">
                        <span className="bg-gradient-to-r from-[#0878de] to-white bg-clip-text text-transparent"> Access To Virtual Health Services for Enhanced Well-being</span>
                    </h1>

                    <p className="mt-4 text-base text-wwhite lg:mt-8 sm:text-xl">Virtual healthcare solutions to empower individuals from all walks of life, promoting overall well-being and health equity.</p>

                    <Link href="/pricing" title="" className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-[#0878de] rounded-full lg:mt-16 hover:bg-[#0878de]/50 focus:bg-[#0878de]/50" role="button">
                        Join for free
                        <svg className="w-6 h-6 ml-8 -mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Link>
                </div>

                <div className="col-lg-6 relative mobile-view">
                    <div className="mx-auto ml-5 z-10 flex items-center relative">
                        <div className='z-[5]'>
                            <MobileFrame
                                title='Vitaway Client Dashboard'
                                image='/images/screens/Categories.png'
                            />
                        </div>
                        <div className='absolute right-11 z-[4]'>
                            <MobileFrame
                                title='Vitaway Client Dashboard'
                                image='/images/screens/Categories_2.png'
                                width='270px'
                                height='520px'
                            />
                        </div>
                    </div>

                    <div className="absolute -right-3 bottom-4 z-[3]">
                        <PatternDesign fill='#FFF' />
                    </div>
                </div>
            </div>
        </section >
    </>)
}

export default Hero