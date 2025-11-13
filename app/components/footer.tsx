'use client';

import React, { useState } from 'react';
import BackgroundBlurImage from './design/background-blur-image';
import Link from 'next/link';
import SocialMedias from './navbars/social-medias';

function Footer() {
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

    return (<>
        <section className="pt-10 pb-5 sm:pt-16 lg:pt-24 relative border-t border-gray-200 bg-gradient-to-b from-[#003E48] to-[#282e33]">
            <div className="z-10 absolute left-1/2 top-0 aspect-[1204/394] w-full max-w-[1204px] -translate-x-1/2 opacity-35">
                <BackgroundBlurImage />
            </div>

            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl z-10 relative">
                <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
                    <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
                        <Link href="/" className="text-white font-bold text-4xl sm:text-3xl md:text-4xl">
                            Vitaway
                        </Link>
                        
                        <p className="text-base leading-relaxed text-gray-200 mt-7">Empowering Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.</p>
                        
                        <div className='mt-10'>
                            <SocialMedias />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Company</p>

                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/about-us" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> About </Link>
                            </li>
                            <li>
                                <Link href="/our-team" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Our Team </Link>
                            </li>
                            <li>
                                <Link href="/pricing" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Our Pricings </Link>
                            </li>

                            <li>
                                <Link href="/blogs" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> All Blogs </Link>
                            </li>
                            
                            <li>
                                <Link href="/contacts" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Contact us </Link>
                            </li>

                            <li>
                                <Link href="/appointments" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Book Appointment </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Help</p>

                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/customer-support" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Ethics & Compliance </Link>
                            </li>

                            <li>
                                <Link href="/terms-and-conditions" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Terms & Conditions </Link>
                            </li>

                            <li>
                                <Link href="/privacy-policy" title="" className="flex text-base text-gray-200 transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Privacy Policy </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Subscribe to newsletter</p>

                        <form onSubmit={handleSubmit} method="POST" className="mt-6 flex items-center transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600 pr-2">
                            <div>
                                <label className="sr-only">Email</label>
                                <input type="email" name="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter your email" className="block w-full p-4 text-slate-700 placeholder-gray-500 border-none outline-none" />
                            </div>

                            <button
                                type="submit"
                                className="flex-none rounded-md bg-[#003E48] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-none"
                                disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Subscribe Now'}
                            </button>                        
                        </form>

                        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-4 text-sm text-green-500">{success}</p>}

                        <ul className="mt-6 space-y-2 text-gray-200 text-sm border-t pt-5 border-gray-200">
                            <li><span><span className='font-bold'>Contact:</span> +250 795 767 405 /+250 787 279 560 </span></li>
                            <li><span><span className='font-bold'>Email:</span> vitawayeclinic@gmail.com</span></li>
                            <li><span><span className='font-bold'>Location:</span> CPR-Unit House, 1 Floor,  KK21 Ave Niboye, Kicukiro, Kigali</span></li>
                        </ul>
                    </div>
                </div>

                <hr className="mt-10 mb-5 border-gray-300" />

                <p className="text-sm text-center text-gray-200 font-semibold">© Copyright 2025, All Rights Reserved by Vitaway</p>
            </div>
        </section>
    </>)
}

export default Footer