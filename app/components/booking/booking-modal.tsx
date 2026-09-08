'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBooking } from './booking-context';
import AppointmentForm from '../forms/appointment-form';

function BookingModal() {
    const { isOpen, draft, closeBooking } = useBooking();

    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-[#003E48]/40 p-3 backdrop-blur-sm sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeBooking}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="booking-modal-title"
                        className="relative w-full max-w-[960px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,62,72,0.28)]"
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeBooking}
                            aria-label="Close"
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F3EE] text-[#003E48] hover:bg-[#E8F7F4]"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                        <AppointmentForm
                            variant="modal"
                            defaults={draft ?? undefined}
                            onSuccess={closeBooking}
                            onClose={closeBooking}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default BookingModal;
