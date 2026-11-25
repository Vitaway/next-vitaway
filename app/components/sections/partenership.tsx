import React from 'react';
import { partners } from '../../../content/partners';
import SectionCard from './section-card';

function Logo({ p }: { p: (typeof partners)[number] }) {
    // eslint-disable-next-line @next/next/no-img-element
    const img = <img src={p.image} alt={p.name} loading="lazy" draggable={false} className="h-full w-auto max-w-none object-contain" />;
    const cls = 'block h-20 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition-transform duration-300 hover:scale-105 sm:h-24';
    return p.link ? (
        <a href={p.link} target="_blank" rel="noopener noreferrer" className={cls} aria-label={p.name}>{img}</a>
    ) : (
        <div className={cls}>{img}</div>
    );
}

function Partenership() {
    return (
        <SectionCard className="bg-white py-10 sm:py-12">
            <h2 className="px-5 text-center text-2xl font-bold tracking-tight text-[#003E48] sm:text-3xl">
                Partners we <span className="font-accent">work with</span>
            </h2>

            <div
                className="partner-marquee mt-8 overflow-hidden sm:mt-10"
                style={{ maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)' }}
            >
                <div className="partner-track flex w-max items-center gap-6 sm:gap-10">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center gap-6 sm:gap-10" aria-hidden={copy === 1}>
                            {partners.map((p) => (
                                <Logo key={`${copy}-${p.name}`} p={p} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default Partenership;
