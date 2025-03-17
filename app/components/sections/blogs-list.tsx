import { Blogs } from '@/types/blogs'
import React from 'react'
import BlogCard from '../cards/blog-card'
import Image from 'next/image'

function BlogList({ blogs }: { blogs: Blogs[] }) {
    return (
        <div className='mt-2'>
            {blogs.length === 0 && <p className="text-center flex items-center justify-center">
                <div className=''>
                    <Image src='/svgs/blogs.svg' alt='blogs' width={300} height={300} />
                    <span className='font-bold text-slate-700'>No Blogs Uploaded.</span>
                </div>
            </p>}
            {blogs && <div className="grid max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
                {blogs.map((blog, index) => (
                    <BlogCard blog={blog} key={index} />
                ))}
            </div>}
        </div>
    )
}

export default BlogList