import React from 'react';
import Image from 'next/image';
import parteners from '../../../content/parteners.json';

function Partenership() {
    return (<>
        <section className="py-5 bg-white sm:py-10 lg:py-10 border border-t">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center justify-center">

                <div className="flex justify-items-center grid-cols-2 gap-10 sm:gap-y-16 sm:grid-cols-3 xl:grid-cols-6">
                    {parteners.map((partener, index) => (
                        <div key={index} className="flex items-center justify-center w-full">
                            <Image width={500} height={500} className="object-contain h-20" src={partener.image} alt="" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    </>)
}

export default Partenership