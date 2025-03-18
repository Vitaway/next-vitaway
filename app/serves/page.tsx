import React from 'react'
import PageHeader from '../components/headers/page-header';
import Link from 'next/link';
import GuestLayout from '../layouts/GuestLayout';

function WhoWeServe() {
    const programs = [
        {
            title: 'Diabetes',
            description: 'Simply Diabetes management with quick checks and a Proper...',
            image: '/images/screens/learn.png'
        },
        {
            title: 'Hypertension',
            description: 'Track Your health trends to work toward reaching your health...',
            image: '/images/screens/learn.png'
        },
        {
            title: 'Weight Management',
            description: 'Find tools and strategies to help healthy weight…',
            image: '/images/screens/learn.png'
        },
        {
            title: 'Mental Health',
            description: 'we care about your mental health.',
            image: '/images/screens/learn.png'
        }
    ];

    return (<>
        <GuestLayout>
            <PageHeader
                title='Your well being with vitaway’s Health Plan'
                description='Our personalized programs are designed to inspire better health outcomes. We believe in tailoring wellness plans to your unique needs'
                sup_title='Who We Serve'
                backgroundImage='https://res.cloudinary.com/dzhuhtn30/image/upload/v1671533556/vite-guest-imgs/allgo-an-app-for-plus-size-people-eqlRthvN188-unsplash_mjb1s7.jpg'
            />

            <section id="services" className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    <div>
                        <p className="inline-block  font-normal px-3 py-px mb-4 text-xs tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                            programs
                        </p>
                    </div>
                    <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-slate-900 sm:text-4xl md:mx-auto">
                        <span className="relative inline-block">
                            <svg viewBox="0 0 52 24" fill="currentColor" className="absolute top-9 right-10 z-0 hidden w-28 -mt-8 -ml-20 text-blue-gray-100 lg:w-28 lg:-ml-28 lg:-mt-10 sm:block">
                                <defs>
                                    <pattern id="18302e52-9e2a-4c8e-9550-0cbb21b38e55" x="0" y="0" width=".135"
                                        height=".30">
                                        <circle cx="1" cy="1" r=".7"></circle>
                                    </pattern>
                                </defs>
                                <rect fill="url(#18302e52-9e2a-4c8e-9550-0cbb21b38e55)" width="52" height="24"></rect>
                            </svg>
                            <span className="relative  font-normal"></span>
                        </span>
                        Accessible Programs
                    </h2>
                    <p className="text-base text-gray-700 md:text-lg font-merri font-normal">
                        Virtual care is the first integrated solution. To achieve long-lasting health changes on their terms, Vitaway supports members in changing their thinking.
                    </p>
                </div>

                <div className="-mx-4 mt-10 grid grid-cols-4 gap-2">
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
                                <p className="text-slate-600 font-medium text-base leading-6 text-md mt-5 line-clamp-2">{program.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </GuestLayout>
    </>)
}

export default WhoWeServe;