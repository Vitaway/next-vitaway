import { Blogs } from '@/types/blogs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlogCard = React.memo(function BlogCard({ blog }: { blog: Blogs }) {
    const dateLabel = new Date(blog.created_at)
        .toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        .replace(/(\d+)(?=\s)/, (day) => {
            const suffix = ['th', 'st', 'nd', 'rd'][
                parseInt(day) % 10 > 3 || Math.floor((parseInt(day) % 100) / 10) === 1
                    ? 0
                    : parseInt(day) % 10
            ];
            return day + suffix;
        });

    return (
        <Link href={`/blogs/${blog.slug}`} className="group block">
            <div className="overflow-hidden rounded-[24px] bg-[#F6F3EE]">
                <div className="relative min-h-[220px] overflow-hidden bg-[#EEF6F4]">
                    {typeof blog.images[0] === 'object' && blog.images[0] !== null ? (
                        <Image
                            width={500}
                            height={500}
                            className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                            src={blog.images[0].image_url}
                            alt={blog.title}
                        />
                    ) : null}
                </div>
            </div>

            <span className="mt-3 inline-block max-w-full truncate rounded-full bg-[#003E48]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#003E48]">
                {blog.category.name}
            </span>

            <p className="mt-3 line-clamp-2 text-xl font-bold text-[#003E48]">{blog.title}</p>
            <p className="mt-2 line-clamp-2 text-sm text-[#003E48]/65">{blog.caption}</p>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#003E48]/50">{dateLabel}</span>
                <span className="text-sm font-semibold text-[#E85A2E] group-hover:underline">Read more</span>
            </div>
        </Link>
    );
});

export default BlogCard;
