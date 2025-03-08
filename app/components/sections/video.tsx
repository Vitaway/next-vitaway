import Image from 'next/image'
import React from 'react'

function Video() {
    return (<>
        <div className="w-screen bg-gradient-to-b from-[#272749] to-[#111827]">
            <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:text-left">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <span
                                        className="rounded-full uppercase bg-pink-500 px-3 py-0.5 text-sm font-semibold leading-5 text-white">
                                        Early Access
                                    </span>
                                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                                        <span className="sm:text-6xl"></span>Unlock Your Potential with a 
                                        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0878de] to-white">14-day
                                            Free Trial</span>
                                        And Discover All Our Features.
                                    </h1>
                                </div>

                                <p className="text-base text-gray-200 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                    Explore the platform and discover how we can help you achieve your health goals.
                                </p>
                            </div>

                            <div className="border-t border-gray-700"></div>

                            <div className="flex space-x-4 items-center text-white">
                                <div className="flex items-center space-x-2">
                                    <div className="flex flex-shrink-0 -space-x-1">
                                        <Image width={400} height={400} className="h-6 w-6 max-w-none rounded-full ring-2 ring-white" src="/images/members/member-1.jpg" alt="Noela Lidvine" />
                                        <Image width={400} height={400} className="h-6 w-6 max-w-none rounded-full ring-2 ring-white" src="/images/members/member-2.jpeg" alt="Hakuzimana Emmanuel" />
                                        <Image width={400} height={400} className="h-6 w-6 max-w-none rounded-full ring-2 ring-white" src="/images/members/member-3.jpg" alt="Niyongira Eric" />
                                        <Image width={400} height={400} className="h-6 w-6 max-w-none rounded-full ring-2 ring-white" src="/images/members/member-4.jpg" alt="SHimirwa steven" />
                                    </div>

                                    <span className="flex-shrink-0 text-xs font-bold leading-5">+100</span>
                                </div>

                                <div className="h-4 border-l border-gray-700"></div>

                                <div className="flex items-center">
                                    <svg className="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                        <path
                                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z">
                                        </path>
                                    </svg>
                                    <svg className="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                        <path
                                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z">
                                        </path>
                                    </svg>
                                    <svg className="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                        <path
                                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z">
                                        </path>
                                    </svg>
                                    <svg className="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                        <path
                                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z">
                                        </path>
                                    </svg>
                                    <svg className="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                        <path
                                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z">
                                        </path>
                                    </svg>

                                </div>
                                <div className="h-4 border-l border-gray-700"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full col-span-6">
                        <div className="px-6 h-96 lg:h-100% w-full max-w-2xl col-span-6 flex items-center mx-auto">
                            <div style={{ width: '100%', height: '100%' }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}>
                                    <iframe width="560" height="315"
                                        src="https://www.youtube.com/embed/T73sfGzsUeU?si=GFWbdV2_NyQB96IP"
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>)
}

export default Video