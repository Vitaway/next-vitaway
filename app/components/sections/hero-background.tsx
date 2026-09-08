'use client';

import React, { useEffect, useRef, useState } from 'react';

const YOUTUBE_ID = 'T73sfGzsUeU';
const POSTER = `https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;
const EMBED_SRC = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${YOUTUBE_ID}&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`;

function sendPlayerCommand(iframe: HTMLIFrameElement, func: string) {
    iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args: [] }),
        '*',
    );
}

function HeroBackground() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const forcePlay = () => {
            sendPlayerCommand(iframe, 'mute');
            sendPlayerCommand(iframe, 'playVideo');
        };

        const onMessage = (event: MessageEvent) => {
            if (!String(event.origin).includes('youtube.com')) return;

            let payload: { info?: number | { playerState?: number } } | null = null;
            try {
                payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            } catch {
                return;
            }

            const state = typeof payload?.info === 'number' ? payload.info : payload?.info?.playerState;
            if (state === 1) setIsPlaying(true);
        };

        const onLoad = () => {
            iframe.contentWindow?.postMessage(
                JSON.stringify({ event: 'listening', id: YOUTUBE_ID }),
                '*',
            );
            forcePlay();
        };

        window.addEventListener('message', onMessage);
        iframe.addEventListener('load', onLoad);
        forcePlay();

        const retry = window.setInterval(forcePlay, 1000);

        const unlock = () => forcePlay();
        document.addEventListener('click', unlock);
        document.addEventListener('touchstart', unlock);
        document.addEventListener('scroll', unlock);

        return () => {
            window.removeEventListener('message', onMessage);
            iframe.removeEventListener('load', onLoad);
            window.clearInterval(retry);
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('scroll', unlock);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                className="absolute inset-0 scale-105 bg-cover bg-center"
                style={{ backgroundImage: `url(${POSTER})` }}
            />
            <iframe
                ref={iframeRef}
                src={EMBED_SRC}
                title="Vitaway welcome video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-[130%] w-[177.78vh] min-w-[130%] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ${
                    isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
}

export default HeroBackground;
