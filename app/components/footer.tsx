'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SocialMedias from './navbars/social-medias';
import PressButton from './buttons/press-button';
import { useBooking } from './booking/booking-context';
import StoreButtons from './buttons/store-buttons';

function Footer() {
    const { openPrereg } = useBooking();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
        <section className="bg-[#003E48] pb-28 pt-14 sm:pt-16 lg:pt-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
                <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
                    <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Most people find out too <span className="font-accent">late</span>.
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/contacts" className="inline-flex items-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-[1.5px] text-white hover:bg-white/10">
                            WhatsApp us
                        </Link>
                        <PressButton href="/appointments" size="sm">
                            Book a health check
                        </PressButton>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:col-span-3 lg:grid-cols-6">
                    <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
                        <Link href="/" className="text-white font-serif font-semibold text-3xl">
                            Vitaway
                        </Link>
                        
                        <p className="mt-5 text-sm leading-relaxed text-white/70">Digital healthcare for Rwanda. Nutrition, NCD prevention, virtual consults.</p>
                        
                        <div className="mt-8">
                            <SocialMedias />
                        </div>
                        <StoreButtons className="mt-6" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Company</p>

                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/about-us" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> About </Link>
                            </li>
                            <li>
                                <Link href="/our-team" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Our Team </Link>
                            </li>
                            <li>
                                <Link href="/pricing" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Our Pricings </Link>
                            </li>

                            <li>
                                <Link href="/blogs" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> All Blogs </Link>
                            </li>
                            
                            <li>
                                <Link href="/contacts" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Contact us </Link>
                            </li>

                            <li>
                                <Link href="/appointments" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Book Appointment </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pre-registration"
                                    title=""
                                    className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"
                                    onClick={(event) => {
                                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                                        event.preventDefault();
                                        openPrereg();
                                    }}
                                >
                                    Pre-register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Help</p>

                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/customer-support" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Ethics & Compliance </Link>
                            </li>

                            <li>
                                <Link href="/assessments" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Assessments </Link>
                            </li>

                            <li>
                                <Link href="/terms-and-conditions" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Terms & Conditions </Link>
                            </li>

                            <li>
                                <Link href="/privacy-policy" title="" className="flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]"> Privacy Policy </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Subscribe to newsletter</p>

                        <form onSubmit={handleSubmit} method="POST" className="mt-6 flex items-center bg-white rounded-full pr-1.5">
                            <div className="flex-1">
                                <label className="sr-only">Email</label>
                                <input type="email" name="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter your email" className="block w-full p-4 text-slate-700 placeholder-gray-500 border-none outline-none bg-transparent rounded-full" />
                            </div>

                            <button
                                type="submit"
                                className="flex-none rounded-full bg-[#E85A2E] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d14e26] focus-visible:outline-none"
                                disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Subscribe Now'}
                            </button>                        
                        </form>

                        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                        {success && <p className="mt-4 text-sm text-green-300">{success}</p>}

                        <ul className="mt-6 space-y-2 text-white/80 text-sm border-t pt-5 border-white/15">
                            <li><span><span className='font-bold text-white'>Contact:</span> +250 795 767 405 /+250 787 279 560 </span></li>
                            <li><span><span className='font-bold text-white'>Email:</span> vitawayeclinic@gmail.com</span></li>
                            <li><span><span className='font-bold text-white'>Location:</span> CPR-Unit House, 1 Floor,  KK21 Ave Niboye, Kicukiro, Kigali</span></li>
                        </ul>
                    </div>
                </div>

                <hr className="mt-12 mb-6 border-white/15" />

                <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/70 sm:flex-row">
                    <p>All Rights Reserved - Vitaway Health Ltd © {new Date().getFullYear()}</p>
                    <a
                        href="https://keyypress.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-[#5CE0C6]"
                    >
                        Built by KEYYPRESS
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Footer
