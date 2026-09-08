import Link from 'next/link';
import React from 'react';

function DownloadAppButton({ className = '' }: { className?: string }) {
    return (
        <Link
            href="/download"
            className={`inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-[15px] text-[15px] font-bold text-[#003E48] transition hover:bg-[#F6F3EE] ${className}`.trim()}
        >
            Download the app
            <span className="inline-flex items-center gap-1.5" aria-hidden>
                <svg viewBox="0 0 16 20" className="h-[18px] w-[14px]" fill="currentColor">
                    <path d="M13.2 10.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8s-1.6-.7-2.7-.7c-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 .1 0 .2 0 .3-.1.9-.2 1.3-.6 2.3-.6s1.3.4 2.3.6c.1 0 .2 0 .3.1 1.1 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.1-2.2s-2.1-.8-2.1-3.3ZM11.2 4.8c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.2-.5.6-1 1.5-.9 2.4.9.1 1.8-.5 2.4-1.2Z" />
                </svg>
                <svg viewBox="0 0 16 18" className="h-[16px] w-[14px]" fill="currentColor">
                    <path d="M.7 1.1v15.8c0 .4.4.6.7.4l8.8-8.3L1.4.7C1.1.5.7.7.7 1.1Zm10 6.3 2 1.9c.6.5.6 1.5 0 2l-2 1.9-2.2-2.1 2.2-2.1ZM1.9.3l8.2 7.7L7.9 10 1.2.7C1.4.4 1.7.2 1.9.3Zm0 17.4c-.2.1-.5-.1-.7-.4l6.7-9.3 2.2 2.1-8.2 7.6Z" />
                </svg>
            </span>
        </Link>
    );
}

export default DownloadAppButton;
