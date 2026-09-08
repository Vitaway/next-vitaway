'use client';

import React, { useState, useEffect } from 'react';
import { useContact } from '@/hooks';
import { ButtonSpinner } from '@/app/components/spinners';
import PressButton from '@/app/components/buttons/press-button';

const inputClass =
    'w-full h-12 px-4 font-normal transition duration-200 bg-[#F6F3EE] border border-transparent rounded-2xl appearance-none text-[#003E48] placeholder:text-[#003E48]/40 focus:border-[#003E48] focus:bg-white focus:outline-none';

function ContactForm() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const { submitting, success, error, submitContact, reset } = useContact();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = { fullname, email, message };
        const isSuccess = await submitContact(payload);

        if (isSuccess) {
            setFullname('');
            setEmail('');
            setMessage('');
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                reset();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, reset]);

    return (
        <div className="relative rounded-[28px] bg-white p-7 text-[#003E48] sm:p-10">
            <h3 className="mb-6 text-xl font-bold sm:text-center sm:text-2xl">
                Connect with <span className="font-accent">Vitaway</span>
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="fullname" className="mb-1.5 inline-block text-sm font-medium">
                        Full name
                    </label>
                    <input
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="Your full name"
                        type="text"
                        className={inputClass}
                        id="fullname"
                        name="fullname"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="mb-1.5 inline-block text-sm font-medium">
                        Email
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@example.org"
                        type="email"
                        className={inputClass}
                        id="email"
                        name="email"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="mb-1.5 inline-block text-sm font-medium">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="h-28 w-full rounded-2xl border border-transparent bg-[#F6F3EE] px-4 py-3 font-normal text-[#003E48] placeholder:text-[#003E48]/40 transition duration-200 focus:border-[#003E48] focus:bg-white focus:outline-none"
                        required
                    />
                </div>
                <div className="mt-5">
                    <PressButton type="submit" className="w-full" disabled={submitting}>
                        {submitting ? <ButtonSpinner loadingText="Sending" /> : 'Send message'}
                    </PressButton>
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                {success && <p className="mt-3 text-sm text-[#003E48]">{success}</p>}

                <p className="mt-4 text-xs text-[#003E48]/55 sm:text-sm">We respect your privacy.</p>
            </form>
        </div>
    );
}

export default ContactForm;
