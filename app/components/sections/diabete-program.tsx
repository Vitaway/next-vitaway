import React from 'react';
import Link from 'next/link';
import MobileFrame from '../design/mobile-frame';
import PatternDesign from '../design/pattern-design';

function DiabeteProgram() {
    const programs = [
        {
            title: 'EAT WELL GUIDE',
            description: 'The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.',
            image: '/images/screens/learn.png',
            link: '/programs/eat-well-guide'
        },
        {
            title: 'Food Groups',
            description: 'Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness. In this section',
            image: '/images/screens/learn.png',
            link: '/programs/food-groups'
        },
        {
            title: 'LIFE STAGES',
            description: 'Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness.',
            image: '/images/screens/learn.png',
            link: '/programs/life-stages'
        },
        {
            title: 'Management Health Issue',
            description: 'The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.',
            image: '/images/screens/learn.png',
            link: '/programs/well-being'
        }
    ];

    return (<>
        <div id="about" className="about-us px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="flex items-center justify-between">
                <div className="max-w-2/5">
                    <div className="left-image relative ml-5">
                        <div className="absolute right-0 -bottom-20 z-[2]">
                            <PatternDesign />
                        </div>

                        <div className='z-[10]'>
                            <MobileFrame 
                                title='Vitaway Client Dashboard'
                                image='/images/screens/learn.png'
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-3/5">
                    <div className="section-heading">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">How Vitaway&apos;s diabetes program works for members</h2>
                            <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">Our program empowers individuals to manage their diabetes and improve their overall health. We provide personalized support and resources to help you make lasting lifestyle changes.</p>
                        </div>
                        <div className="-mx-4 mt-10 grid grid-cols-2 gap-2">
                            {programs.map((program, index) => (
                                <Link href={program.link} key={index}>
                                    <div className="rounded-xl bg-white border border-gray-200 p-10">
                                        <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-[#3268b9]">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M18.6746 0.26779C10.0637 -1.33065 1.86522 4.39279 0.266779 13.0037C-0.506658 17.1803 0.421467 21.3568 2.79334 24.8631C5.21678 28.3693 8.82615 30.6897 12.9512 31.4631C13.9308 31.6178 14.859 31.7209 15.7871 31.7209C23.2637 31.7209 29.9668 26.3584 31.359 18.6756C32.9574 10.0647 27.234 1.81466 18.6746 0.26779ZM29.6574 18.3662C29.5543 18.8819 29.4512 19.449 29.2965 19.9131L16.7668 15.2209V1.81466C17.2824 1.86623 17.8496 1.91779 18.3652 2.02091C25.9449 3.4131 30.998 10.735 29.6574 18.3662ZM14.9105 1.81466V14.9115H1.86522C1.91678 14.3959 1.96834 13.8287 2.07147 13.3131C3.20584 6.86779 8.67147 2.22716 14.9105 1.81466ZM13.3121 29.6584C9.65115 28.9881 6.45428 26.9256 4.28865 23.8318C2.79334 21.7178 1.96834 19.2428 1.81365 16.7678H15.6324L28.5746 21.6147C26.048 27.3381 19.7574 30.8443 13.3121 29.6584Z"
                                                    fill="white" />
                                            </svg>
                                        </div>
                                        <h4 className="text-md font-bold text-slate-700">{program.title}</h4>
                                        <p className="text-slate-600 font-medium text-base leading-6 text-md mt-5">{program.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default DiabeteProgram