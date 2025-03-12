"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import default styles

export default function TopProgressBar() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            NProgress.start();
            setLoading(true);
        };

        const handleStop = () => {
            NProgress.done();
            setLoading(false);
        };

        router.prefetch(pathname);

        handleStart();

        setTimeout(handleStop, 500);

        return () => {
            NProgress.remove();
        };
    }, [pathname, router]);

    return loading ? (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50" />
    ) : null;
}
