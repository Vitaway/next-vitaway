import { Blogs } from '@/types/blogs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogCard({ blog }: { blog: Blogs }) {

    return (<>
        <Link href={`/blogs/${blog.slug}`}>
            <div>
                <div className="block aspect-w-4 aspect-h-3 max-h-[250px] min-h-[250px] overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                    {typeof blog.images[0] === 'object' && blog.images[0] !== null ? (
                        <Image width={500} height={500} className="object-cover w-full h-full rounded-xl max-h-[250px] min-h-[250px]" src={blog.images[0].image_url} alt={blog.title} />
                    ) : null}
                </div>

                <span className="inline-block px-4 py-2 max-w-full truncate font-semibold tracking-widest uppercase rounded-full text-[11px] text-[#003E48] bg-[#003E48]/20 mt-3">
                    {blog.category.name}
                </span>

                <p className="mt-3 text-xl font-semibold text-black line-clamp-2">{blog.title}</p>
                <p className="mt-4 text-gray-600 line-clamp-2">{blog.caption}</p>

                <div className="h-0 my-4 border-t-2 border-gray-200 border-dashed"></div>

                <div className='flex items-center justify-between'>
                    <span className="block text-sm font-bold tracking-widest text-gray-500 capitalize">
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).replace(/(\d+)(?=\s)/, (day) => {
                            const suffix = ['th', 'st', 'nd', 'rd'][(parseInt(day) % 10 > 3 || Math.floor(parseInt(day) % 100 / 10) === 1) ? 0 : parseInt(day) % 10];
                            return day + suffix;
                        })}
                    </span>
                    <Link href={`/blogs/${blog.slug}`} className='border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-100 transition duration-300 ease-in-out'>
                        <span className='font-semibold text-slate-700 text-sm'>Read More</span>
                    </Link>
                </div>
            </div>
        </Link>
    </>)
}

export default BlogCard