import PageHeader from '@/app/components/headers/page-header'
import Image from 'next/image'
import React from 'react'

function Adult() {
    return (<>
        <PageHeader
            sup_title='Program'
            title='Adult: Managing a healthy weight'
            description='The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.'
            backgroundImage='https://images.unsplash.com/photo-1534954553104-88cb75be7648?auto=format&fit=crop&q=80&w=2960&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        />

        <section className="content-section">
            <div className="container">
                <div className="flex items-center justify-center">
                    <div className="col-lg-8">
                        <div className="main-contents">
                            <div className="font-merri font-normal text-gray-900">
                                <h2>Managing a healthy weight</h2>
                                <p>Being overweight can make it harder to get around and increase your risk of heart disease and type 2 diabetes. Equally, any sudden loss of weight can also indicate a health problem. Talk to your GP if you’re worried about your weight.</p>
                                <p>The Eatwell Guide has lots of information about how to have a healthy, balanced diet. If you have any special dietary requirements or medical needs, talk to your GP or a registered dietician about adapting the Eatwell guidelines.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className="px-4 py-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
            <div className="flex flex-col max-w-screen-lg overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
                <div className="relative lg:w-1/2">
                    <Image width={100} height={100} src="https://images.unsplash.com/photo-1675179181234-aa537607528b?auto=format&fit=crop&q=80&w=2926&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Getting enough to drink" className="object-cover w-full lg:absolute h-80 lg:h-full" />
                    <svg className="absolute top-0 right-0 hidden h-full text-white lg:inline-block" viewBox="0 0 20 104" fill="currentColor">
                        <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104"></polygon>
                    </svg>
                </div>
                <div className="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
                    <p className="mb-5">
                        <h3 className="font-patua font-normal text-lg leading-6 mb-2">Getting enough to drink</h3>
                        <p className="text-gray-800 leading-6 text-justify">Even if you don’t feel thirsty, your body needs water. Signs of dehydration include:</p>
                        <ul>
                            <li>darker urine than usual or not passing much urine when you go to the toilet</li>
                            <li>headaches</li>
                            <li>feeling confused or irritable, or finding it hard to concentrate.</li>
                        </ul>

                        <h2 className="font-patua font-normal text-lg leading-6 mb-2 mt-4">Losing your appetite</h2>
                        <p className="text-gray-800 leading-6 text-justify">
                            As we get older, our appetite can decrease. Even if you don’t feel like eating,
                            it’s still important to have a healthy balanced diet to get all the energy and
                            nutrients you need.
                        </p>
                        <p className="text-gray-800 leading-6 text-justi mt-2">
                            If you are underweight and your appetite has decreased, try not to fill up on
                            foods that are high in saturated fat or sugar like cakes, biscuits and sugary
                            drinks.
                        </p>
                    </p>
                </div>
            </div>
        </div>

        <section className="content-section">
            <div className="container">
                <div className="flex items-center justify-center">
                    <div className="col-lg-8">
                        <div className="main-contents">
                            <div className="font-merri font-normal text-gray-900">
                                <h2>Staying active</h2>
                                <p>Physical activity helps you stay healthy, mobile and independent.
                                    It also helps keep the heart healthy and lowers the risk of heart disease and stroke.
                                    Keeping active can also improve your appetite.</p>
                                <p>
                                    If you’re underweight, have mobility problems or a disability talk to your GP or
                                    practice nurse before starting any physical activity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}

export default Adult