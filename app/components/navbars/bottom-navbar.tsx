'use client';

import React from 'react';
import Logo from '../logo'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function BottomNavbar() {
    const pathname = usePathname();

    return (<>
        <header className="bg-white px-4 py-1 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-3">
            <div className="flex items-center justify-between h-14 lg:h-16">
                <div className="flex-shrink-0">
                    <Link href="/" title="" className="flex">
                        <Logo />
                    </Link>
                </div>

                <button type="button" className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
                    <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                    </svg>

                    <svg className="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10 font-medium text-slate-500">
                    <Link href="/" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/' ? 'text-slate-900 font-bold' : 'text-black'}`}> Home </Link>
                    <Link href="/serves" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/serves' ? 'text-slate-900 font-bold' : 'text-black'}`}> Who we serve </Link>
                    <Link href="/indivituals" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/indivituals' ? 'text-slate-900 font-bold' : 'text-black'}`}> For Individuals </Link>
                    <Link href="/pricing" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/pricing' ? 'text-slate-900 font-bold' : 'text-black'}`}> Pricing </Link>
                    <Link href="/blogs" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/blogs' ? 'text-slate-900 font-bold' : 'text-black'}`}> Blogs </Link>
                </div>

                <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
                    <Link href="/contacts" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/contacts' ? 'text-slate-900 font-bold' : 'text-black'}`}> Contact </Link>
                    <Link href="/download" title="" className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:text-white hover:bg-indigo-800 focus:text-black focus:bg-indigo-300 font-semibold text-white bg-black rounded-full" role="button"> Download </Link>
                </div>
            </div>
        </header>
    </>)
}

export default BottomNavbar