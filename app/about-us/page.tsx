import Image from 'next/image'
import React from 'react'
import PageHeader from '../components/headers/page-header'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Vitaway | Our Pledge to You",
    description: "Discover the Vitaway difference as we pledge to provide you with the highest quality healthcare solutions, personalized to your unique well-being.",
    openGraph: {
        images: [
            {
                url: "https://vitaway.org/images/Team/bg-1.jpeg",
                width: 800,
                height: 600,
                alt: "Vitaway core team"
            },
        ]
    }
};

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

function AboutUs() {
    return (<>
        <PageHeader
            sup_title='Our Pledge to You'
            title='Elevating Your Wellness - Your Journey with Our Commitment'
            description='Discover the Vitaway difference as we pledge to provide you with the highest quality healthcare solutions, personalized to your unique well-being.'
        />

        <div className="px-4 py-20 mx-auto text-slate-700 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="grid max-w-screen-xl gap-8 lg:grid-cols-2 sm:mx-auto" style={{ marginTop: '30px' }}>
                <div className="flex flex-col justify-center">
                    <div className="flex">
                        <div className="mr-4">
                            <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-indigo-50">
                                <svg className="w-8 h-8 text-deep-purple-accent-400" stroke="currentColor" viewBox="0 0 52 52">
                                    <polygon strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h6 className="mb-2 font-semibold leading-5">
                                Your Health and Time Matter that Committed to Your Best Life
                            </h6>
                            <p className="text-sm text-gray-900">
                                At Vitaway + , your health and time matter. We are committed to helping you live your best life. We offer accessible, convenient care for your busy lifestyle.
                            </p>
                            <hr className="w-full my-6 border-gray-300" />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mr-4">
                            <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-indigo-50">
                                <svg className="w-8 h-8 text-deep-purple-accent-400" stroke="currentColor" viewBox="0 0 52 52">
                                    <polygon strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h6 className="mb-2 font-semibold leading-5">
                                Our Formula for Lasting Health Transformation
                            </h6>
                            <p className="text-sm text-gray-900">
                                We employ leading-edge science, personal health management and ongoing support to provide lasting changes.
                            </p>
                            <hr className="w-full my-6 border-gray-300" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <Image width={100} height={100} className="object-cover w-full h-56 col-span-2 rounded" src="https://vitaway.org/images/Team/bg-1.jpeg" alt="vitaway core team" />
                </div>
            </div>
        </div>

        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="flex flex-col mb-6 lg:justify-between lg:flex-row md:mb-8">
                <h2 className="max-w-lg mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none md:mb-6 group">
                    <span className="inline-block mb-1 sm:mb-4  font-normal leading-10">
                        Real people who have experienced positive changes in their lives through Vitaway
                    </span>
                    <div className="h-1 ml-auto duration-300 origin-left transform bg-deep-purple-accent-400 scale-x-30 group-hover:scale-x-100"></div>
                </h2>
                <p className="text-gray-700 lg:text-md leading-6 lg:max-w-md  font-normal">
                    Where our healthcare journey comes to life. Take a visual tour through the heart of our startup and discover the world of innovative solutions and compassionate care that define us.
                </p>
            </div>

            <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                <a href="#">
                    <div className="relative overflow-hidden transition duration-200 transform rounded hover:-translate-y-2 hover:shadow-2xl">
                        <Image width={100} height={100} className="object-cover w-full h-56 md:h-64 xl:h-80" src="https://vitaway.org/images/Team/bg.jpeg" alt="vitaway team during meetup" />
                        <div className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">Mona Lisa</p>
                            <p className="text-sm tracking-wide text-gray-300">
                                Painted between 1503 and 1517, Da Vinci’s alluring portrait has been dogged by two questions since the day it was made: Who’s the subject and why is she smiling?
                            </p>
                        </div>
                    </div>
                </a>
                <a href="#" aria-label="View Item">
                    <div className="relative overflow-hidden transition duration-200 transform rounded hover:-translate-y-2 hover:shadow-2xl">
                        <Image width={100} height={100} className="object-cover w-full h-56 md:h-64 xl:h-80" src="https://vitaway.org/images/Team/bg-1.jpeg" alt="vitaway team during meetup" />
                        <div className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">The Starry Night</p>
                            <p className="text-sm tracking-wide text-gray-300">
                                Vincent Van Gogh’s most popular painting, The Starry Night was created by Van Gogh at the asylum in Saint-Rémy, where he’d committed himself in 1889.
                            </p>
                        </div>
                    </div>
                </a>
                <a href="#" aria-label="View Item">
                    <div className="relative overflow-hidden transition duration-200 transform rounded hover:-translate-y-2 hover:shadow-2xl">
                        <Image width={100} height={100} className="object-cover w-full h-56 md:h-64 xl:h-80" src="https://vitaway.org/images/summit.jpeg" alt="vitaway team during meetup" />
                        <div className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">The Kiss</p>
                            <p className="text-sm tracking-wide text-gray-300">
                                Opulently gilded and extravagantly patterned, The Kiss, Gustav Klimt’s fin-de-siècle portrayal of intimacy, is a mix of Symbolism and Vienna Jugendstil, the Austrian variant of Art Nouveau.
                            </p>
                        </div>
                    </div>
                </a>
                <a href="#" aria-label="View Item">
                    <div className="relative overflow-hidden transition duration-200 transform rounded hover:-translate-y-2 hover:shadow-2xl">
                        <Image width={100} height={100} className="object-cover w-full h-56 md:h-64 xl:h-80" src="https://images.unsplash.com/photo-1543300055-4a87568503c8?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="vitaway team during meetup" />
                        <div className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">The Harvesters</p>
                            <p className="text-sm tracking-wide text-gray-300">
                                Bruegel’s fanfare for the common man is considered one of the defining works of Western art. This composition was one of six created on the theme of the seasons.
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </>)
}

export default AboutUs