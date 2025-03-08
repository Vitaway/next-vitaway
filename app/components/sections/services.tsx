import React from 'react';
import Image from 'next/image';

function Services() {
    return (<>
        <div className="our-goal relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="grid gap-5 row-gap-8 lg:grid-cols-2 items-center">
                <div className="flex flex-col justify-center">
                    <div className="max-w-xl">
                        <h2 style={{ lineHeight: '2.6rem' }} className="max-w-lg mb-6 font-bold leading-10 text-3xl tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                            Virtual-first care to address expensive chronic conditions found across your population
                            <span className="relative px-1">
                                <div className="absolute inset-x-0 bottom-0 h-3 transform -skew-x-12 bg-teal-accent-400"></div>
                            </span>
                        </h2>
                        <p className="text-base text-gray-700 md:text-lg">
                            Using science and technology to bring about change, we improve patient care through the latest technology, data collection, and advanced medical services.
                        </p>
                    </div>
                    <div className="grid gap-3 row-gap-2 sm:grid-cols-2 mt-10">
                        <div className="mb-2 rounded-xl bg-white p-5 border border-gray-200 md:px-4 xl:px-5" style={{ border: '1px solid #e7dfd7' }}>
                            <h4 className="mb-3 text-xl font-bold text-slate-700">
                                Vitaway for Diabetes
                            </h4>
                            <p className="text-gray-600 font-medium leading-6 text-md text-sm">
                                A specially formulated supplement designed to complement your health journey, providing essential nutrients to help manage diabetes.
                            </p>
                        </div>
                        <div className="mb-2  rounded-xl bg-white p-5 border border-gray-200 md:px-4 xl:px-5" style={{ border: '1px solid #e7dfd7' }}>
                            <h4 className="mb-3 text-xl font-bold text-slate-700">
                                Vitaway for Prevention
                            </h4>
                            <p className="text-gray-600 font-medium text-sm leading-6">
                                The power of Vitaway, a comprehensive solution for proactive health and prevention
                            </p>
                        </div>
                        <div className="mb-2  rounded-xl bg-white p-5 border border-gray-200 md:px-4 xl:px-5" style={{ border: '1px solid #e7dfd7' }}>
                            <h4 className="mb-3 text-xl font-bold text-slate-700">
                                Vitaway for Hypertension
                            </h4>
                            <p className="text-gray-600 font-medium text-sm leading-6">
                                Improve heart health, and lead a more balanced life without relying solely on medication
                            </p>
                        </div>
                        <div className="mb-2 rounded-xl bg-white p-5 border border-gray-200 md:px-4 xl:px-5"
                            style={{ border: '1px solid #e7dfd7' }}>
                            <h4 className="mb-3 text-xl font-bold text-slate-700">
                                For also Mental Wellness
                            </h4>
                            <p className="text-gray-600 font-medium text-sm leading-6">
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
                    <Image width={400} height={400} className="animate__animated animate__fadeInUp animate__slow object-cover w-full h-40 rounded sm:h-40 mt-4 shadow-sm"
                        src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Vitaway for Hypertension" />
                </div>
            </div>
        </div>
    </>)
}

export default Services