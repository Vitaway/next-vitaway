'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscriber() {
    const [showSubscriber, setShowSubscriber] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
                if (!localStorage.getItem('subscribed') && !localStorage.getItem('closedSubscriber')) {
                    setShowSubscriber(true);
                }
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/subscribers`, {
                email,
            });

            if (response.status === 200) {
                setSuccess('Thank you for subscribing!');
                setEmail('');
                localStorage.setItem('subscribed', 'true');
                setShowSubscriber(false);
            } else {
                setError(response.data.message || 'Something went wrong. Please try again.');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Something went wrong. Please try again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowSubscriber(false);
        localStorage.setItem('closedSubscriber', 'true');
    };

    if (!showSubscriber) return null;

    return (
        <div className="fixed transition-all ease-in-out delay-150 flex items-center top-0 right-0 left-0 bottom-0 bg-gray-900/25 h-screen w-screen z-[9999]">
            <div className="flex items-center justify-center w-full h-full px-4 sm:px-8">
                <div className="relative isolate w-full max-w-3xl overflow-hidden rounded-[28px] bg-[#003E48] py-8 sm:py-12 lg:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex max-w-xl flex-col items-center justify-center text-center lg:max-w-lg">
                            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                Stay in the <span className="font-accent">loop</span>
                            </h2>
                            <p className="mt-4 text-sm text-white/80 sm:text-base">
                                Wellness tips, clinic news, and offers — when we have something worth sending.
                            </p>
                            <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md flex-col items-center justify-center gap-y-3 sm:flex-row sm:gap-x-3">
                                <label className="sr-only">Email address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-full border-0 bg-white px-4 py-3 text-sm text-[#003E48] placeholder:text-[#003E48]/40 focus:outline-none sm:flex-auto"
                                    placeholder="Enter your email"
                                />
                                <button
                                    type="submit"
                                    className="press-btn press-btn--sm w-full sm:w-auto"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Subscribe'}
                                </button>
                            </form>
                            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                            {success && <p className="mt-4 text-sm text-[#5CE0C6]">{success}</p>}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/15 p-2 sm:right-10 sm:top-10"
                    onClick={() => handleClose()}
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Subscriber;