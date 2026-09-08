'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './logo';
import ShoppingCart from '@/app/shop/shopping-cart';
import PressButton from './buttons/press-button';
import PreRegisterButton from './booking/pre-register-button';
import { GroupIcon, PersonIcon, ShopIcon } from './icons/omada-icons';
import { useBooking } from './booking/booking-context';
import { CalendarDays } from 'lucide-react';

const bottomLinks = [
    {
        href: '/pricing',
        label: 'How We Can Help',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
        ),
    },
    {
        href: '/blogs',
        label: 'Success Stories',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 4h16v12H7l-3 3V4z" />
            </svg>
        ),
    },
    {
        href: '/about-us',
        label: 'Who We Are',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
            </svg>
        ),
    },
    {
        href: '/faqs',
        label: 'FAQs',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17h-2v-2h2zm1.07-7.75-.9.92A1.8 1.8 0 0 0 12.5 14h-1v-.5a2.7 2.7 0 0 1 .79-1.92l1.24-1.26A1.5 1.5 0 1 0 11 9H9.5A3 3 0 1 1 14.07 11.25z" />
            </svg>
        ),
    },
    {
        href: '/contacts',
        label: 'Support',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-6H5v-1a7 7 0 0 1 14 0v1h-2v6h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9z" />
            </svg>
        ),
    },
];

function NavCaret() {
    return (
        <svg
            className="pointer-events-none absolute bottom-0 left-1/2 z-30 -translate-x-1/2 text-[#003E48]"
            width="16"
            height="9"
            viewBox="0 0 16 9"
            aria-hidden="true"
        >
            <path fill="currentColor" d="M8 0 16 9H0z" />
        </svg>
    );
}

function Navbar() {
    const pathname = usePathname();
    const { openBooking } = useBooking();
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const isOrganizations = pathname.startsWith('/serves');
    const isShop = pathname.startsWith('/shop');
    const isIndividuals = !isOrganizations && !isShop;

    useEffect(() => {
        const bar = document.getElementById('site-contact-bar');
        if (!bar) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsPinned(!entry.isIntersecting),
            { threshold: 0, rootMargin: '-12px 0px 0px 0px' },
        );

        observer.observe(bar);
        return () => observer.disconnect();
    }, []);

    return (
        <header
            className={`sticky top-2 z-[80] w-full sm:top-3 ${
                isPinned ? 'bg-[#003E48]' : ''
            }`}
        >
            <div
                className={`bg-white shadow-[0_14px_40px_rgba(0,62,72,0.14)] ${
                    isPinned ? 'overflow-hidden rounded-t-[22px] sm:rounded-t-[28px]' : ''
                }`}
            >
                <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-10">
                    <Link href="/" title="Vitaway Home" className="flex shrink-0 items-center gap-2">
                        <Logo className="h-10 w-10 object-contain" />
                        <span className="text-[15px] font-semibold tracking-[0.12em] text-[#1a1a1a]">VITAWAY</span>
                    </Link>

                    <div className="ml-auto hidden h-full items-center gap-8 lg:flex">
                        <Link
                            href="/indivituals"
                            className="relative flex h-full items-center gap-2 text-[16px] font-bold text-[#282E33] hover:text-[#003E48]"
                        >
                            <PersonIcon className="h-[22px] w-[22px] text-[#282E33]" />
                            For Individuals
                            {isIndividuals && <NavCaret />}
                        </Link>
                        <Link
                            href="/serves"
                            className="relative flex h-full items-center gap-2 text-[16px] font-bold text-[#282E33] hover:text-[#003E48]"
                        >
                            <GroupIcon className="h-[22px] w-[22px] text-[#282E33]" />
                            For Organizations
                            {isOrganizations && <NavCaret />}
                        </Link>
                        <Link
                            href="/shop"
                            className="relative flex h-full items-center gap-2 text-[16px] font-bold text-[#282E33] hover:text-[#003E48]"
                        >
                            <ShopIcon className="h-[22px] w-[22px] text-[#282E33]" />
                            Shop
                            {isShop && <NavCaret />}
                        </Link>
                        <ShoppingCart className="text-[#282E33]" />
                    </div>

                    <div className="ml-auto hidden items-center gap-2 max-lg:flex">
                        <ShoppingCart className="text-[#282E33]" />
                        <button
                            type="button"
                            onClick={() => setIsOpen((open) => !open)}
                            className="p-1 text-[#1a1a1a]"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

            <div className="hidden bg-[#003E48] lg:block">
                <div className="mx-auto flex h-[52px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
                    <nav className="flex items-center gap-7">
                        {bottomLinks.map((link) => {
                            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`inline-flex items-center gap-2 text-[14px] transition-colors ${
                                        active ? 'text-white' : 'text-white/85 hover:text-white'
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <PressButton size="sm" onClick={() => openBooking()}>
                            <CalendarDays />
                            Book appointment
                        </PressButton>
                        <PreRegisterButton size="sm" className="!px-3" />
                    </div>
                </div>
            </div>
            </div>

            {isOpen && (
                <div className="bg-white lg:hidden">
                    <nav className="flex flex-col gap-1 px-5 py-4 text-[15px] text-[#1a1a1a]">
                        <Link href="/indivituals" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2.5 font-bold">
                            <PersonIcon className="h-5 w-5 text-[#282E33]" />
                            For Individuals
                        </Link>
                        <Link href="/serves" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2.5 font-bold">
                            <GroupIcon className="h-5 w-5 text-[#282E33]" />
                            For Organizations
                        </Link>
                        <Link href="/shop" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2.5 font-bold">
                            <ShopIcon className="h-5 w-5 text-[#282E33]" />
                            Shop
                        </Link>
                        {bottomLinks.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2.5">
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/download" onClick={() => setIsOpen(false)} className="py-2.5">
                            Get the app
                        </Link>
                        <PressButton
                            size="sm"
                            className="mt-3 w-full"
                            onClick={() => {
                                setIsOpen(false);
                                openBooking();
                            }}
                        >
                            <CalendarDays />
                            Book appointment
                        </PressButton>
                        <PreRegisterButton
                            size="sm"
                            surface="light"
                            className="mt-2 w-full"
                            onOpen={() => setIsOpen(false)}
                        />
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;
