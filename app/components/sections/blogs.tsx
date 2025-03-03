import Image from 'next/image'
import React from 'react'

function Blogs() {
    return (<>
        <section className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Latest from blog</h2>
                <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
            </div>

            <div className="grid max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
                <div>
                    <a href="#" title="" className="block aspect-w-4 aspect-h-3">
                        <Image width={100} height={100} className="object-cover w-full h-full rounded-xl" src="https://cdn.rareblocks.xyz/collection/celebration/images/blog/1/blog-post-1.jpg" alt="" />
                    </a>
                    <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-rose-500 bg-rose-100 mt-9"> Technology </span>
                    <p className="mt-6 text-xl font-semibold">
                        <a href="#" title="" className="text-black"> How to mange your remote team? </a>
                    </p>
                    <p className="mt-4 text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                    <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
                    <span className="block text-sm font-bold tracking-widest text-gray-500 uppercase"> Martin Jones . June 12, 2021 </span>
                </div>

                <div>
                    <a href="#" title="" className="block aspect-w-4 aspect-h-3">
                        <Image width={100} height={100} className="object-cover  rounded-xl w-full h-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/blog/1/blog-post-2.jpg" alt="" />
                    </a>
                    <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-sky-500 bg-sky-100 mt-9"> Marketing </span>
                    <p className="mt-6 text-xl font-semibold">
                        <a href="#" title="" className="text-black"> 6 Product launching emails you want to use on next campaign. </a>
                    </p>
                    <p className="mt-4 text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                    <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
                    <span className="block text-sm font-bold tracking-widest text-gray-500 uppercase"> Martin Jones . June 12, 2021 </span>
                </div>

                <div>
                    <a href="#" title="" className="block aspect-w-4 aspect-h-3">
                        <Image width={100} height={100} className="object-cover rounded-xl w-full h-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/blog/1/blog-post-3.jpg" alt="" />
                    </a>
                    <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-sky-500 bg-sky-100 mt-9"> Marketing </span>
                    <p className="mt-6 text-xl font-semibold">
                        <a href="#" title="" className="text-black"> Learn from the best: 7 email marketing ideas you can use </a>
                    </p>
                    <p className="mt-4 text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                    <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
                    <span className="block text-sm font-bold tracking-widest text-gray-500 uppercase"> Martin Jones . June 12, 2021 </span>
                </div>
            </div>
        </section>

    </>)
}

export default Blogs