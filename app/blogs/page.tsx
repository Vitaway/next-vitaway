import React from 'react'
import PageHeader from '../components/headers/page-header'
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import AllBlogs from '../components/sections/all-blogs';

export const metadata: Metadata = {
    title: "Latest Blogs and Articles",
    description: "Explore our latest blogs and articles to learn more about the latest trends in health and wellness. Stay up to date with the latest news and information to help you live a healthier life.",
    keywords: "Vitaway, Blogs, Articles, Health, Wellness, Trends, News, Information, vitaway health ltd, vitaway health, health rwanda",
    metadataBase: new URL("https://www.vitaway.org"),
    openGraph: {
        title: "Latest Blogs and Articles",
        description: "Explore our latest blogs and articles to learn more about the latest trends in health and wellness. Stay up to date with the latest news and information to help you live a healthier life.",
        type: "website",
        url: "https://vitaway.com/blogs",
        images: [
            {
                url: "https://vitaway.com/images/vitaway-logo.png",
                width: 1200,
                height: 630,
                alt: "Vitaway Logo",
            },
        ],
    },
}

function Blogs() {
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Our Blogs'
                title='Our Recent Blogs and Articles'
                description='Explore our latest blogs and articles to learn more about the latest trends in health and wellness. Stay up to date with the latest news and information to help you live a healthier life.'
                backgroundImage=''
            />

            <section className=" bg-white px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="flex items-end justify-between">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-3xl lg:text-4xl">Latest from blog</h2>
                        <p className="max-w-xl mx-auto mt-4 text-sm leading-relaxed text-gray-600 lg:mx-0">
                            Stay updated with our latest blogs and articles. Explore expert insights, tips, and inspiring stories to help you stay informed and lead a healthier, happier life.
                        </p>
                    </div>
                </div>

                <AllBlogs />

                <div className="flex items-center justify-center mt-8 space-x-3 lg:hidden">
                    <button type="button" className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button type="button" className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </section>
        </GuestLayout>
    </>)
}

export default Blogs