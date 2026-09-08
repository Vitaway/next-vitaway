'use client';

import Link from 'next/link';
import React from 'react';

function AnnouncementBar() {
    return (
        <div id="site-contact-bar" className="rounded-t-[22px] bg-[#D7ECF5] text-[12px] text-[#003E48] sm:rounded-t-[28px]">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 lg:px-10">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <a href="tel:+250795767405" className="inline-flex items-center gap-1.5 hover:text-[#E85A2E]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
                        </svg>
                        +250 795 767 405
                    </a>
                    <a href="tel:+250787279560" className="hover:text-[#E85A2E]">
                        +250 787 279 560
                    </a>
                    <a href="mailto:vitawayeclinic@gmail.com" className="inline-flex items-center gap-1.5 hover:text-[#E85A2E]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
                        </svg>
                        vitawayeclinic@gmail.com
                    </a>
                </div>
                <div className="hidden flex-wrap items-center gap-x-5 md:flex">
                    <span>CPR-Unit House, 1st Floor, KK21 Ave, Niboye, Kicukiro, Kigali</span>
                    <span>MoH L031072025</span>
                    <a href="https://wa.me/250787279560" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[#E85A2E] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1s-.7.9-.9 1.1c-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.7-3.4-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.7.7-1 1.6-1 2.6 0 1.5 1.1 3.1 1.3 3.3 1.3 2 3 3.3 5.2 4.2.7.3 1.2.4 1.6.3.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3zM12.1 21.8h-.1c-1.8 0-3.6-.5-5.1-1.4L4 21.2l.8-2.9C3.8 16.6 3.3 14.7 3.3 12.7 3.3 7.8 7.2 3.8 12 3.8c2.3 0 4.5.9 6.2 2.6 1.6 1.6 2.5 3.8 2.5 6.2 0 4.9-4 8.9-8.6 9.2zm7.6-16C17.5 3.6 14.9 2.4 12 2.4 6.4 2.4 1.9 7 1.9 12.7c0 2 .5 3.9 1.5 5.6L2 22.7c-.1.4 0 .8.3 1.1.2.2.5.3.8.3h.3l5.1-1.3c1.6.9 3.4 1.3 5.2 1.3h.1c5.6 0 10.2-4.6 10.2-10.4 0-2.8-1.1-5.4-3.1-7.3z" />
                        </svg>
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementBar;
