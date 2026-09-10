'use client';

import Link from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './logo';
import ShoppingCart from '@/app/shop/shopping-cart';
import PressButton from './buttons/press-button';
import PreRegisterButton from './booking/pre-register-button';
import { GroupIcon, PersonIcon, ShopIcon } from './icons/omada-icons';
import { useBooking } from './booking/booking-context';
import {
    Activity,
    Building2,
    CalendarDays,
    CalendarRange,
    CircleHelp,
    Droplets,
    GraduationCap,
    Handshake,
    HeartHandshake,
    HeartPulse,
    HelpingHand,
    Landmark,
    LayoutGrid,
    MessageCircleQuestion,
    MoreHorizontal,
    Scale,
    Sparkles,
    Users,
    UsersRound,
    type LucideIcon,
} from 'lucide-react';
import {
    defaultTealLinks,
    individualLinks,
    individualTealLinks,
    organizationLinks,
    organizationTealLinks,
    type NavLink,
} from '@/content/site-nav';

const tealLinkIcons: Record<string, LucideIcon> = {
    '/for-individuals': LayoutGrid,
    '/for-individuals/health-check': Activity,
    '/for-individuals/12-week-programme': CalendarRange,
    '/for-individuals/continued-care': HeartHandshake,
    '/for-individuals/weight': Scale,
    '/for-individuals/blood-pressure': HeartPulse,
    '/for-individuals/blood-sugar': Droplets,
    '/for-individuals/family': UsersRound,
    '/for-organizations': LayoutGrid,
    '/for-organizations/companies': Building2,
    '/for-organizations/embassies': Landmark,
    '/for-organizations/ngos': Handshake,
    '/for-organizations/schools': GraduationCap,
    '/success-stories': Sparkles,
    '/about-us': Users,
    '/faqs': CircleHelp,
    '/contacts': MessageCircleQuestion,
};

function iconForTealLink(link: NavLink): LucideIcon | undefined {
    if (link.label === 'How We Can Help') return HelpingHand;
    return tealLinkIcons[link.href];
}

function isTealLinkActive(link: NavLink, pathname: string) {
    if (link.href === '/for-individuals' || link.href === '/for-organizations') {
        return pathname === link.href;
    }
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

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

function TealNavItem({
    link,
    pathname,
    onNavigate,
    className = '',
}: {
    link: NavLink;
    pathname: string;
    onNavigate?: () => void;
    className?: string;
}) {
    const active = isTealLinkActive(link, pathname);
    const Icon = iconForTealLink(link);

    return (
        <Link
            href={link.href}
            onClick={onNavigate}
            className={`inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold tracking-wide transition-colors xl:text-[14px] ${
                active ? 'text-[#E85A2E]' : 'text-white hover:text-white'
            } ${className}`}
        >
            {Icon ? (
                <Icon
                    className={`h-4 w-4 shrink-0 stroke-[2] ${active ? 'text-[#E85A2E]' : 'text-white'}`}
                    aria-hidden
                />
            ) : null}
            {link.label}
        </Link>
    );
}

function TealOverflowNav({ links, pathname }: { links: NavLink[]; pathname: string }) {
    const containerRef = useRef<HTMLElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const moreBtnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(links.length);
    const [moreOpen, setMoreOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measureEl = measureRef.current;
        if (!container || !measureEl) return;

        const gap = 16;

        const measure = () => {
            const itemEls = Array.from(measureEl.querySelectorAll<HTMLElement>('[data-measure-item]'));
            const moreEl = measureEl.querySelector<HTMLElement>('[data-measure-more]');
            if (!itemEls.length || !moreEl) return;

            const available = container.clientWidth;
            const moreWidth = moreEl.offsetWidth;

            let allWidth = 0;
            itemEls.forEach((el, i) => {
                allWidth += el.offsetWidth + (i > 0 ? gap : 0);
            });

            if (allWidth <= available) {
                setVisibleCount(links.length);
                return;
            }

            let used = 0;
            let count = 0;
            for (let i = 0; i < itemEls.length; i++) {
                const next = used + (count > 0 ? gap : 0) + itemEls[i].offsetWidth;
                if (next + gap + moreWidth > available) break;
                used = next;
                count += 1;
            }

            setVisibleCount(Math.max(0, count));
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(container);
        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [links]);

    useEffect(() => {
        setMoreOpen(false);
    }, [pathname, links]);

    useEffect(() => {
        if (!moreOpen) return;

        const updatePos = () => {
            const btn = moreBtnRef.current;
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + 8, left: rect.left });
        };

        updatePos();

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (moreBtnRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            setMoreOpen(false);
        };

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMoreOpen(false);
        };

        window.addEventListener('resize', updatePos);
        window.addEventListener('scroll', updatePos, true);
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('resize', updatePos);
            window.removeEventListener('scroll', updatePos, true);
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [moreOpen]);

    const visible = links.slice(0, visibleCount);
    const overflow = links.slice(visibleCount);
    const overflowActive = overflow.some((link) => isTealLinkActive(link, pathname));

    return (
        <nav ref={containerRef} className="relative flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
            <div
                ref={measureRef}
                className="pointer-events-none absolute left-0 top-0 -z-10 flex items-center gap-4 opacity-0"
                aria-hidden
            >
                {links.map((link) => (
                    <span
                        key={link.href}
                        data-measure-item
                        className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold tracking-wide xl:text-[14px]"
                    >
                        {iconForTealLink(link) ? <span className="inline-block h-4 w-4" /> : null}
                        {link.label}
                    </span>
                ))}
                <span
                    data-measure-more
                    className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold tracking-wide xl:text-[14px]"
                >
                    <span className="inline-block h-4 w-4" />
                    More
                </span>
            </div>

            {visible.map((link) => (
                <TealNavItem key={link.href} link={link} pathname={pathname} />
            ))}

            {overflow.length > 0 ? (
                <div className="relative shrink-0">
                    <button
                        ref={moreBtnRef}
                        type="button"
                        aria-expanded={moreOpen}
                        aria-haspopup="menu"
                        onClick={() => setMoreOpen((open) => !open)}
                        className={`inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-wide transition-colors xl:text-[14px] ${
                            overflowActive || moreOpen ? 'text-[#E85A2E]' : 'text-white hover:text-white'
                        }`}
                    >
                        <MoreHorizontal
                            className={`h-4 w-4 stroke-[2] ${
                                overflowActive || moreOpen ? 'text-[#E85A2E]' : 'text-white'
                            }`}
                            aria-hidden
                        />
                        More
                    </button>

                    {moreOpen && menuPos ? (
                        <div
                            ref={menuRef}
                            role="menu"
                            style={{ top: menuPos.top, left: menuPos.left }}
                            className="fixed z-[120] min-w-[220px] rounded-2xl border border-[#003E48]/10 bg-white py-2 shadow-[0_18px_40px_rgba(0,62,72,0.18)]"
                        >
                            {overflow.map((link) => {
                                const active = isTealLinkActive(link, pathname);
                                const Icon = iconForTealLink(link);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        role="menuitem"
                                        onClick={() => setMoreOpen(false)}
                                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                                            active
                                                ? 'bg-[#FFF4F0] text-[#E85A2E]'
                                                : 'text-[#003E48] hover:bg-[#F6F3EE]'
                                        }`}
                                    >
                                        {Icon ? (
                                            <Icon
                                                className={`h-4 w-4 shrink-0 stroke-[2] ${
                                                    active ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                                }`}
                                                aria-hidden
                                            />
                                        ) : null}
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </nav>
    );
}

type Audience = 'default' | 'individuals' | 'organizations';

function audienceFromPath(pathname: string): Audience {
    if (pathname.startsWith('/for-organizations') || pathname.startsWith('/serves')) {
        return 'organizations';
    }
    if (pathname.startsWith('/for-individuals') || pathname.startsWith('/indivituals')) {
        return 'individuals';
    }
    return 'default';
}

function Navbar() {
    const pathname = usePathname();
    const { openBooking } = useBooking();
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const audience = audienceFromPath(pathname);
    const isOrganizations = audience === 'organizations';
    const isShop = pathname.startsWith('/shop');
    const showIndividualsCaret = !isOrganizations && !isShop;
    const showOrganizationsCaret = isOrganizations;

    const tealLinks =
        audience === 'organizations'
            ? organizationTealLinks
            : audience === 'individuals'
              ? individualTealLinks
              : defaultTealLinks;

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
        <header className={`sticky top-2 z-[80] w-full sm:top-3 ${isPinned ? 'bg-[#003E48]' : ''}`}>
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
                            href="/for-individuals"
                            className="relative flex h-full items-center gap-2 text-[16px] font-bold text-[#282E33] hover:text-[#003E48]"
                        >
                            <PersonIcon className="h-[22px] w-[22px] text-[#282E33]" />
                            For Individuals
                            {showIndividualsCaret && <NavCaret />}
                        </Link>
                        <Link
                            href="/for-organizations"
                            className="relative flex h-full items-center gap-2 text-[16px] font-bold text-[#282E33] hover:text-[#003E48]"
                        >
                            <GroupIcon className="h-[22px] w-[22px] text-[#282E33]" />
                            For Organizations
                            {showOrganizationsCaret && <NavCaret />}
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
                    <div className="mx-auto flex h-[52px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-10">
                        <TealOverflowNav links={tealLinks} pathname={pathname} />

                        <div className="flex shrink-0 items-center gap-3">
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
                        <Link
                            href="/for-individuals"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-2.5 font-bold"
                        >
                            <PersonIcon className="h-5 w-5 text-[#282E33]" />
                            For Individuals
                        </Link>
                        {individualLinks.map((link) => {
                            const Icon = iconForTealLink(link);
                            const active = isTealLinkActive(link, pathname);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`inline-flex items-center gap-2 py-2 pl-10 text-sm font-semibold ${
                                        active ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                    }`}
                                >
                                    {Icon ? (
                                        <Icon
                                            className={`h-4 w-4 shrink-0 stroke-[2] ${
                                                active ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                            }`}
                                            aria-hidden
                                        />
                                    ) : null}
                                    {link.label}
                                </Link>
                            );
                        })}

                        <Link
                            href="/for-organizations"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 flex items-center gap-3 py-2.5 font-bold"
                        >
                            <GroupIcon className="h-5 w-5 text-[#282E33]" />
                            For Organizations
                        </Link>
                        {organizationLinks.map((link) => {
                            const Icon = iconForTealLink(link);
                            const active = isTealLinkActive(link, pathname);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`inline-flex items-center gap-2 py-2 pl-10 text-sm font-semibold ${
                                        active ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                    }`}
                                >
                                    {Icon ? (
                                        <Icon
                                            className={`h-4 w-4 shrink-0 stroke-[2] ${
                                                active ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                            }`}
                                            aria-hidden
                                        />
                                    ) : null}
                                    {link.label}
                                </Link>
                            );
                        })}

                        <Link href="/shop" onClick={() => setIsOpen(false)} className="mt-2 flex items-center gap-3 py-2.5 font-bold">
                            <ShopIcon className="h-5 w-5 text-[#282E33]" />
                            Shop
                        </Link>

                        <div className="my-2 border-t border-[#003E48]/10" />

                        {defaultTealLinks.map((link) => {
                            const Icon = iconForTealLink(link);
                            const active = isTealLinkActive(link, pathname);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`inline-flex items-center gap-2 py-2.5 font-semibold ${
                                        active ? 'text-[#E85A2E]' : 'text-[#1a1a1a]'
                                    }`}
                                >
                                    {Icon ? (
                                        <Icon
                                            className={`h-4 w-4 shrink-0 stroke-[2] ${
                                                active ? 'text-[#E85A2E]' : 'text-[#003E48]'
                                            }`}
                                            aria-hidden
                                        />
                                    ) : null}
                                    {link.label}
                                </Link>
                            );
                        })}
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
