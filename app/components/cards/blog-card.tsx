import { Blogs } from '@/types/blogs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogCard({ blog }: { blog: Blogs }) {
    return (<>
        <Link href={`/blogs/${blog.slug}`}>
            <div>
                <div className="block aspect-w-4 aspect-h-3">
                    <Image width={100} height={100} className="object-cover w-full h-full rounded-xl" src={blog.image} alt={blog.title} />
                </div>

                <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-rose-500 bg-rose-100 mt-3">
                    {blog.category}
                </span>

                <p className="mt-3 text-xl font-semibold text-black line-clamp-2">{ blog.title }</p>
                <p className="mt-4 text-gray-600 line-clamp-3">{ blog.caption }</p>
                <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
                <span className="block text-sm font-bold tracking-widest text-gray-500 uppercase">{ blog.date }</span>
            </div>
        </Link>
    </>)
}

export default BlogCard