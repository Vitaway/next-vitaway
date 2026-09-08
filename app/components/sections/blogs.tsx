'use client';

import React from 'react';
import BlogList from './blogs-list';
import AlertMessage from '../alerts/alert-message';
import { useBlogs } from '@/hooks';
import SectionCard from './section-card';
import Link from 'next/link';

const Blogs = React.memo(function Blogs() {
    const { blogs, loading, error } = useBlogs({ limit: 4 });

    return (
        <SectionCard className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                            What we write between <span className="font-accent">visits</span>
                        </h2>
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#003E48]/70 sm:text-base">
                            Food, conditions, and care you can use — from the nutritionists between appointments.
                        </p>
                    </div>
                    <Link href="/blogs" className="text-sm font-semibold text-[#E85A2E] hover:underline">
                        Read more stories →
                    </Link>
                </div>

                <BlogList blogs={blogs} isLoading={loading} />
                {error && <AlertMessage message={error} type="error" />}
            </div>
        </SectionCard>
    );
});

export default Blogs;
