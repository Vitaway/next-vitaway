import { Blogs } from '@/types/blogs'
import React from 'react'
import BlogCard from '../cards/blog-card'
import Image from 'next/image'
import BlogCardSkeleton from '../cards/blog-card-skeleton'

function BlogList({ blogs, isLoading }: { blogs: Blogs[], isLoading: boolean }) {
    return (
        <div className='mt-2'>
            {blogs.length === 0 && !isLoading && <div className="text-center flex items-center justify-center">
                <div className=''>
                    <Image src='/svgs/blogs.svg' alt='blogs' width={300} height={300} />
                    <span className='font-bold text-slate-700'>No Blogs Uploaded.</span>
                </div>
            </div>}

            <div className="grid max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
                {isLoading
                    ? Array(6).fill(0).map((_, index) => <BlogCardSkeleton key={index} />)
                    : blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
            </div>
        </div>
    )
}

export default BlogList