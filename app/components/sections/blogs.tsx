'use client';

import React from 'react';
import BlogList from './blogs-list';
import AlertMessage from '../alerts/alert-message';
import { useBlogs } from '@/hooks';

const Blogs = React.memo(function Blogs() {
    const { blogs, loading, error } = useBlogs({ limit: 4 });

    return (<>
        <section className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Latest Blog Posts</h2>
                <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">Stay updated with our latest articles, insights, and tips to keep you informed and inspired.</p>
            </div>

            <BlogList blogs={blogs} isLoading={loading} />
            {error && <AlertMessage message={error} type="error" />}
        </section>
    </>)
});

export default Blogs