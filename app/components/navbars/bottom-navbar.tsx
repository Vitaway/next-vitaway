'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MemberIcon } from '../icons/omada-icons';

function BottomNavbar() {
    const pathname = usePathname();

    const linkClass = (href: string) =>
        `text-[14px] font-normal text-white/90 hover:text-white transition-colors ${pathname === href ? 'text-white' : ''}`;

    return (
        <header className="hidden lg:block bg-[#003E48] relative z-10">
            <div className="flex items-center justify-between h-[52px] px-6 mx-auto max-w-[1440px] lg:px-10">
                <nav className="flex items-center gap-8">
                    <Link href="/for-individuals" className={linkClass('/for-individuals')}>How We Can Help</Link>
                    <Link href="/success-stories" className={linkClass('/success-stories')}>Success Stories</Link>
                    <Link href="/about-us" className={linkClass('/about-us')}>Who We Are</Link>
                    <Link href="/faqs" className={linkClass('/faqs')}>FAQs</Link>
                    <Link href="/contacts" className={linkClass('/contacts')}>Support</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/download" className="flex items-center gap-2 text-[14px] text-white hover:text-white/90">
                        <MemberIcon className="h-[22px] w-[22px] text-white" />
                        Download
                    </Link>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-5 py-[7px] text-[14px] font-medium text-white bg-[#E85A2E] hover:bg-[#d14e26] rounded-full transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default BottomNavbar
