import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import Link from 'next/link'
import React from 'react'

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
                    <div className="flex flex-col justify-between p-5 border-b sm:p-10 lg:border-b-0 lg:border-r lg:w-1/2">
                        <div>
                            <h5 className="max-w-md mb-6 text-xl font-patua font-normal leading-none sm:text-2xl">
                                Adult People
                            </h5>
                            <p className="mb-6 text-base text-gray-700 md:text-lg sm:mb-8">
                                Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Link href="/programs/life-stages/stages/adult">
                                <button type="submit" className="inline-flex font-patua font-normal items-center justify-center h-12 px-6 mr-6 tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-400 hover:bg-indigo-500 focus:shadow-outline focus:outline-none">
                                    Read More
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between p-5 sm:p-10 lg:w-1/2">
                        <div>
                            <h5 className="max-w-md mb-6 text-xl font-patua font-normal leading-none sm:text-2xl">
                                Children
                            </h5>
                            <p className="mb-6 text-base text-gray-700 md:text-lg sm:mb-8">
                                Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Link href="/programs/life-stages/stages/children">
                                <button type="submit" className="inline-flex font-patua font-normal items-center justify-center h-12 px-6 mr-6 tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-400 hover:bg-indigo-500 focus:shadow-outline focus:outline-none">
                                    Read More
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between p-5 sm:p-10 lg:w-1/2">
                        <div>
                            <h5 className="max-w-md mb-6 text-xl font-patua font-normal leading-none sm:text-2xl">
                                Pregnancy
                            </h5>
                            <p className="mb-6 text-base text-gray-700 md:text-lg sm:mb-8">
                                Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Link href="/programs/life-stages/stages/pregnancy">
                                <button type="submit" className="inline-flex font-patua font-normal items-center justify-center h-12 px-6 mr-6 tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-400 hover:bg-indigo-500 focus:shadow-outline focus:outline-none">
                                    Read More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </GuestLayout>
    </>)
}

export default LifeStage