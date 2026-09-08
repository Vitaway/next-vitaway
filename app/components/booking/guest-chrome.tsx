'use client';

import React from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import { StickyBooking } from '../sections/hero-booking';
import { BookingProvider } from './booking-context';
import BookingModal from './booking-modal';
import PreRegistrationModal from './pre-registration-modal';
import PageEnter from './page-enter';

function GuestChrome({ children }: { children: React.ReactNode }) {
    return (
        <BookingProvider>
            <Navbar />
            <PageEnter>{children}</PageEnter>
            <Footer />
            <StickyBooking />
            <BookingModal />
            <PreRegistrationModal />
        </BookingProvider>
    );
}

export default GuestChrome;
