'use client';

import React, { useState } from 'react';
import Logo from '../logo'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ShoppingCart from '@/app/shop/shopping-cart';

function BottomNavbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (<>
        <header className="bg-white sticky top-0 z-20 border-b border-gray-100 px-4 py-1 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-3">
            <div className="flex items-center justify-between h-14 lg:h-16">
                <div className="flex-shrink-0">
                    <Link href="/" title="" className="flex">
                        <Logo />
                    </Link>
                </div>

                <button onClick={() => setIsOpen(true)} type="button" className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
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
                    <Link href="/blogs" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/blogs' ? 'text-slate-900 font-bold' : 'text-black'}`}> Blogs </Link>
                    <Link href="/pricing" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/pricing' ? 'text-slate-900 font-bold' : 'text-black'}`}> Pricing </Link>
                </div>

                <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10 font-medium">
                    <Link href="/contacts" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/contacts' ? 'text-slate-900 font-bold' : 'text-black'}`}> Contact </Link>
                    <div title="" className={`text-base transition-all duration-200 hover:text-opacity-80`}>
                        <ShoppingCart />
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Link href="/shop" title="" className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:text-white hover:bg-indigo-800 focus:text-white focus:bg-indigo-300 font-semibold text-white bg-gradient-to-b from-[#272749] to-[#111827] rounded-full" role="button"> Shop </Link>
                        <Link href="/download" title="" className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:text-white hover:bg-indigo-800 focus:text-white focus:bg-indigo-300 font-semibold text-white bg-gradient-to-b from-[#272749] to-[#111827] rounded-full" role="button"> Download </Link>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className='bg-white border z-40 border-gray-200 rounded-xl px-10 py-5 absolute top-14 left-0 right-0 mx-2 lg:hidden'>
                    <div className='relative'>
                        <div className='flex flex-col space-y-3'>
                            <Link href="/" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/' ? 'text-slate-900 font-bold' : 'text-black'}`}> Home </Link>
                            <Link href="/serves" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/serves' ? 'text-slate-900 font-bold' : 'text-black'}`}> Who we serve </Link>
                            <Link href="/indivituals" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/indivituals' ? 'text-slate-900 font-bold' : 'text-black'}`}> For Individuals </Link>
                            <Link href="/shop" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/shop' ? 'text-slate-900 font-bold' : 'text-black'}`}> Shop </Link>
                            <Link href="/blogs" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/blogs' ? 'text-slate-900 font-bold' : 'text-black'}`}> Blogs </Link>
                            <Link href="/pricing" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/pricing' ? 'text-slate-900 font-bold' : 'text-black'}`}> Pricing </Link>
                            <Link href="/contacts" title="" className={`text-base transition-all duration-200 hover:text-opacity-80 ${pathname === '/contacts' ? 'text-slate-900 font-bold' : 'text-black'}`}> Contact </Link>
                            <Link href="/download" title="" className="lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:text-white hover:bg-indigo-800 focus:text-black focus:bg-indigo-300 font-semibold text-white bg-black rounded-full" role="button"> Download </Link>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex space-x-2 mt-5">
                            <ul className="flex items-center space-x-3">
                                <li>
                                    <a href="#" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
                                            ></path>
                                        </svg>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                                        </svg>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                                            <circle cx="16.806" cy="7.207" r="1.078"></circle>
                                            <path
                                                d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"
                                            ></path>
                                        </svg>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                                            ></path>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Language Toggle */}
                        <div className="flex items-center text-sm mt-5">
                            <span className="font-medium text-slate-700">Eng</span>
                            <label className="relative inline-flex cursor-pointer items-center mx-2">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="peer h-4 w-11 rounded bg-gray-200 peer-checked:bg-blue-600 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                            </label>
                            <span className="font-medium text-slate-700">Kiny</span>
                        </div>

                        <div className='absolute -right-5 top-0' onClick={() => setIsOpen(false)} role="button">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g opacity=".4" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9.17 14.832 5.66-5.66M14.83 14.832l-5.66-5.66"></path></g><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    </>)
}

export default BottomNavbar