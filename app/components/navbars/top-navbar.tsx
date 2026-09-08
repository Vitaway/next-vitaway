"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "../logo";
import ShoppingCart from "@/app/shop/shopping-cart";
import { GroupIcon, PersonIcon } from "../icons/omada-icons";

function TopNavbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isIndividuals = !pathname.startsWith("/serves");
    const isOrganizations = pathname.startsWith("/serves");

    const audienceClass = (active: boolean) =>
        `relative self-stretch flex items-center gap-2 text-[15px] text-[#1a1a1a] hover:text-[#003E48] ${active ? "font-medium" : "font-normal"}`;

    return (
        <div className="relative z-20 bg-white border-b border-[#e6e6e6]">
            <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-[1440px] lg:px-10">
                <Link href="/" title="Vitaway Home" className="flex items-center shrink-0">
                    <Logo />
                </Link>

                <div className="hidden lg:flex items-center gap-10 h-full">
                    <Link href="/indivituals" className={audienceClass(isIndividuals)}>
                        <PersonIcon className="h-[22px] w-[22px] text-[#282E33]" />
                        For Individuals
                        {isIndividuals && (
                            <span className="pointer-events-none absolute left-1/2 top-full z-30 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />
                        )}
                    </Link>

                    <Link href="/serves" className={audienceClass(isOrganizations)}>
                        <GroupIcon className="h-[22px] w-[22px] text-[#282E33]" />
                        For Organizations
                        {isOrganizations && (
                            <span className="pointer-events-none absolute left-1/2 top-full z-30 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />
                        )}
                    </Link>

                    <ShoppingCart />
                </div>

                <div className="hidden max-lg:flex items-center gap-4">
                    <ShoppingCart />
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="text-[#1a1a1a] p-1"
                        aria-label="Open menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                            <path d="M4 7h16M4 12h16M4 17h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="absolute inset-x-0 top-full z-40 bg-white border-t border-[#e6e6e6] shadow-lg lg:hidden">
                    <div className="px-6 py-6">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-medium text-[#003E48]">Menu</p>
                            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close menu" className="text-[#1a1a1a]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                    <path d="M6 6l12 12M18 6L6 18"></path>
                                </svg>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4 text-[15px] text-[#1a1a1a]">
                            <Link href="/indivituals" onClick={() => setIsOpen(false)}>For Individuals</Link>
                            <Link href="/serves" onClick={() => setIsOpen(false)}>For Organizations</Link>
                            <Link href="/pricing" onClick={() => setIsOpen(false)}>How We Can Help</Link>
                            <Link href="/blogs" onClick={() => setIsOpen(false)}>Success Stories</Link>
                            <Link href="/about-us" onClick={() => setIsOpen(false)}>Who We Are</Link>
                            <Link href="/faqs" onClick={() => setIsOpen(false)}>FAQs</Link>
                            <Link href="/contacts" onClick={() => setIsOpen(false)}>Support</Link>
                            <Link href="/download" onClick={() => setIsOpen(false)}>Download</Link>
                            <Link href="/shop" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#E85A2E] rounded-full">
                                Get Started
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TopNavbar;
