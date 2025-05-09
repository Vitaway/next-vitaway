import React from 'react'
import PageHeader from '../components/headers/page-header'
import Image from 'next/image'
import Link from 'next/link'
import GuestLayout from '../layouts/GuestLayout';

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

const cardData = [
    {
        imgSrc: "https://cdn-icons-png.flaticon.com/512/4436/4436450.png",
        imgAlt: "Small steps, long-term change",
        title: "Small steps, long-term change",
        description: "When life happens, Vitaway helps you stay on track with a plan that constantly adapts to meet your needs."
    },
    {
        imgSrc: "https://cdn-icons-png.flaticon.com/512/4288/4288923.png",
        imgAlt: "Find your Joy",
        title: "Find your Joy",
        description: "Try new things you’ll actually enjoy, rather than avoiding foods you 'Can’t eat' or things you 'shouldn’t do'."
    },
    {
        imgSrc: "https://cdn-icons-png.flaticon.com/512/1685/1685803.png",
        imgAlt: "Virtual Care, uniquely yours",
        title: "Virtual Care, Uniquely yours",
        description: "Your health journey is unique to you. That’s why Vitaway offers personalized support and guidance."
    }
];
function Indivituals() {
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='For Indivituals'
                title='Transform your life and Mindset shift for Optimal health'
                description='Discover how changing your mindset can be the key to improving your overall health and well-being. Explore the power of a positive perspective in this journey toward a healthier you.'
                backgroundImage='https://images.unsplash.com/photo-1613089222731-8841ac989caa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU4fHxoZWFydCUyMGF0dGFja3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
            />

            <section className="aligible-container relative p-6 bg-white z-[11]">
                <div className="px-4 py-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-8 lg:px-6 lg:py-16">

                    <div className="p-6 absolute border border-gray-200 -top-16 sm:-top-20 sm:right-0 sm:left-0 md:right-16 md:left-16 lg:right-20 lg:left-20 rounded-xl bg-white shadow-sm sm:p-12 lg:p-16">
                        <div className="flex flex-col lg:flex-row">
                            <div className="mb-6 lg:mb-0 lg:w-1/2 lg:pr-5">
                                <h4 style={{ lineHeight: '2.5rem' }} className="font-semibold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900 sm:leading-none">
                                    It takes only one minute to see if Vitaway is right for you and at no cost.
                                </h4>
                            </div>
                            <div className="lg:w-1/2">
                                <p className="mb-4 text-sm sm:text-base text-slate-700">
                                    Your path to better well-being with Vitaway&rsquo;s one-minute wellness assessment.
                                    Find out if our tailored solutions are right for you, at no cost.
                                    Your journey to improved health begins now!
                                </p>
                                <Link href="/indivituals/canrisk" aria-label="" className="inline-flex items-center transition-colors duration-200 bg-indigo-600 px-4 py-3 rounded-[10px] font-normal font-patua text-gray-100 hover:text-deep-purple-800">
                                    I am Eligible
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

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

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
                    {programs.map((program, index) => (
                        <Link href="/" key={index}>
                            <div className="rounded-xl bg-white border border-gray-200 p-6 sm:p-8 md:p-10">
                                <div className="mb-6 sm:mb-8 flex h-[50px] w-[50px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-2xl bg-[#3268b9]">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18.6746 0.26779C10.0637 -1.33065 1.86522 4.39279 0.266779 13.0037C-0.506658 17.1803 0.421467 21.3568 2.79334 24.8631C5.21678 28.3693 8.82615 30.6897 12.9512 31.4631C13.9308 31.6178 14.859 31.7209 15.7871 31.7209C23.2637 31.7209 29.9668 26.3584 31.359 18.6756C32.9574 10.0647 27.234 1.81466 18.6746 0.26779ZM29.6574 18.3662C29.5543 18.8819 29.4512 19.449 29.2965 19.9131L16.7668 15.2209V1.81466C17.2824 1.86623 17.8496 1.91779 18.3652 2.02091C25.9449 3.4131 30.998 10.735 29.6574 18.3662ZM14.9105 1.81466V14.9115H1.86522C1.91678 14.3959 1.96834 13.8287 2.07147 13.3131C3.20584 6.86779 8.67147 2.22716 14.9105 1.81466ZM13.3121 29.6584C9.65115 28.9881 6.45428 26.9256 4.28865 23.8318C2.79334 21.7178 1.96834 19.2428 1.81365 16.7678H15.6324L28.5746 21.6147C26.048 27.3381 19.7574 30.8443 13.3121 29.6584Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h4 className="text-sm sm:text-md font-bold text-slate-700">{program.title}</h4>
                                <p className="text-slate-600 font-medium text-sm sm:text-base leading-5 sm:leading-6 sm:mt-5 line-clamp-2">{program.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cardData.map((card, index) => (
                        <div className="col-md" key={index}>
                            <div className="bg-white border border-gray-200 rounded-xl p-8">
                                <div className="flex items-center flex-col">
                                    <div className="icon bg-indigo-50 rounded-full p-5">
                                        <Image src={card.imgSrc} alt={card.imgAlt} className="w-[50px]" width={100} height={100} />
                                    </div>
                                    <h3 className="card-title mb-3 mt-5 text-xl font-semibold text-slate-700">
                                        {card.title}
                                    </h3>
                                    <p className="card-text text-black font-medium text-sm">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </GuestLayout>
    </>)
}

export default Indivituals