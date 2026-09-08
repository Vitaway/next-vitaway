'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import PressButton from '../buttons/press-button';
import { useBooking } from './booking-context';

function BookAppointmentButton({
    children = 'Book a health check',
    size = 'md',
    className = '',
}: {
    children?: React.ReactNode;
    size?: 'md' | 'sm';
    className?: string;
}) {
    const { openBooking } = useBooking();

    return (
        <PressButton size={size} className={className} onClick={() => openBooking()}>
            <CalendarDays />
            {children}
        </PressButton>
    );
}

export default BookAppointmentButton;
