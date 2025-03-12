import Image from 'next/image'
import React from 'react';
import blogs from '../../../content/blogs.json';

function Blogs() {
    return (<>
        <section className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Latest from blog</h2>
                <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
            </div>

            <div className="grid max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
                {blogs.map((blog, index) => (
                    <div key={index}>
                        <a href="#" title="" className="block aspect-w-4 aspect-h-3">
                            <Image width={100} height={100} className="object-cover w-full h-full rounded-xl" src={blog.image} alt={blog.title} />
                        </a>
                        <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-rose-500 bg-rose-100 mt-9"> {blog.category} </span>
                        <p className="mt-6 text-xl font-semibold">
                            <a href="#" title="" className="text-black"> {blog.title} </a>
                        </p>
                        <p className="mt-4 text-gray-600">{blog.content}</p>
                        <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
                        <span className="block text-sm font-bold tracking-widest text-gray-500 uppercase"> {blog.date} </span>
                    </div>
                ))}
            </div>
        </section>
    </>)
}

export default Blogs