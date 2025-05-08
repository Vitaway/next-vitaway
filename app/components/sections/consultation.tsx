import Image from 'next/image';
import React from 'react'

function Consultation() {
    const services = [
        {
            title: 'Diabetes',
            description: 'Get expert advice on managing diabetes, understanding its types, causes, symptoms, and effective treatment options.',
            icon: "https://cdn-icons-png.flaticon.com/512/4349/4349215.png",
        },
        {
            title: 'Hypertension',
            description: 'Learn how to monitor your blood pressure, recognize warning signs, and take practical steps to manage and prevent hypertension.',
            icon: 'https://cdn-icons-png.flaticon.com/512/4799/4799067.png',
        },
        {
            title: 'Weight Management',
            description: 'Receive personalized plans and expert tips to help you achieve and maintain a healthy weight, promoting overall well-being.',
            icon: 'https://cdn-icons-png.flaticon.com/512/847/847345.png',
        },
        {
            title: 'Well Being',
            description: 'Explore holistic approaches to improve your mental, emotional, and physical well-being, enhancing your quality of life.',
            icon: 'https://cdn-icons-png.flaticon.com/512/3997/3997942.png',
        },
    ];

    return (<>
        <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    <div>
                        <p className="inline-block  font-normal px-3 py-px mb-4 text-xs tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                            Consultation
                        </p>
                    </div>
                    <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-slate-900 sm:text-4xl md:mx-auto">
                        <span className="relative inline-block">
                            <svg viewBox="0 0 52 24" fill="currentColor" className="absolute top-9 right-10 z-0 hidden w-28 -mt-8 -ml-20 text-blue-gray-100 lg:w-28 lg:-ml-28 lg:-mt-10 sm:block">
                                <defs>
                                    <pattern id="18302e52-9e2a-4c8e-9550-0cbb21b38e55" x="0" y="0" width=".135"
                                        height=".30">
                                        <circle cx="1" cy="1" r=".7"></circle>
                                    </pattern>
                                </defs>
                                <rect fill="url(#18302e52-9e2a-4c8e-9550-0cbb21b38e55)" width="52" height="24"></rect>
                            </svg>
                            <span className="relative  font-normal"></span>
                        </span>
                        Accessible Remote Doctor Consultation
                    </h2>
                    <p className="text-base text-gray-700 md:text-lg font-merri font-normal">
                        Experience the ease and convenience of connecting with qualified medical professionals from the comfort of your home. Our remote consultation service ensures you receive timely, safe, and efficient healthcare access whenever you need it.
                    </p>
                </div>

                <div className="px-5 py-8 mt-12 bg-white lg:mt-20 lg:p-16 border border-gray-200 rounded-xl">
                    <div className="grid grid-cols-1 gap-12 lg:gap-16 sm:grid-cols-2">
                        {services.map((service, index) => (
                            <div className="flex items-start" key={index}>
                                <div className="flex items-center justify-center p-4 mb-4 rounded-full bg-indigo-50">
                                    <Image width={500} height={500} src={service.icon} className='w-16 h-8' alt={service.title} />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-semibold text-black">{service.title}</h3>
                                    <p className="mt-4 text-base text-gray-600">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </>)
}

export default Consultation