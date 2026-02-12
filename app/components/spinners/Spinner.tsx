import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'white' | 'gray';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
};

const colorClasses = {
    primary: 'border-[#003E48] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
};

/**
 * Reusable Spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'primary',
    className = ''
}) => {
    return (
        <div
            className={`${sizeClasses[size]} ${colorClasses[color]} ${className} rounded-full animate-spin`}
            role="status"
            aria-label="Loading"
        />
    );
};

interface ButtonSpinnerProps {
    text?: string;
    loadingText?: string;
}

/**
 * Button spinner with optional text
 */
export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
    text = 'Loading',
    loadingText,
}) => {
    return (
        <div className="flex items-center justify-center gap-2">
            <Spinner size="sm" color="white" />
            <span>{loadingText || text}...</span>
        </div>
    );
};

interface FullPageSpinnerProps {
    message?: string;
}

/**
 * Full page loading spinner
 */
export const FullPageSpinner: React.FC<FullPageSpinnerProps> = ({
    message = 'Loading'
}) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center gap-4">
                <Spinner size="xl" color="primary" />
                {message && (
                    <p className="text-lg font-medium text-gray-700">{message}</p>
                )}
            </div>
        </div>
    );
};

interface InlineSpinnerProps {
    message?: string;
}

/**
 * Inline loading spinner with message
 */
export const InlineSpinner: React.FC<InlineSpinnerProps> = ({
    message = 'Loading'
}) => {
    return (
        <div className="flex items-center justify-center gap-3 py-8">
            <Spinner size="md" color="primary" />
            <span className="text-gray-600">{message}...</span>
        </div>
    );
};

interface CardSkeletonProps {
    count?: number;
}

/**
 * Generic card skeleton loader
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 1 }) => {
    return (
        <>
            {Array(count).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </>
    );
};

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    children: React.ReactNode;
}

/**
 * Loading overlay wrapper component
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    message,
    children
}) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg" color="primary" />
                        {message && (
                            <p className="text-sm font-medium text-gray-700">{message}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Spinner;
