'use client'

import React, { useState, useEffect } from 'react'
import TopNavbar from './navbars/top-navbar';
import BottomNavbar from './navbars/bottom-navbar';

function Navbar() {
    const [isNoticeClosed, setIsNoticeClosed] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        const savedState = localStorage.getItem('vitaway-notice-closed')
        setIsNoticeClosed(savedState === 'true')
        setIsMounted(true)
    }, [])

    const handleCloseNotice = () => {
        setIsNoticeClosed(true)
        localStorage.setItem('vitaway-notice-closed', 'true')
    }

    // Don't render until client-side hydration is complete
    if (!isMounted) return (
        <>
            <TopNavbar />
            <BottomNavbar />
        </>
    )

    if (isNoticeClosed) return (
        <>
            <TopNavbar />
            <BottomNavbar />
        </>
    )

    return (<>
        <div className="mb-0 py-4 px-4 bg-gradient-to-r from-red-900 to-red-800 border-b border-red-700 text-left">
            <div className="flex items-start justify-center gap-3 max-w-4xl mx-auto">
                <span className="flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#fecaca" stroke="#fecaca" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </span>
                <div className="flex-1">
                    <p className='text-xs sm:text-sm text-red-100 leading-relaxed'>
                        Vitaway Plus is currently unavailable for new downloads on iOS and Android due to a temporary technical issue. <br /> Our team is actively working to resolve this. Thank you for your patience and understanding.
                    </p>
                </div>
                <button
                    onClick={handleCloseNotice}
                    className="flex-shrink-0 text-red-200 hover:text-white transition-colors duration-200 p-1"
                    aria-label="Close notice"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>

        <TopNavbar />

        <BottomNavbar />
    </>)
}

export default Navbar;