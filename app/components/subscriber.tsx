'use client';

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/subscribers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccess('Thank you for subscribing!');
                setEmail('');
                localStorage.setItem('subscribed', 'true');
                setShowSubscriber(false);
            } else {
                const data = await response.json();
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
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
                <div className="relative isolate rounded-xl w-full max-w-3xl overflow-hidden bg-gray-900 py-8 sm:py-12 lg:py-16 flex items-center justify-between">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-xl lg:max-w-lg flex items-center justify-center text-center flex-col">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                                Subscribe to Our Newsletter.
                            </h2>
                            <p className="mt-4 text-sm sm:text-md lg:text-lg text-gray-300">
                                Get exclusive wellness tips, expert insights, special offers & unlock a healthier you!
                                Start your journey to vitality now by subscribing to Vitaway&apos;s newsletter.
                            </p>
                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center justify-center max-w-md gap-y-4 sm:gap-x-4">
                                <label className="sr-only">Email address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full sm:flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    placeholder="Enter your email"
                                />
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto rounded-md bg-[#3268b9] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-none"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Subscribe'}
                                </button>
                            </form>
                            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                            {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
                        </div>
                    </div>
                    <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
                        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#07f394] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                </div>
                <div className="rounded-md absolute top-4 right-4 sm:top-10 sm:right-10 bg-white/50 cursor-pointer p-2 ring-1 ring-white/10" onClick={() => handleClose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Subscriber;