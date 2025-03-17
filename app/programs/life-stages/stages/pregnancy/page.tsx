/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import Image from 'next/image'
import React from 'react'

function Pregnancy() {
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Program'
                title='Pregnancy'
                description='Making healthy food choices along with regular physical activity will help fuel your baby’s growth and keep you healthy during pregnancy and while you are breastfeeding.'
                backgroundImage='https://images.unsplash.com/photo-1457342813143-a1ae27448a82?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <section className="content-section">
                <div className="container">
                    <div className="flex items-center justify-center">
                        <div className="col-lg-8">
                            <div className="main-contents">
                                <div className="font-merri font-normal text-gray-900">
                                    <p>
                                        Eating well during pregancy and while breastfeeding has health benefits for you and your baby.
                                    </p>
                                    <p>
                                        VITAWAY E-Clinic is a great source of information if you are pregnant, trying to get pregnant or breastfeeding. They have lots of tips to give your child a great start in life by offering a healthy balanced diet which will support their developing bodies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="px-4 py-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
                <div className="flex flex-col max-w-screen-lg overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
                    <div className="relative lg:w-1/2">
                        <Image width={100} height={100} src="https://images.unsplash.com/photo-1454334281609-87a89762912c?auto=format&fit=crop&q=80&w=2785&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eat Healthy" className="object-cover w-full lg:absolute h-80 lg:h-full" />
                        <svg className="absolute top-0 right-0 hidden h-full text-white lg:inline-block" viewBox="0 0 20 104" fill="currentColor">
                            <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104"></polygon>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
                        <p className="mb-5">
                            <h3 className="font-patua font-normal text-lg leading-6 mb-2">Eat Healthy</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Fruits, vegetables, whole grains, protein foods, and fat-free or low-fat dairy products are healthy choices.
                                Include a variety of protein foods such as seafood, lean meats, poultry, beans, peas, lentils, nuts, and eggs.
                                Limit foods and beverages higher in added sugars, saturated fat, and sodium. Eating seafood during pregnancy may
                                benefit your baby's growth and is a healthy protein source for you during both pregnancy and while breastfeeding.
                                Choose options lower in methylmercury, like cod, salmon, tilapia, or herring.
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
                                    <h2>Make Safe Choices</h2>
                                    <ul>
                                        <li className="mb-3">
                                            <b>Food Safety During Pregnancy</b> <br />
                                            You and your unborn child are more susceptible to the effects of foodborne illnesses. Take special care to keep foods safe and to avoid certain foods that increase your risk.
                                            <ul className="ml-4">
                                                <li>
                                                    During pregnancy, make sure that seafood, meat, poultry, or eggs have been cooked to the recommended safe minimum internal temperatures.
                                                </li>
                                                <li>oAvoid consuming unpasteurized (raw) juice or milk, raw sprouts, or some soft cheeses made from unpasteurized milk.</li>
                                                <li>Reheat deli and luncheon meats and hot dogs to steaming hot or 165°F.</li>
                                                <li>More information is available at CDC's Maternal Diet webpage.</li>
                                            </ul>
                                        </li>
                                        <li className="mb-3">
                                            <b>Food Allergies in Your Child</b> <br />
                                            When making food and beverage choices, unless you are advised by your healthcare provider, you do not need to restrict your choices during pregnancy or while breastfeeding to prevent food allergies from developing in your child.
                                        </li>
                                        <li className="mb-3">
                                            <b>Alcohol</b> <br />
                                            Pregnant women and women who may become pregnant should not drink alcohol. Drinks containing alcohol include beer, wine, liquor, mixed drinks, malt beverages, etc. No amount of alcohol is safe for your baby when you are pregnant. Talk with your doctor before considering drinking alcohol while you are breastfeeding. No alcohol consumption is the safest option.
                                        </li>
                                        <li className="mb-3">
                                            <b>Caffeine</b> <br />
                                            Caffeine is found in coffee, tea, and soda. Consult your healthcare provider for advice about consuming caffeine during pregnancy and while you are breastfeeding.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    </>)
}

export default Pregnancy