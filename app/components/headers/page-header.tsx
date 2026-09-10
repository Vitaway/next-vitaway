import Image from 'next/image';
import React from 'react';

interface PageHeaderProps {
    title: React.ReactNode;
    description: string;
    backgroundImage?: string;
    /** Tailwind object-position/object-fit classes for the hero photo */
    imageClassName?: string;
    className?: string;
    /** Primary CTAs — belong in the hero, not a separate slab below. */
    actions?: React.ReactNode;
}

function PageHeader({
    title,
    description,
    backgroundImage,
    imageClassName = 'object-cover object-center',
    className = '',
    actions,
}: PageHeaderProps) {
    return (
        <div
            className={`relative min-h-[320px] overflow-hidden bg-[#003E48] sm:min-h-[380px] ${className}`}
        >
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image src={backgroundImage} alt="" fill priority className={imageClassName} sizes="100vw" />
                </div>
            )}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#003E48]/92 via-[#003E48]/62 to-[#003E48]/28" />

            <div className="relative z-20 mx-auto flex min-h-[320px] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-12 sm:min-h-[380px] lg:px-12 lg:pb-14 lg:pt-16">
                <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-xl text-base text-white/80">{description}</p>
                    {actions ? <div className="mt-8">{actions}</div> : null}
                </div>
            </div>
        </div>
    );
}

export default PageHeader;
