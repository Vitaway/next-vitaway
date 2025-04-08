'use client';

import React, { useEffect, useState } from 'react';
import BlogList from './blogs-list';
import AlertMessage from '../alerts/alert-message';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isLoading, setLoading] = useState(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const res = await fetch(`http://127.0.0.1:8000/api/blogs`);

            if (!res.ok) {
                setMessage('Failed to fetch blogs. Please try again later.');
                setMessageType('error');
            }

            const data = await res.json();
            setBlogs(data.data.slice(0, 4));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setMessage('Error fetching blogs. Please try again later.');
            setMessageType('error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (<>
        <section className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Latest Blog Posts</h2>
                <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">Stay updated with our latest articles, insights, and tips to keep you informed and inspired.</p>
            </div>

            <BlogList blogs={blogs} isLoading={isLoading} />
            <AlertMessage message={message} type={messageType} />
        </section>
    </>)
}

export default Blogs