'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SocialMedias from './navbars/social-medias';
import PressButton from './buttons/press-button';
import StoreButtons from './buttons/store-buttons';
import { SITE_EMAIL, SITE_PHONE_DISPLAY } from '@/content/contact';

const linkClass =
    'flex text-base text-white/80 transition-all duration-200 hover:text-[#5CE0C6]';

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

    return (
        <section className="bg-[#003E48] pb-28 pt-14 sm:pt-16 lg:pt-20">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
                <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
                    <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Most people find out too <span className="font-accent">late</span>.
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <PressButton href="/for-individuals/health-check" size="sm">
                            Book
                        </PressButton>
                        <PressButton href="/for-organizations" size="sm" variant="secondary" surface="dark">
                            Request programme
                        </PressButton>
                        <Link
                            href="/contacts"
                            className="inline-flex items-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            Start partnership conversation
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-14 md:grid-cols-4 lg:gap-x-12">
                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Vitaway</p>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/about-us" className={linkClass}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/our-team" className={linkClass}>
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacts" className={linkClass}>
                                    Clinic
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer-support" className={linkClass}>
                                    Licence &amp; Standards
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Services</p>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/for-individuals/health-check" className={linkClass}>
                                    Consultation
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-individuals/12-week-programme" className={linkClass}>
                                    12-Week Programme
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-individuals/weight" className={linkClass}>
                                    Weight
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-individuals/blood-pressure" className={linkClass}>
                                    Blood Pressure
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-individuals/blood-sugar" className={linkClass}>
                                    Blood Sugar
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-individuals/family" className={linkClass}>
                                    Family Nutrition
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Organizations</p>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/for-organizations/companies" className={linkClass}>
                                    Companies
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-organizations/ngos" className={linkClass}>
                                    NGOs
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-organizations/schools" className={linkClass}>
                                    Schools
                                </Link>
                            </li>
                            <li>
                                <Link href="/for-organizations/embassies" className={linkClass}>
                                    Embassies
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacts" className={linkClass}>
                                    Insurers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Legal</p>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link href="/terms-and-conditions" className={linkClass}>
                                    Legal
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className={linkClass}>
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className={linkClass}>
                                    Data Protection
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-and-conditions" className={linkClass}>
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer-support" className={linkClass}>
                                    Complaints
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                    <div>
                        <p className="text-sm font-semibold tracking-widest text-white uppercase">Stay in touch</p>
                        <form onSubmit={handleSubmit} method="POST" className="mt-6 flex max-w-md items-center rounded-full bg-white pr-1.5">
                            <div className="flex-1">
                                <label className="sr-only">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    placeholder="Enter your email"
                                    className="block w-full rounded-full border-none bg-transparent p-4 text-slate-700 outline-none placeholder-gray-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex-none rounded-full bg-[#E85A2E] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d14e26] focus-visible:outline-none"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Subscribe'}
                            </button>
                        </form>
                        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                        {success && <p className="mt-4 text-sm text-green-300">{success}</p>}
                        <ul className="mt-6 space-y-2 text-sm text-white/80">
                            <li>
                                <span className="font-bold text-white">Contact:</span> {SITE_PHONE_DISPLAY}
                            </li>
                            <li>
                                <span className="font-bold text-white">Email:</span> {SITE_EMAIL}
                            </li>
                            <li>
                                <span className="font-bold text-white">Location:</span> CPR-Unit House, 1 Floor, KK21 Ave
                                Niboye, Kicukiro, Kigali
                            </li>
                        </ul>
                    </div>

                    <div className="lg:justify-self-end">
                        <SocialMedias />
                        <StoreButtons className="mt-6" />
                    </div>
                </div>

                <hr className="mb-6 mt-12 border-white/15" />

                <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/70 sm:flex-row">
                    <p>All Rights Reserved - Vitaway Health Ltd © {new Date().getFullYear()}</p>
                    <a
                        href="https://keyypress.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-[#5CE0C6]"
                    >
                        Built by Keyypress
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Footer;
