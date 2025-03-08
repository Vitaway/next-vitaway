import React from 'react';
import Image from 'next/image';
import { CSSProperties } from 'react';

const imageStyle: CSSProperties = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    color: 'transparent',
};

function Hero() {
    return (<>
        <section className="bg-gradient-to-b from-[#1a1a2e] to-[#111827] border-t px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20 relative">
            <div className="z-[5] absolute left-1/2 top-0 aspect-[1204/394] w-full max-w-[1204px] -translate-x-1/2">
                <Image
                    alt="blur"
                    loading="lazy"
                    decoding="async"
                    data-nimg="fill"
                    className="max-w-none"
                    style={imageStyle}
                    width={100}
                    height={100}
                    src="https://ai-tool.nextjstemplates.com/images/blur/blur-02.svg"
                />
            </div>

            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 z-20 bg-transparent">
                <div className='ml-5'>
                    <div className="w-auto max-w-2xl">
                        <span className='font-semibold bg-blue-50 text-blue-600 text-sm border border-blue-300 rounded-full px-3 py-2'>A social media for learners</span>
                    </div>

                    <h1 className="text-4xl font-bold sm:text-6xl mt-10">
                        <span className="bg-gradient-to-r from-[#0878de] to-white bg-clip-text text-transparent"> Access To Virtual Health Services for Enhanced Well-being</span>
                    </h1>

                    <p className="mt-4 text-base text-wwhite lg:mt-8 sm:text-xl">Virtual healthcare solutions to empower individuals from all walks of life, promoting overall well-being and health equity.</p>

                    <a href="#" title="" className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-[#0878de] rounded-full lg:mt-16 hover:bg-[#0878de]/50 focus:bg-[#0878de]/50" role="button">
                        Join for free
                        <svg className="w-6 h-6 ml-8 -mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </a>
                </div>

                <div className="col-lg-6 relative mobile-view">
                    <div className="mx-auto ml-5 z-10 bg-transparent">
                        <div className="absolute left-40 animate__animated animate__fadeInUp animate__delay-1s animate__slow">
                            <div className="relative rotate-12 translate-x-10 border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute">
                                </div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[3px] top-[124px] rounded-l-lg">
                                </div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[3px] top-[178px] rounded-l-lg">
                                </div>
                                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[3px] top-[142px] rounded-r-lg">
                                </div>
                                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                                    <Image src="/images/screens/Categories_2.png" className="dark:hidden w-[272px] h-[572px]" alt="vitaway client coach dashboard" width={500} height={500} />
                                    <Image src="/images/screens/Categories_2.png" className="hidden dark:block w-[272px] h-[572px]" alt="vitaway client coach dashboard" width={500} height={500} />
                                </div>
                            </div>
                        </div>

                        <div className="relative wow bounceInUp border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute">
                            </div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[3px] top-[124px] rounded-l-lg">
                            </div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[3px] top-[178px] rounded-l-lg">
                            </div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[3px] top-[142px] rounded-r-lg">
                            </div>
                            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                                <Image width={500} height={500} src="/images/screens/Categories.png" className="dark:hidden w-[272px] h-[572px]" alt="vitaway client dashboard" />
                                <Image width={500} height={500} src="/images/screens/Categories.png" className="hidden dark:block w-[272px] h-[572px]" alt="vitaway client dashboard" />
                            </div>
                        </div>
                    </div>

                    <span className="absolute right-0 bottom-8 z-10">
                        <svg width="93" height="93" viewBox="0 0 93 93" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                            <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                            <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                            <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                            <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                            <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                            <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                            <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                            <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                            <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                            <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                            <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                            <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                            <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                            <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                            <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                            <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                            <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                            <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                            <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                            <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                            <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                            <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                            <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                            <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                        </svg>
                    </span>
                </div>
            </div>
        </section>
    </>)
}

export default Hero