'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/app/components/headers/page-header';
import Loading from '@/app/components/loading';
import { quizApi } from '@/lib/quiz-api';
import { Quiz, Question, QuizAttempt, AnswerCheckResponse } from '@/types/quizzes';
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
    const [answerFeedback, setAnswerFeedback] = useState<Record<number, AnswerCheckResponse>>({});
    const [checkingAnswer, setCheckingAnswer] = useState(false);

    // Social media share functions
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = quiz ? `Check out this quiz: "${quiz.title}" on Vitaway Health! Test your knowledge!` : '';

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
        };

        const url = shareUrls[platform as keyof typeof shareUrls];
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const initializeQuiz = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch quiz details
            const quizData = await quizApi.getQuizById(quizId);
            console.log('Quiz data:', quizData);
            setQuiz(quizData);

            if (quizData.questions) {
                setQuestions(quizData.questions);
            }

            // Try to start quiz attempt (optional - only needed for final submission)
            try {
                const attemptData = await quizApi.startQuizAttempt(quizId);
                console.log('Attempt data:', attemptData);
                setAttempt(attemptData);
            } catch (attemptErr) {
                console.warn('Could not start attempt - using instant feedback mode:', attemptErr);
                // No attempt needed for instant feedback mode
                setAttempt(null);
            }

            setError(null);
        } catch (err) {
            console.error('Quiz initialization error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        initializeQuiz();
    }, [initializeQuiz]);

    const handleAnswerSelect = async (questionId: number, answerIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));

        // Check answer immediately
        try {
            setCheckingAnswer(true);
            const feedback = await quizApi.checkAnswer(quizId, {
                question_id: questionId,
                option_id: answerIndex,
            });
            
            setAnswerFeedback(prev => ({
                ...prev,
                [questionId]: feedback
            }));
        } catch (err) {
            console.error('Error checking answer:', err);
            // Silently fail - don't show error to user for answer checking
        } finally {
            setCheckingAnswer(false);
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            setSubmitting(true);

            // If we have an attempt, use the traditional submit endpoint
            if (attempt) {
                // Transform answers from object to array format
                const answersArray = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
                    question_id: Number(questionId),
                    option_id: optionId
                }));

                const response = await quizApi.submitQuizAttempt(quizId, attempt.id, {
                    answers: answersArray
                });
                setScore(response.score);
            } else {
                // Calculate score from instant feedback
                const totalPoints = Object.values(answerFeedback).reduce(
                    (sum, feedback) => sum + (feedback?.question?.points || 0),
                    0
                );
                const earnedPoints = Object.values(answerFeedback).reduce(
                    (sum, feedback) => sum + (feedback?.points_earned || 0),
                    0
                );
                const calculatedScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
                setScore(calculatedScore);
            }

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
                    sup_title="For Individuals"
                    title="Quiz Completed!"
                    description={`You've completed ${quiz.title}`}
                />

                <section className="py-12 bg-gray-50">
                    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-3xl">
                        <div className="bg-white rounded-lg p-8 text-center">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${score >= 80 ? 'bg-green-100' :
                                    score >= 60 ? 'bg-yellow-100' :
                                        'bg-red-100'
                                }`}>
                                <span className={`text-3xl font-bold ${score >= 80 ? 'text-green-600' :
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
                sup_title="For Individuals"
                title={quiz.title}
                description={quiz.description}
            />

            <section className="py-12 bg-gray-50">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-4xl">
                    {/* Social Share Buttons */}
                    <div className="mb-6 flex justify-end">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#166FE5] transition-colors"
                                title="Share on Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                title="Share on X (Twitter)"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-[#095196] transition-colors"
                                title="Share on LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="p-2 bg-[#25D366] text-white rounded-full hover:bg-[#20BA5A] transition-colors"
                                title="Share on WhatsApp"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                                title="Copy Link"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

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
                        <div className="bg-white rounded-lg p-8 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                {currentQuestionData.question}
                            </h3>

                            <div className="space-y-3">
                                {currentQuestionData.options?.map((option) => {
                                    const isSelected = selectedAnswers[currentQuestionData.id] === option.id;
                                    const feedback = answerFeedback[currentQuestionData.id];
                                    const isCorrectAnswer = feedback?.correct_answer?.id === option.id;
                                    
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswerSelect(currentQuestionData.id, option.id)}
                                            disabled={checkingAnswer || !!feedback}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                                feedback
                                                    ? isCorrectAnswer
                                                        ? 'border-green-500 bg-green-50'
                                                        : isSelected
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200'
                                                    : isSelected
                                                        ? 'border-[#003E48] bg-[#003E48]/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                            } ${feedback ? 'cursor-default' : ''}`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                    feedback
                                                        ? isCorrectAnswer
                                                            ? 'border-green-500 bg-green-500'
                                                            : isSelected
                                                                ? 'border-red-500 bg-red-500'
                                                                : 'border-gray-300'
                                                        : isSelected
                                                            ? 'border-[#003E48] bg-[#003E48]'
                                                            : 'border-gray-300'
                                                }`}>
                                                    {feedback ? (
                                                        isCorrectAnswer ? (
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : isSelected ? (
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : null
                                                    ) : isSelected ? (
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    ) : null}
                                                </div>
                                                <span className={feedback && isCorrectAnswer ? 'text-green-700 font-medium' : 'text-gray-800'}>
                                                    {option.option_text}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Answer Feedback */}
                            {answerFeedback[currentQuestionData.id] && (
                                <div className={`mt-4 p-4 rounded-lg ${
                                    answerFeedback[currentQuestionData.id].is_correct
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-red-50 border border-red-200'
                                }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                            answerFeedback[currentQuestionData.id].is_correct
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}>
                                            {answerFeedback[currentQuestionData.id].is_correct ? (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-semibold mb-1 ${
                                                answerFeedback[currentQuestionData.id].is_correct
                                                    ? 'text-green-800'
                                                    : 'text-red-800'
                                            }`}>
                                                {answerFeedback[currentQuestionData.id].is_correct
                                                    ? '✓ Correct!'
                                                    : '✗ Incorrect'}
                                            </h4>
                                            {answerFeedback[currentQuestionData.id].explanation && (
                                                <p className="text-sm text-gray-700 mt-2">
                                                    {answerFeedback[currentQuestionData.id].explanation}
                                                </p>
                                            )}
                                            <p className="text-sm mt-2 font-medium text-gray-800">
                                                Points earned: {answerFeedback[currentQuestionData.id].points_earned} / {answerFeedback[currentQuestionData.id].question.points}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
