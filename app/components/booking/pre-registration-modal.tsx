'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBooking } from './booking-context';
import PreRegistrationWizard from '@/app/pre-registration/PreRegistrationWizard';

function PreRegistrationModal() {
    const { isPreregOpen, closePrereg } = useBooking();

    useEffect(() => {
        if (!isPreregOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isPreregOpen]);

    return (
        <AnimatePresence>
            {isPreregOpen && (
                <motion.div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-[#003E48]/40 p-3 backdrop-blur-sm sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closePrereg}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="prereg-modal-title"
                        className="relative w-full max-w-[1120px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,62,72,0.28)]"
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closePrereg}
                            aria-label="Close"
                            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEECEC] text-[#E85A2E] transition hover:bg-[#E85A2E] hover:text-white"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <PreRegistrationWizard variant="modal" onClose={closePrereg} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PreRegistrationModal;
