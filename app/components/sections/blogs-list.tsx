import { Blogs } from '@/types/blogs'
import React from 'react'
import BlogCard from '../cards/blog-card'
import { InlineSpinner } from '@/app/components/spinners'

const BlogList = React.memo(function BlogList({ blogs, isLoading }: { blogs: Blogs[], isLoading: boolean }) {
    return (
        <div className='mt-2'>
            {isLoading ? (
                <InlineSpinner message="Loading blogs..." />
            ) : (
                <div className="grid max-w-md grid-cols-1 mx-auto mt-12 lg:max-w-full lg:mt-16 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
                    {blogs && blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                </div>
            )}
        </div>
    )
});

export default BlogList