'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/headers/page-header';
import Loading from '../components/loading';
import { quizApi } from '@/lib/quiz-api';
import { Quiz } from '@/types/quizzes';
import GuestLayout from '../layouts/GuestLayout';
import SectionCard from '../components/sections/section-card';
import PressButton from '../components/buttons/press-button';

const inputClass =
    'w-full h-12 px-4 font-normal transition duration-200 bg-[#F6F3EE] border border-transparent rounded-2xl appearance-none text-[#003E48] placeholder:text-[#003E48]/40 focus:border-[#003E48] focus:bg-white focus:outline-none';

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
                title={
                    <>
                        Assessments & <span className="font-accent">quizzes</span>
                    </>
                }
                description="Test your knowledge and track your progress with our interactive quizzes"
            />

            <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    {error && (
                        <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 p-4">
                            <p className="text-sm text-red-600 sm:text-base">{error}</p>
                        </div>
                    )}

                    {/* Search and Filter Section */}
                    <div className="mb-8 rounded-[24px] bg-white p-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg className="h-5 w-5 text-[#003E48]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search quizzes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`${inputClass} pl-11 pr-12`}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 touch-manipulation"
                                        aria-label="Clear search"
                                    >
                                        <svg className="h-5 w-5 text-[#003E48]/40 hover:text-[#003E48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    className={`${inputClass} cursor-pointer pr-10`}
                                >
                                    <option value="all">All Durations</option>
                                    <option value="short">Short (≤ 10 min)</option>
                                    <option value="medium">Medium (11-30 min)</option>
                                    <option value="long">Long (&gt; 30 min)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-5 w-5 text-[#003E48]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 flex flex-col items-start justify-between gap-2 text-xs text-[#003E48]/60 sm:flex-row sm:items-center sm:text-sm">
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
                                    className="whitespace-nowrap text-sm font-medium text-[#E85A2E] touch-manipulation hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quizzes Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 md:gap-6">
                        {!loading && filteredQuizzes.length === 0 ? (
                            <div className="col-span-full rounded-[24px] bg-white px-4 py-12 text-center">
                                <svg className="mx-auto mb-4 h-16 w-16 text-[#003E48]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mb-2 text-base text-[#003E48]/60 sm:text-lg">
                                    {searchTerm || filterDuration !== 'all' ? 'No quizzes match your filters' : 'No quizzes available at the moment'}
                                </p>
                                {(searchTerm || filterDuration !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterDuration('all');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-[#E85A2E] touch-manipulation hover:underline sm:text-base"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            paginatedQuizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="overflow-hidden rounded-[24px] bg-white"
                                >
                                    <div className="p-5 sm:p-6">
                                        <h3 className="mb-2 text-lg font-bold text-[#003E48] sm:text-xl">
                                            {quiz.title}
                                        </h3>
                                        <p className="mb-4 line-clamp-2 text-sm text-[#003E48]/65 sm:line-clamp-3 sm:text-base">
                                            {quiz.description}
                                        </p>

                                        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#003E48]/50 sm:gap-4 sm:text-sm">
                                            {quiz.questions_count && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    {quiz.questions_count} questions
                                                </span>
                                            )}
                                            {quiz.duration && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {quiz.duration} min
                                                </span>
                                            )}
                                        </div>

                                        <PressButton href={`/assessments/${quiz.id}`} className="w-full" size="sm">
                                            Start Quiz
                                        </PressButton>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors touch-manipulation sm:text-base ${
                                    currentPage === 1
                                        ? 'cursor-not-allowed bg-white text-[#003E48]/35'
                                        : 'bg-white text-[#003E48] hover:bg-[#003E48] hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                className={`h-10 w-10 rounded-full text-sm font-medium transition-colors touch-manipulation sm:text-base ${
                                                    currentPage === page
                                                        ? 'bg-[#003E48] text-white'
                                                        : 'bg-white text-[#003E48] hover:bg-[#003E48]/10'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="px-1 text-sm text-[#003E48]/40 sm:text-base">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors touch-manipulation sm:text-base ${
                                    currentPage === totalPages
                                        ? 'cursor-not-allowed bg-white text-[#003E48]/35'
                                        : 'bg-white text-[#003E48] hover:bg-[#003E48] hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="hidden xs:inline sm:inline">Next</span>
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </SectionCard>
        </GuestLayout>
    );
}
