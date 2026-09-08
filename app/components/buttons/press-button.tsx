import Link from 'next/link';
import React from 'react';

type PressButtonProps = {
    children: React.ReactNode;
    href?: string;
    className?: string;
    size?: 'md' | 'sm';
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary';
    surface?: 'dark' | 'light';
    onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
    disabled?: boolean;
};

function PressButton({
    children,
    href,
    className = '',
    size = 'md',
    type = 'button',
    variant = 'primary',
    surface = 'dark',
    onClick,
    disabled,
}: PressButtonProps) {
    const variantClass =
        variant === 'secondary'
            ? surface === 'light'
                ? 'press-btn--secondary-light'
                : 'press-btn--secondary'
            : '';
    const classes = `press-btn ${size === 'sm' ? 'press-btn--sm' : ''} ${variantClass} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={classes} onClick={onClick}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}

export default PressButton;
