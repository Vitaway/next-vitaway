'use client';

import React from 'react';
import { ClipboardList } from 'lucide-react';
import PressButton from '../buttons/press-button';
import { useBooking } from './booking-context';

function shouldOpenInNewContext(event: React.MouseEvent) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1;
}

function PreRegisterButton({
    children = 'Pre-register',
    size = 'md',
    className = '',
    surface = 'dark',
    onOpen,
}: {
    children?: React.ReactNode;
    size?: 'md' | 'sm';
    className?: string;
    surface?: 'dark' | 'light';
    onOpen?: () => void;
}) {
    const { openPrereg } = useBooking();

    return (
        <PressButton
            href="/pre-registration"
            variant="secondary"
            surface={surface}
            size={size}
            className={className}
            onClick={(event) => {
                if (shouldOpenInNewContext(event)) return;
                event.preventDefault();
                onOpen?.();
                openPrereg();
            }}
        >
            <ClipboardList />
            {children}
        </PressButton>
    );
}

export default PreRegisterButton;
