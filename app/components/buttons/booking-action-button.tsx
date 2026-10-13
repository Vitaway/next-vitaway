'use client';

import React from 'react';
import '@/app/styles/booking-desk.css';

type Tone = 'primary' | 'teal' | 'white';
type Size = 'sm' | 'md';
type IconName = 'arrow' | 'back' | 'check' | 'close';

type BookingActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: Tone;
    size?: Size;
    icon?: IconName;
    loading?: boolean;
};

function ActionIcon({ name }: { name: IconName }) {
    if (name === 'check') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
        );
    }
    if (name === 'close') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" aria-hidden className={name === 'back' ? '-scale-x-100' : undefined}>
            <path d="M13.3 5.3a1 1 0 0 0 0 1.4L17.6 11H4a1 1 0 1 0 0 2h13.6l-4.3 4.3a1 1 0 0 0 1.4 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.4 0z" />
        </svg>
    );
}

function Spinner() {
    return (
        <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden
        />
    );
}

export default function BookingActionButton({
    tone = 'primary',
    size = 'md',
    icon = 'arrow',
    loading = false,
    className = '',
    type = 'button',
    disabled,
    children,
    ...props
}: BookingActionButtonProps) {
    const classes = [
        'booking-action-btn',
        tone === 'teal' && 'booking-action-btn--teal',
        tone === 'white' && 'booking-action-btn--white',
        size === 'sm' && 'booking-action-btn--sm',
        icon === 'back' && 'booking-action-btn--back',
        loading && 'booking-action-btn--loading',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={classes} {...props}>
            <span className="booking-action-btn__text">{children}</span>
            <span className="booking-action-btn__icon">{loading ? <Spinner /> : <ActionIcon name={icon} />}</span>
        </button>
    );
}
