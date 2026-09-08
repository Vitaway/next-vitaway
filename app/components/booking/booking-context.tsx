'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type BookingMode = 'clinic' | 'call';

export type BookingDraft = {
    mode: BookingMode;
    date: string;
    time: string;
};

type GuestModal = 'booking' | 'prereg' | null;

type BookingContextValue = {
    draft: BookingDraft | null;
    isOpen: boolean;
    isPreregOpen: boolean;
    openBooking: (draft?: Partial<BookingDraft>) => void;
    closeBooking: () => void;
    openPrereg: () => void;
    closePrereg: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [draft, setDraft] = useState<BookingDraft | null>(null);
    const [modal, setModal] = useState<GuestModal>(null);

    const openBooking = useCallback((next?: Partial<BookingDraft>) => {
        setDraft({
            mode: next?.mode ?? 'clinic',
            date: next?.date ?? '',
            time: next?.time ?? '',
        });
        setModal('booking');
    }, []);

    const closeBooking = useCallback(() => {
        setModal((current) => (current === 'booking' ? null : current));
    }, []);

    const openPrereg = useCallback(() => {
        setModal('prereg');
    }, []);

    const closePrereg = useCallback(() => {
        setModal((current) => (current === 'prereg' ? null : current));
    }, []);

    const value = useMemo(
        () => ({
            draft,
            isOpen: modal === 'booking',
            isPreregOpen: modal === 'prereg',
            openBooking,
            closeBooking,
            openPrereg,
            closePrereg,
        }),
        [draft, modal, openBooking, closeBooking, openPrereg, closePrereg],
    );

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
    const ctx = useContext(BookingContext);
    if (!ctx) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return ctx;
}

export function useBookingOptional() {
    return useContext(BookingContext);
}
