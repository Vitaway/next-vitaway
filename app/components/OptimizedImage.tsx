/* eslint-disable @typescript-eslint/no-unused-vars */
import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
    fallbackSrc?: string;
    showLoader?: boolean;
}

/**
 * Optimized Image component with loading states and error handling
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    fallbackSrc = '/images/placeholder.png',
    showLoader = true,
    className = '',
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setError(true);
        setIsLoading(false);
        if (fallbackSrc) {
            setImageSrc(fallbackSrc);
        }
    };

    return (
        <div className="relative">
            {showLoader && isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            <Image
                {...props}
                src={imageSrc}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                quality={85}
            />
        </div>
    );
};

export default OptimizedImage;
