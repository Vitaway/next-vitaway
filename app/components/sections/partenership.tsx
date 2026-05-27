import React from 'react';
import Image from 'next/image';
import parteners from '../../../content/parteners.json';

function Partenership() {
    return (<>
        <section className="py-5 bg-white sm:py-10 lg:py-10 border border-t">
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-20">
                <div>
                    <p className="inline-block  font-normal px-3 py-px mb-4 text-xs tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                        paterners
                    </p>
                </div>
                <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-slate-900 sm:text-4xl md:mx-auto">
                    Our Trusted Partners
                </h2>
            </div>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center justify-center mt-10">
                <div className="flex justify-items-center grid-cols-2 gap-10 sm:gap-y-16 sm:grid-cols-3 xl:grid-cols-6">
                    {parteners.map((partener, index) => (
                        <div key={index} className="flex items-center justify-center w-full">
                            <a href={partener.link} target="__blank">
                                <Image width={500} height={500} className="object-contain h-20" src={partener.image} alt="" />
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    </>)
}

export default Partenership