'use client';

import React, { useState, useEffect } from 'react';
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

            <section className="py-12 bg-gray-50">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Quizzes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!loading && Array.isArray(quizzes) && quizzes.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No quizzes available at the moment.</p>
                            </div>
                        ) : (
                            Array.isArray(quizzes) && quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {quiz.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
                                                className="flex-1 px-4 py-2 bg-[#003E48] text-white text-center rounded-md hover:bg-[#002a31] transition-colors duration-200 font-medium"
                                            >
                                                Start Quiz
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
