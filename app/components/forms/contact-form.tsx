'use client';

import React, { useState } from 'react';

function ContactForm() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, message }),
            });

            if (response.ok) {
                setSuccess('Message sent successfully');
                setFullname('');
                setEmail('');
                setMessage('');
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

    return (
        <div className="relative bg-white rounded-xl shadow-2xl p-7 sm:p-10 text-slate-700">
            <h3 className="mb-4 text-xl font-normal sm:text-center sm:mb-6 sm:text-2xl">
                Connect With Vitaway
            </h3>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Fullname</label>
                        <input
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Use Fullname"
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            id="fullname"
                            name="fullname"
                            required
                        />
                    </div>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">E-mail</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john.doe@example.org"
                            type="email"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            required
                        />
                    </div>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a Message..."
                            className="flex-grow w-full h-14 px-4 py-3 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            required
                        ></textarea>
                    </div>
                    <div className="mt-4 mb-2 sm:mb-4">
                        <button
                            type="submit"
                            className="relative cursor-pointer inline-flex items-center justify-center w-full h-12 px-6 font-normal tracking-wide text-white transition duration-200 rounded bg-indigo-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Contact'}
                        </button>
                    </div>

                    {error && <p className="text-xs text-red-500 sm:text-sm font-normal">{error}</p>}
                    {success && <p className="text-xs text-green-500 sm:text-sm font-normal">{success}</p>}

                    <p className="text-xs text-gray-600 sm:text-sm font-normal">
                        We respect your privacy. <span className="text-green-600"></span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;