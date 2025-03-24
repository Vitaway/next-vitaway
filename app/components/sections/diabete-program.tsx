import React from 'react';
import Link from 'next/link';
import MobileFrame from '../design/mobile-frame';
import PatternDesign from '../design/pattern-design';
import programs from '../../../content/programs.json';

function DiabeteProgram() {
    return (<>
        <div id="about" className="about-us px-4 py-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="w-full lg:w-2/5 mb-10 lg:mb-0">
                    <div className="left-image relative ml-0 lg:ml-5">
                        <div className="absolute right-0 -bottom-10 lg:-bottom-20 z-[2]">
                            <PatternDesign />
                        </div>

                        <div className="z-20">
                            <MobileFrame
                                title="Vitaway Client Dashboard"
                                image="/images/screens/learn.png"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-3/5">
                    <div className="section-heading">
                        <div className="max-w-2xl mx-auto text-center lg:text-left">
                            <h2 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl lg:text-4xl">
                                How Vitaway&apos;s diabetes program works for members
                            </h2>
                            <p className="max-w-lg mx-auto lg:mx-0 mt-4 text-base leading-relaxed text-gray-600">
                                Our program empowers individuals to manage their diabetes and improve their overall health. We provide personalized support and resources to help you make lasting lifestyle changes.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                            {programs.map((program, index) => (
                                <Link href={program.link} key={index}>
                                    <div className="rounded-xl bg-white border border-gray-200 p-6 sm:p-8">
                                        <div className="mb-6 flex h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-2xl bg-[#3268b9]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 3.2v.01M12 7.7v.01M12 11.7v.01" stroke="#ffffff" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M12 15.7v.01" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M12 19.2v.01" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M12 22.2v.01" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M3.5 7.7v.01M20.5 7.7v.01" stroke="#ffffff" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M20.5 11.7v.01M3.5 11.7v.01" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M20.5 14.7v.01" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M20.5 17.7v.01" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M3.5 14.7v.01" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M3.5 17.7v.01" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M7.8 9.7v.01M7.75 5.5v.01M16.2 9.7v.01M16.25 5.5v.01" stroke="#ffffff" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M7.8 13.7v.01" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M7.8 16.7v.01" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M7.8 19.7v.01" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M16.2 13.7v.01" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M16.2 16.7v.01" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity=".4" d="M16.2 19.7v.01" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-md font-bold text-slate-700 uppercase">{program.title}</h4>
                                        
                                        <p className="text-slate-600 font-medium text-base leading-6 text-md mt-5 line-clamp-3">
                                            {program.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    </>)
}

export default DiabeteProgram