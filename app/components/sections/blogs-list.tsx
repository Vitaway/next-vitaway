import { Blogs } from '@/types/blogs'
import React from 'react'
import BlogCard from '../cards/blog-card'

function BlogList({ blogs }: { blogs: Blogs[] }) {
    return (
        <div className="grid max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
            {blogs.map((blog, index) => (
                <BlogCard blog={blog} key={index} />
            ))}
        </div>
    )
}

export default BlogList