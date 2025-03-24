import React from 'react';
import Image from 'next/image';
import parteners from '../../../content/parteners.json';

function Partenership() {
    return (<>
        <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center justify-center">

                <div className="grid justify-center items-center grid-cols-2 gap-10 sm:gap-y-16 sm:grid-cols-3 xl:grid-cols-6">
                    {parteners.map((partener, index) => (
                        <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                            <Image width={100} height={100} className="object-contain w-auto mx-auto h-14" src={partener.image} alt="" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    </>)
}

export default Partenership