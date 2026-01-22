'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/app/components/headers/page-header';
import Loading from '@/app/components/loading';
import { quizApi } from '@/lib/quiz-api';
import { Quiz, Question, QuizAttempt } from '@/types/quizzes';
import GuestLayout from '@/app/layouts/GuestLayout';

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    useEffect(() => {
        initializeQuiz();
    }, [quizId]);

    const initializeQuiz = async () => {
        try {
            setLoading(true);
            
            // Fetch quiz details
            const quizData = await quizApi.getQuizById(quizId);
            console.log('Quiz data:', quizData);
            setQuiz(quizData);
            
            if (quizData.questions) {
                setQuestions(quizData.questions);
            }
            
            // Try to start quiz attempt, but don't fail if endpoint doesn't exist
            try {
                const attemptData = await quizApi.startQuizAttempt(quizId);
                console.log('Attempt data:', attemptData);
                setAttempt(attemptData);
            } catch (attemptErr) {
                console.warn('Could not start attempt:', attemptErr);
                // Create a mock attempt for now
                setAttempt({
                    id: Date.now(),
                    quiz_id: Number(quizId),
                    started_at: new Date().toISOString(),
                    status: 'in_progress'
                });
            }
            
            setStartTime(new Date());
            setError(null);
        } catch (err) {
            console.error('Quiz initialization error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: number, answerIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!attempt) {
            setError('No active quiz attempt found');
            return;
        }

        try {
            setSubmitting(true);
            
            const response = await quizApi.submitQuizAttempt(quizId, attempt.id, {
                answers: selectedAnswers
            });

            setScore(response.score);
            setQuizCompleted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/assessments')}
                        className="px-6 py-2 bg-[#003E48] text-white rounded-md hover:bg-[#002a31]"
                    >
                        Back to Assessments
                    </button>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Quiz not found</p>
            </div>
        );
    }

    if (quizCompleted && score !== null) {
        return (
            <GuestLayout>
                <PageHeader
                    sub_title="For Individuals"
                    title="Quiz Completed!"
                    description={`You've completed ${quiz.title}`}
                />

                <section className="py-12 bg-gray-50">
                    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-3xl">
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                                score >= 80 ? 'bg-green-100' :
                                score >= 60 ? 'bg-yellow-100' :
                                'bg-red-100'
                            }`}>
                                <span className={`text-3xl font-bold ${
                                    score >= 80 ? 'text-green-600' :
                                    score >= 60 ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                    {score}%
                                </span>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {score >= 80 ? 'Excellent Work!' :
                                 score >= 60 ? 'Good Job!' :
                                 'Keep Practicing!'}
                            </h2>
                            
                            <p className="text-gray-600 mb-8">
                                You answered {Math.round((score / 100) * questions.length)} out of {questions.length} questions correctly.
                            </p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/assessments')}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                                >
                                    Back to Assessments
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-[#003E48] text-white rounded-md hover:bg-[#002a31] font-medium"
                                >
                                    Retake Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </GuestLayout>
        );
    }

    const currentQuestionData = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <GuestLayout>
            <PageHeader
                sub_title="For Individuals"
                title={quiz.title}
                description={quiz.description}
            />

            <section className="py-12 bg-gray-50">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-4xl">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#003E48] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    {questions.length > 0 && currentQuestionData && (
                        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                {currentQuestionData.question}
                            </h3>

                            <div className="space-y-3">
                                {currentQuestionData.options?.map((option, index) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswerSelect(currentQuestionData.id, option.id)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                            selectedAnswers[currentQuestionData.id] === option.id
                                                ? 'border-[#003E48] bg-[#003E48]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                selectedAnswers[currentQuestionData.id] === option.id
                                                    ? 'border-[#003E48] bg-[#003E48]'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedAnswers[currentQuestionData.id] === option.id && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <span className="text-gray-800">{option.option_text}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestion === 0}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Previous
                        </button>

                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={submitting || Object.keys(selectedAnswers).length !== questions.length}
                                className="px-6 py-3 bg-[#003E48] text-white rounded-md hover:bg-[#002a31] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className="px-6 py-3 bg-[#003E48] text-white rounded-md hover:bg-[#002a31] font-medium"
                            >
                                Next
                            </button>
                        )}
                    </div>

                    {/* Answered Questions Indicator */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Answered: {Object.keys(selectedAnswers).length} / {questions.length}
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
