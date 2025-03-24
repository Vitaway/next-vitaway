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
                        <span className='font-semibold capitalize bg-blue-50 text-blue-600 text-sm rounded-full px-3 py-2'>#1 Digital Healthcare Platform</span>
                    </div>

                    <h1 className="text-4xl font-bold sm:text-6xl mt-10">
                        <span className="bg-gradient-to-r from-[#0878de] to-white bg-clip-text text-transparent capitalize"> Access To Virtual Health Services for Enhanced Well-being</span>
                    </h1>

                    <p className="mt-4 text-base text-white text-wwhite lg:mt-8 sm:text-xl">Virtual healthcare solutions to empower individuals from all walks of life, promoting overall well-being and health equity.</p>

                    <div>

                        <Link href="/download" title="" className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-indigo-900 transition-all duration-200 bg-white rounded-full lg:mt-16 hover:bg-white/50 focus:bg-white/50" role="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 6v10c0 4-1 5-5 5H6c-4 0-5-1-5-5V6c0-4 1-5 5-5h6c4 0 5 1 5 5Z" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M11 4.5H7M9 18.1A1.55 1.55 0 1 0 9 15a1.55 1.55 0 0 0 0 3.1Z" stroke="#697689" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            <span className='ml-2'>Download</span>
                        </Link>

                        <Link href="/pricing" title="" className="inline-flex md:ml-4 items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-[#0878de] rounded-full lg:mt-16 hover:bg-[#0878de]/50 focus:bg-[#0878de]/50" role="button">
                            <span className='mr-2'>Join for free</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07"></path><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M3.5 12h16.83" opacity=".4"></path></svg>
                        </Link>
                    </div>
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