import Image from 'next/image'
import React from 'react';
import BackgroundBlurImage from '../design/background-blur-image';
import testimonies from '../../../content/testimonies.json';

function Testimonies() {
    return (<>
        <section className="bg-gray-100 relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
            <div className="z-10 absolute left-1/2 top-0 aspect-[1204/394] w-full max-w-[1204px] -translate-x-1/2 opacity-35">
                <BackgroundBlurImage />
            </div>

            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">What our customers say</h2>
                <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 px-4 mt-12 sm:px-0 xl:mt-20 xl:grid-cols-4 sm:grid-cols-2">
                {testimonies.map((testimony, index) => (
                    <div className="overflow-hidden bg-white rounded-md" key={index}>
                        <div className="px-5 py-6">
                            <div className="flex items-center justify-between">
                                <Image width={100} height={100} className="flex-shrink-0 object-cover w-10 h-10 rounded-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/7/avatar-1.jpg" alt="" />
                                <div className="min-w-0 ml-3 mr-auto">
                                    <p className="text-base font-semibold text-black truncate">{ testimony.name }</p>
                                    <p className="text-sm text-gray-600 truncate">{ testimony.tag }</p>
                                </div>
                                <a href="#" title="" className="inline-block text-sky-500">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
                                    </svg>
                                </a>
                            </div>
                            <blockquote className="mt-5">
                                <p className="text-base text-gray-800">
                                    { testimony.message }
                                    <span className="block text-sky-500">{ testimony.username }</span>
                                </p>
                            </blockquote>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    </>)
}

export default Testimonies