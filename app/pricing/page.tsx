import React from 'react'
import BackgroundBlurImage from '../components/design/background-blur-image';
import { Metadata } from 'next';
import pricingTable from '../../content/pricing.json';

export const metadata: Metadata = {
    title: "Healthcare Solutions From all walks of Life",
    description: "Empowering Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.",
    keywords: "Rwanda, healthcare, digital health, nutrition, NCDs, youth health, Vitaway, e-clinic, health education, healthy lifestyle",
    metadataBase: new URL("https://www.vitaway.org"),
    openGraph: {
        title: "Healthcare Solutions From all walks of Life",
        description: "Empowering Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.",
        type: "website",
        url: "https://vitaway.com",
        images: [
            {
                url: "https://vitaway.com/images/",
                width: 1200,
                height: 630,
                alt: "Vitaway Logo",
            },
        ],
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

function Pricing() {
    return (<>
        <div className="relative w-full h-full">
            <div className="absolute hidden w-full bg-gradient-to-b from-[#272749] to-[#111827] lg:block h-96"></div>
            <div className="z-[5] absolute left-1/2 top-0 aspect-[1204/394] w-full max-w-[1204px] -translate-x-1/2">
                <BackgroundBlurImage />
            </div>

            <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:mx-auto">
                        <span className="relative inline-block">
                            <svg viewBox="0 0 52 24" fill="currentColor"
                                className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-gray-400 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block">
                                <defs>
                                    <pattern id="2c67e949-4a23-49f7-bf27-ca140852cf21" x="0" y="0" width=".135"
                                        height=".30">
                                        <circle cx="1" cy="1" r=".7"></circle>
                                    </pattern>
                                </defs>
                                <rect fill="url(#2c67e949-4a23-49f7-bf27-ca140852cf21)" width="52" height="24">
                                </rect>
                            </svg>
                            <span
                                className="relative  font-normal bg-[#2e91ce]/50 hover:bg-[#1da1f2]/90 rounded-tl-lg rounded-br-lg px-3">Accessible</span>
                        </span>
                        <span className='ml-2'>Healthcare for All on Affordable Pricing</span>
                    </h2>
                    <p className="text-base text-gray-300 md:text-lg">
                        We believe that good health shouldn&apos;t be a luxury, and our transparent and budget-friendly pricing
                        options reflect that commitment,
                        Discover how Vitaway puts your well-being first, without compromise.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-y-8 mt-10 max-md:max-w-sm max-md:mx-auto">
                    {pricingTable.map((plan, index) => (
                        <div key={index} className={`bg-gray-100 text-slate-700 rounded-3xl overflow-hidden p-8 ${plan.highlighted ? 'scale-[1.05] shadow-[0_2px_40px_-4px_rgba(93,96,127,0.2)]' : ''}`} style={{ border: '1px solid #e7dfd7' }}>
                            <div className="text-left">
                                <h4 className="text-3xl font-semibold">{plan.title}</h4>
                                <p className="text-md mt-2 text-gray-600">{plan.short_desc}</p>
                                <h3 className="text-xl font-semibold mt-4">{plan.price}<sub className="text-sm font-normal  text-gray-400 ml-2">/ Month</sub></h3>
                                <button type="button" className="w-full mt-8 px-2 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-full">Get Started</button>
                            </div>
                            <div className="mt-8">
                                <h4 className="text-lg font-bold mb-4">Plan Included</h4>

                                <ul className="space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <li className="flex items-center text-sm" key={index}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-4 bg-gray-200 fill-[#333] rounded-full p-[3px]" viewBox="0 0 24 24">
                                                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>)
}

export default Pricing