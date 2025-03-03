import React from 'react';
import Image from 'next/image';

function Services() {
    return (<>
        <div className="our-goal relative mt-4 px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:pt-24">
            <div className="absolute inset-x-0 top-0 items-top justify-center hidden overflow-hidden md:flex md:inset-y-0">
                <svg viewBox="0 0 88 88" className="w-full max-w-screen-xl text-blue-200">
                    <circle fill="currentColor" cx="44" cy="44" r="15.5"></circle>
                    <circle fillOpacity="0.2" fill="currentColor" cx="44" cy="44" r="44"></circle>
                    <circle fillOpacity="0.2" fill="currentColor" cx="44" cy="44" r="37.5"></circle>
                    <circle fillOpacity="0.3" fill="currentColor" cx="44" cy="44" r="29.5"></circle>
                    <circle fillOpacity="0.3" fill="currentColor" cx="44" cy="44" r="22.5"></circle>
                </svg>
            </div>

            <div className="relative">
                <div className="pt-7">
                    <div className="grid gap-5 row-gap-8 lg:grid-cols-2 items-center">
                        <div className="flex flex-col justify-center">
                            <div className="max-w-xl">
                                <h2 style={{ lineHeight: '2.6rem' }} className="max-w-lg mb-6 font-patua font-normal leading-10 text-3xl tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                                    Virtual-first care to address expensive chronic conditions found across your population
                                    <span className="relative px-1">
                                        <div className="absolute inset-x-0 bottom-0 h-3 transform -skew-x-12 bg-teal-accent-400"></div>
                                    </span>
                                </h2>
                                <p className="text-base text-gray-700 md:text-lg">
                                    Using science and technology to bring about change, we improve patient care through the latest technology, data collection, and advanced medical services.
                                </p>
                            </div>
                            <div className="grid gap-3 row-gap-2 sm:grid-cols-2 mt-5">
                                <div className="mb-2 animate__animated animate__fadeInUp animate__slow rounded-[20px] bg-white p-3 shadow-sm hover:shadow-lg md:px-4 xl:px-5" style={{ border: '1px solid #e7dfd7' }}>
                                    <h4 className="mb-3 text-xl font-patua font-medium text-dark">
                                        Vitaway for Diabetes
                                    </h4>
                                    <p className="text-gray-600 font-merri font-semibold leading-6 text-md">
                                        A specially formulated supplement designed to complement your health journey, providing essential nutrients to help manage diabetes.
                                    </p>
                                </div>
                                <div className="mb-2 animate__animated animate__fadeInUp animate__slow rounded-[20px] bg-white p-3 shadow-sm hover:shadow-lg md:px-4 xl:px-5" style={{ border: '1px solid #e7dfd7' }}>
                                    <h4 className="mb-3 text-xl font-patua font-medium text-dark">
                                        Vitaway for Prevention
                                    </h4>
                                    <p className="text-gray-600 font-merri font-semibold leading-6 text-md">
                                        The power of Vitaway, a comprehensive solution for proactive health and prevention
                                    </p>
                                </div>
                                <div className="mb-2 animate__animated animate__fadeInUp animate__slow rounded-[20px] bg-white p-3 shadow-sm hover:shadow-lg md:px-4 xl:px-5" style={{ border: '1px solid #e7dfd7' }}>
                                    <h4 className="mb-3 text-xl font-patua font-medium text-dark">
                                        Vitaway for Hypertension
                                    </h4>
                                    <p className="text-gray-600 font-merri font-semibold leading-6 text-md">
                                        Improve heart health, and lead a more balanced life without relying solely on medication
                                    </p>
                                </div>
                                <div className="mb-2 animate__animated animate__fadeInUp animate__slow rounded-[20px] bg-white p-3 shadow-sm hover:shadow-lg md:px-4 xl:px-5"
                                    style={{ border: '1px solid #e7dfd7' }}>
                                    <h4 className="mb-3 text-xl font-patua font-medium text-dark">
                                        For also Mental Wellness
                                    </h4>
                                    <p className="text-gray-600 font-merri font-semibold leading-6 text-md">
                                        Encouraging and optimize mental wellness alongside professional care
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Image width={400} height={400} className="animate__animated animate__fadeInUp animate__slow object-cover w-full h-40 rounded sm:h-40 shadow-sm"
                                src="https://plus.unsplash.com/premium_photo-1679392532113-bee46deab9fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                                alt="Vitaway for Diabetes" />
                            <Image width={400} height={400} className="animate__animated animate__fadeInUp animate__slow object-cover w-full h-40 rounded sm:h-40 mt-4 shadow-sm"
                                src="https://plus.unsplash.com/premium_photo-1672292535264-ef6dab7d6a90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVudGFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                                alt="Vitaway for Prevention" />
                            <Image width={400} height={400} className="animate__animated animate__fadeInUp animate__slow object-cover w-full h-40 rounded sm:h-40 mt-4 shadow-sm"
                                src="https://images.unsplash.com/photo-1621525434111-87a99d170b0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                                alt="Vitaway for Hypertension" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Services