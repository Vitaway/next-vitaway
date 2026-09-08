'use client';

import React, { useEffect, useState } from 'react';

function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 320);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-[90] bottom-28 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#003E48] text-white shadow-[0_10px_28px_rgba(0,62,72,0.28)] transition hover:bg-[#E85A2E] sm:bottom-28 sm:right-5"
            aria-label="Scroll to top"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}

export default ScrollToTop;
