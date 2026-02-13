"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress for optimal UX
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: 'ease',
    speed: 500,
});

export default function TopProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Complete progress when route changes
    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    // Handle navigation clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href && anchor.target !== '_blank') {
                const url = new URL(anchor.href);
                // Only show progress for same-origin internal navigation
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    NProgress.start();
                }
            }
        };

        // Handle form submissions
        const handleSubmit = () => {
            NProgress.start();
        };

        // Handle browser back/forward buttons
        const handlePopState = () => {
            NProgress.start();
        };

        document.addEventListener('click', handleClick, true);
        document.addEventListener('submit', handleSubmit, true);
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('click', handleClick, true);
            document.removeEventListener('submit', handleSubmit, true);
            window.removeEventListener('popstate', handlePopState);
            NProgress.done();
        };
    }, [pathname]);

    return (
        <style jsx global>{`
            #nprogress .bar {
                background: white !important;
                height: 3px;
            }
        `}</style>
    );
}
