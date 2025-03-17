'use client';

import React, { useEffect, useState } from 'react'
import BlogList from './blogs-list'

function AllBlogs() {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        const res = await fetch(`/api/blogs`);
        res.json().then((data) => setBlogs(data));
    }

    useEffect(() => {
        fetchBlogs();
    }, []);
    
    return (<>
        <BlogList blogs={blogs} />
    </>)
}

export default AllBlogs