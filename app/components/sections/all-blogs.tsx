/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useMemo } from 'react';
import BlogList from './blogs-list';
import { useBlogs } from '@/hooks';

const AllBlogs = React.memo(function AllBlogs() {
    const { blogs, loading, error } = useBlogs();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    // Get unique categories
    const categories = useMemo(() => {
        if (!blogs || blogs.length === 0) return ['All'];
        const uniqueCategories = Array.from(new Set(blogs.map(blog => blog.category.name)));
        return ['All', ...uniqueCategories];
    }, [blogs]);

    // Filter and sort blogs
    const filteredBlogs = useMemo(() => {
        if (!blogs || blogs.length === 0) return [];

        let filtered = blogs;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(blog => blog.category.name === selectedCategory);
        }

        // Sort blogs
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else {
                return a.title.localeCompare(b.title);
            }
        });

        return sorted;
    }, [blogs, searchQuery, selectedCategory, sortBy]);

    return (
        <>
            {/* Search and Filter Section */}
            <div className="mt-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search blogs by title, content, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 outline-0 focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-semibold text-gray-700 mr-2">Category:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${selectedCategory === category
                                        ? 'bg-gradient-to-b from-[#003E48] to-[#282e33] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Showing <strong>{filteredBlogs.length}</strong> of <strong>{blogs.length}</strong> blogs
                    </span>
                    {(searchQuery || selectedCategory !== 'All') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>

            <BlogList blogs={filteredBlogs} isLoading={loading} />
        </>
    );
});

export default AllBlogs;