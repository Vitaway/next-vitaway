import React from 'react'
import PageHeader from '../components/headers/page-header'
import Image from 'next/image'
import Link from 'next/link'
import GuestLayout from '../layouts/GuestLayout';

function Indivituals() {
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
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='For Indivituals'
                title='Transform your life and Mindset shift for Optimal health'
                description='Discover how changing your mindset can be the key to improving your overall health and well-being. Explore the power of a positive perspective in this journey toward a healthier you.'
                backgroundImage='https://images.unsplash.com/photo-1613089222731-8841ac989caa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU4fHxoZWFydCUyMGF0dGFja3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
            />

            <section className="aligible-container relative p-10 bg-white z-[11]">
                <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">

                    <div className="p-8 absolute border border-gray-200 -top-20 right-20 left-20 rounded-xl bg-white shadow-sm sm:p-16">
                        <div className="flex flex-col lg:flex-row">
                            <div className="mb-6 lg:mb-0 lg:w-1/2 lg:pr-5">
                                <h4 style={{ lineHeight: '2.5rem' }} className="font-semibold text-3xl tracking-tight text-slate-900 sm:text-4xl sm:leading-none">
                                    It takes only one minute to see if Vitaway is right for you and at no cost.
                                </h4>
                            </div>
                            <div className="lg:w-1/2">
                                <p className="mb-4 text-sm text-slate-700">
                                    Your path to better well-being with Vitaway&rsquo;s one-minute wellness assessment.
                                    Find out if our tailored solutions are right for you, at no cost.
                                    Your journey to improved health begins now!
                                </p>
                                <Link href="/" aria-label="" className="inline-flex items-center transition-colors duration-200 bg-indigo-600 px-4 py-3 rounded-[10px] font-normal font-patua text-gray-100 hover:text-deep-purple-800">
                                    I am Eligible
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="text-center grid grid-cols-3 gap-4">
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