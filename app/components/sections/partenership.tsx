import React from 'react';
import Image from 'next/image';
import parteners from '../../../content/parteners.json';
import SectionCard from './section-card';

const partnerNames = ['Eden Care', 'RBA', 'Jobra', 'Intare Gym', 'MediConnect'];

function Partenership() {
    return (
        <SectionCard className="bg-white py-10 sm:py-12">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                <h2 className="text-center text-2xl font-bold tracking-tight text-[#003E48] sm:text-3xl">
                    Partners we <span className="font-accent">work with</span>
                </h2>

                <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:mt-10 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-5 lg:gap-x-12">
                    {parteners.map((partener, index) => (
                        <a
                            key={partener.link}
                            href={partener.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-20 items-center justify-center opacity-80 transition-opacity hover:opacity-100 sm:h-24"
                        >
                            <Image
                                width={240}
                                height={96}
                                className="max-h-16 w-auto max-w-full object-contain sm:max-h-20 lg:max-h-24"
                                src={partener.image}
                                alt={partnerNames[index] ?? 'Partner logo'}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default Partenership;
