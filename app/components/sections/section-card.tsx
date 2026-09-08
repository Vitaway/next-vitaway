import React from 'react';

function SectionCard({
    children,
    className = '',
    id,
    overflow = 'hidden',
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
    overflow?: 'hidden' | 'visible';
}) {
    return (
        <section
            id={id}
            className={`${overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden'} rounded-[22px] sm:rounded-[28px] ${className}`.trim()}
        >
            {children}
        </section>
    );
}

export default SectionCard;
