import { Blogs } from '@/types/blogs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogCard({ blog }: { blog: Blogs }) {

    return (<>
        <Link href={`/blogs/${blog.slug}`}>
            <div>
                <div className="block aspect-w-4 aspect-h-3">
                    {typeof blog.images[0] === 'object' && blog.images[0] !== null ? (
                        <Image width={500} height={500} className="object-cover w-full h-full rounded-xl" src={blog.images[0].image_url} alt={blog.title} />
                    ) : null}
                </div>

                <span className="inline-flex px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full text-rose-500 bg-rose-100 mt-3">
                    {blog.category.name}
                </span>

                <p className="mt-3 text-xl font-semibold text-black line-clamp-2">{blog.title}</p>
                <p className="mt-4 text-gray-600 line-clamp-3">{blog.caption}</p>
                <div className="h-0 mt-6 mb-4 border-t-2 border-gray-200 border-dashed"></div>
                <span className="block text-sm font-bold tracking-widest text-gray-500 uppercase">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }).replace(/(\d+)(?=\s)/, (day) => {
                        const suffix = ['th', 'st', 'nd', 'rd'][(parseInt(day) % 10 > 3 || Math.floor(parseInt(day) % 100 / 10) === 1) ? 0 : parseInt(day) % 10];
                        return day + suffix;
                    })}
                </span>
            </div>
        </Link>
    </>)
}

export default BlogCard