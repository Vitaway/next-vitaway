import React from 'react';
import Image from 'next/image';
import parteners from '../../../content/parteners.json';

function Partenership() {
    return (<>
        <section className="py-5 bg-gray-50 sm:py-10 lg:py-10">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

                <div className="grid place-items-center justify-center grid-cols-2 gap-10 sm:gap-y-16 sm:grid-cols-3 xl:grid-cols-6">
                    {parteners.map((partener, index) => (
                        <div key={index} className="rounded-lg w-full">
                            <Image width={500} height={500} className="object-contain mx-auto h-20" src={partener.image} alt="" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    </>)
}

export default Partenership