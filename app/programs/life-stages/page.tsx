import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import Link from 'next/link'
import React from 'react';
import lifestages from '../../../content/life-stages.json';

function LifeStage() {
    return (<>
        <GuestLayout>

            <PageHeader
                sup_title='Program'
                title='LIFE STAGES'
                description='Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness.'
                backgroundImage='https://images.unsplash.com/photo-1534768654272-e97681c3a2c7?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                <div className="bg-white border rounded-lg shadow-sm">
                    <div className="flex flex-col md:justify-center lg:flex-row">
                        {lifestages.map((stage, index) => (
                            <div key={index} className="flex flex-col justify-between p-5 border-b sm:p-10 lg:border-b-0 lg:border-r lg:w-1/2">
                                <div>
                                    <h5 className="max-w-md mb-6 text-xl font-semibold leading-none sm:text-2xl text-slate-700">
                                        {stage.title}
                                    </h5>
                                    <p className="mb-6 text-sm text-gray-700 md:text-base sm:mb-8">
                                        {stage.description}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <Link href={stage.link} className="inline-flex font-patua font-normal items-center justify-center h-12 px-6 mr-6 tracking-wide text-white transition duration-200 rounded bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none">
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    </>)
}

export default LifeStage