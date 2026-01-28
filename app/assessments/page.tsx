'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '../components/headers/page-header';
import Loading from '../components/loading';
import { quizApi } from '@/lib/quiz-api';
import { Quiz } from '@/types/quizzes';
import GuestLayout from '../layouts/GuestLayout';

export default function AssessmentsPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Search, filter and pagination states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDuration, setFilterDuration] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const data = await quizApi.getAllQuizzes();
            // Ensure data is an array
            setQuizzes(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setQuizzes([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    const filteredQuizzes = useMemo(() => {
        let filtered = [...quizzes];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Duration filter
        if (filterDuration !== 'all') {
            filtered = filtered.filter(quiz => {
                const duration = quiz.duration || 0;
                switch (filterDuration) {
                    case 'short':
                        return duration <= 10;
                    case 'medium':
                        return duration > 10 && duration <= 30;
                    case 'long':
                        return duration > 30;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [quizzes, searchTerm, filterDuration]);

    // Pagination logic
    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const paginatedQuizzes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredQuizzes.slice(startIndex, endIndex);
    }, [filteredQuizzes, currentPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterDuration]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <GuestLayout>
            <PageHeader
                sup_title='For Individuals'
                title="Assessments & Quizzes"
                description="Test your knowledge and track your progress with our interactive quizzes"
            />

            <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
                <div className="px-3 sm:px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    {error && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm sm:text-base text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Search and Filter Section */}
                    <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search quizzes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003E48] focus:border-transparent outline-none transition-all text-gray-800"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 touch-manipulation"
                                        aria-label="Clear search"
                                    >
                                        <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Duration Filter */}
                            <div className="relative">
                                <select
                                    value={filterDuration}
                                    onChange={(e) => setFilterDuration(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 text-gray-800 focus:ring-[#003E48] focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                                >
                                    <option value="all">All Durations</option>
                                    <option value="short">Short (≤ 10 min)</option>
                                    <option value="medium">Medium (11-30 min)</option>
                                    <option value="long">Long (&gt; 30 min)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600">
                            <p className="flex-1">
                                Showing {paginatedQuizzes.length} of {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
                                <span className="hidden sm:inline">{(searchTerm || filterDuration !== 'all') && ` (filtered from ${quizzes.length} total)`}</span>
                            </p>
                            {(searchTerm || filterDuration !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterDuration('all');
                                    }}
                                    className="text-[#003E48] hover:underline font-medium text-sm whitespace-nowrap touch-manipulation"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quizzes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {!loading && filteredQuizzes.length === 0 ? (
                            <div className="col-span-full text-center py-8 sm:py-12 px-4">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-500 text-base sm:text-lg mb-2">
                                    {searchTerm || filterDuration !== 'all' ? 'No quizzes match your filters' : 'No quizzes available at the moment'}
                                </p>
                                {(searchTerm || filterDuration !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterDuration('all');
                                        }}
                                        className="text-[#003E48] hover:underline font-medium text-sm sm:text-base touch-manipulation px-4 py-2"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            paginatedQuizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                >
                                    <div className="p-4 sm:p-5 md:p-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                                            {quiz.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
                                            {quiz.questions_count && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    {quiz.questions_count} questions
                                                </span>
                                            )}
                                            {quiz.duration && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {quiz.duration} min
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <Link
                                                href={`/assessments/${quiz.id}`}
                                                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-[#003E48] text-white text-center rounded-md hover:bg-[#002a31] active:bg-[#001a1f] transition-colors duration-200 font-medium touch-manipulation"
                                            >
                                                Start Quiz
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg font-medium transition-colors touch-manipulation ${
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#003E48] border border-[#003E48] hover:bg-[#003E48] hover:text-white active:bg-[#002a31]'
                                }`}
                            >
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="hidden xs:inline sm:inline">Previous</span>
                                    <span className="xs:hidden sm:hidden">Prev</span>
                                </span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg font-medium transition-colors touch-manipulation ${
                                                    currentPage === page
                                                        ? 'bg-[#003E48] text-white'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#003E48] hover:text-[#003E48] active:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="text-gray-400 text-sm sm:text-base px-1">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg font-medium transition-colors touch-manipulation ${
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#003E48] border border-[#003E48] hover:bg-[#003E48] hover:text-white active:bg-[#002a31]'
                                }`}
                            >
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="hidden xs:inline sm:inline">Next</span>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}
