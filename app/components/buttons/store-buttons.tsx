import React from 'react';

export const APP_STORE_URL = 'https://apps.apple.com/rw/app/vitaway-plus/id6745190821';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.patienceman.vitaway';

function StoreButtons({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-wrap items-center gap-2.5 ${className}`.trim()}>
            <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-90"
            >
                <img
                    src="/images/badges/app-store.svg"
                    alt="Download on the App Store"
                    height={40}
                    className="h-10 w-auto"
                />
            </a>
            <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-90"
            >
                <img
                    src="/images/badges/google-play.svg"
                    alt="Get it on Google Play"
                    height={40}
                    className="h-10 w-auto"
                />
            </a>
        </div>
    );
}

export default StoreButtons;
