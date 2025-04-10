'use client';

import React, { useEffect, useState } from 'react';
import BlogList from './blogs-list';
import AlertMessage from '../alerts/alert-message';

function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isLoading, setLoading] = useState(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${process.env.NEXT_ENVENTORY_API_URL}/api/blogs`);

            if (!res.ok) {
                setMessage('Failed to fetch blogs. Please try again later.');
                setMessageType('error');
            }

            const data = await res.json();
            setBlogs(data.data);
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

    return (
        <>
            <BlogList blogs={blogs} isLoading={isLoading} />
            <AlertMessage message={message} type={messageType} />
        </>
    );
}

export default AllBlogs;