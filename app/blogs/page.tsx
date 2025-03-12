import React from 'react'
import PageHeader from '../components/headers/page-header'
import Image from 'next/image';

const blogs = [
    {
        imgSrc: "https://cdn.rareblocks.xyz/collection/celebration/images/blog/2/blog-post-1.jpg",
        imgAlt: "How to build coffee inside your home in 5 minutes.",
        category: "Lifestyle",
        date: "March 21, 2020",
        title: "How to build coffee inside your home in 5 minutes.",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
    },
    {
        imgSrc: "https://cdn.rareblocks.xyz/collection/celebration/images/blog/2/blog-post-2.jpg",
        imgAlt: "7 Tips to run your remote team faster and better.",
        category: "Marketing",
        date: "April 04, 2020",
        title: "7 Tips to run your remote team faster and better.",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
    },
    {
        imgSrc: "https://cdn.rareblocks.xyz/collection/celebration/images/blog/2/blog-post-3.jpg",
        imgAlt: "5 Productivity tips to write faster at morning.",
        category: "Productivity",
        date: "May 12, 2020",
        title: "5 Productivity tips to write faster at morning.",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
    },
    {
        imgSrc: "https://cdn.rareblocks.xyz/collection/celebration/images/blog/2/blog-post-1.jpg",
        imgAlt: "How to build coffee inside your home in 5 minutes.",
        category: "Lifestyle",
        date: "March 21, 2020",
        title: "How to build coffee inside your home in 5 minutes.",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
    },
    {
        imgSrc: "https://cdn.rareblocks.xyz/collection/celebration/images/blog/2/blog-post-2.jpg",
        imgAlt: "7 Tips to run your remote team faster and better.",
        category: "Marketing",
        date: "April 04, 2020",
        title: "7 Tips to run your remote team faster and better.",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
    },
    {
        imgSrc: "https://cdn.rareblocks.xyz/collection/celebration/images/blog/2/blog-post-3.jpg",
        imgAlt: "5 Productivity tips to write faster at morning.",
        category: "Productivity",
        date: "May 12, 2020",
        title: "5 Productivity tips to write faster at morning.",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
    }
];

function Blogs() {
    return (<>
        <PageHeader
            sup_title='Our Blogs'
            title='Our Recent Blogs and Articles'
            description='Explore our latest blogs and articles to learn more about the latest trends in health and wellness. Stay up to date with the latest news and information to help you live a healthier life.'
        />

        <section className=" bg-white px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="flex items-end justify-between">
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Latest from blog</h2>
                    <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600 lg:mx-0">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
                </div>

                <div className="hidden lg:flex lg:items-center lg:space-x-3">
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
            </div>

            <div className="grid max-w-md grid-cols-1 gap-6 mx-auto mt-8 lg:mt-16 lg:grid-cols-3 lg:max-w-full">
                {blogs.map((blog, index) => (
                    <div key={index} className="overflow-hidden bg-white rounded-xl shadow">
                        <div className="relative">
                            <a href="#" title="" className="block aspect-w-4 aspect-h-3">
                                <Image width={100} height={100} className="object-cover w-full h-full" src={blog.imgSrc} alt={blog.imgAlt} />
                            </a>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full"> {blog.category} </span>
                            </div>
                        </div>
                        <div className='p-5'>
                            <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase"> {blog.date} </span>
                            <p className="mt-5 text-2xl font-semibold">
                                <a href="#" title="" className="text-black"> {blog.title} </a>
                            </p>
                            <p className="mt-4 text-base text-gray-600">{blog.description}</p>
                            <a href="#" title="" className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600">
                                Continue Reading
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                        </a>
                        </div>
                    </div>
                ))}
            </div>

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

    </>)
}

export default Blogs