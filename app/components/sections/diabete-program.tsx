import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function DiabeteProgram() {
    const programs = [
        {
            title: 'EAT WELL GUIDE',
            description: 'The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.',
            image: '/images/screens/learn.png'
        },
        {
            title: 'Food Groups',
            description: 'Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness. In this section',
            image: '/images/screens/learn.png'
        },
        {
            title: 'LIFE STAGES',
            description: 'Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness.',
            image: '/images/screens/learn.png'
        },
        {
            title: 'Management Health Issue',
            description: 'The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.',
            image: '/images/screens/learn.png'
        }
    ];

    return (<>
        <div id="about" className="about-us px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="flex items-center justify-between">
                <div className="max-w-2/5">
                    <div className="left-image relative ml-5">
                        <div border-radius="50% 200% 40% 80%" className="css-1ueqzyg"></div>
                        <div border-radius="50% 200% 40% 80%" className="css-10gqqxt"></div>

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

                        <div className="z-10 relative animate__animated animate__fadeInUp animate__slow rotate-6 translate-x-10 border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                            <div
                                className="w-[148px] h-[20px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute">
                            </div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[3px] top-[124px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[3px] top-[178px] rounded-l-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[3px] top-[142px] rounded-r-lg"></div>
                            <div className="rounded-[2rem] overflow-hidden w-[274px] h-[572px] bg-white dark:bg-gray-800">
                                <Image width={500} height={500} src="/images/screens/learn.png" className="dark:hidden w-[274px] h-[572px]" alt="vitaway programs and learning" />
                                <Image width={500} height={500} src="/images/screens/learn.png" className="hidden dark:block w-[274px] h-[572px]" alt="vitaway programs and learning" />
                            </div>
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
                                <Link href="/" key={index}>
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