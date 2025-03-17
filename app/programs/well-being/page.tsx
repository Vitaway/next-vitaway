/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import Image from 'next/image'
import React from 'react'

function WellBeing() {
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Program'
                title='Management Health Issue'
                description='The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.'
                backgroundImage='https://images.unsplash.com/photo-1565128401272-fcdd93cd3dc8?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <section className="content-section">
                <div className="container">
                    <div className="flex items-center justify-center">
                        <div className="col-lg-8">
                            <div className="main-contents">
                                <div className="font-merri font-normal text-gray-900">
                                    <h2>A healthy diet</h2>
                                    <p>
                                        Eating a healthy diet means you’re more likely to keep your body healthy.
                                        Otherwise, you risk various disorders including obesity, type 2 diabetes or
                                        cancer.
                                    </p>

                                    <h2>Overweight and obesity</h2>
                                    <p>
                                        Obesity is being so overweight that it presents a serious threat to your health.
                                        It’s caused by too many calories, and not enough physical activity.
                                        Being overweight or obese increases the risk of developing heart disease, stroke,
                                        high blood pressure, type 2 diabetes and certain types of cancers. Currently,
                                        around two-thirds of adults in Scotland are either overweight or obese.
                                    </p>

                                    <h2>How to discover whether you’re overweight</h2>
                                    <p>
                                        If you’re worried about your weight, you can calculate your BMI (body mass index) using a BMI calculator.
                                    </p>

                                    <h2>How to achieve a healthy weight</h2>
                                    <p>
                                        You’ll be able to keep your weight healthy by following a healthy diet and
                                        staying physically active. Don’t use crash diets, but make small, permanent
                                        changes to the food you eat.
                                    </p>

                                    <h2>Illnesses related to diet</h2>
                                    <p>
                                        A poor diet – too much fat, not enough fibre and fruit and vegetables, or
                                        drinking too much alcohol – can cause a number of illnesses.
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
                        <Image width={100} height={100} src="https://images.unsplash.com/photo-1631049123177-37356471f3dd?auto=format&fit=crop&q=80&w=2823&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cancer" className="object-cover w-full lg:absolute h-80 lg:h-full" />
                        <svg className="absolute top-0 right-0 hidden h-full text-white lg:inline-block" viewBox="0 0 20 104" fill="currentColor">
                            <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104"></polygon>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
                        <p className="mb-5">
                            <h3 className="font-patua font-normal text-lg leading-6 mb-2">Cancer</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Cancer is the most common cause of death in Scotland.
                            </p>
                            <p className="text-gray-800 leading-6 text-justify">
                                Around 40% of cancers are preventable through lifestyle changes,
                                inlcuding eating a healthy diet, achiving and maintaining a healthy
                                weight, being active, not smoking and avoiding drinking more alcohol
                                than is recommended.
                            </p>

                            <h3 className="font-patua font-normal text-lg leading-6 mb-2 mt-3">Red meat and bowel cancer</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Eating lots of red meat (such as beef, lamb and pork) and processed meats
                                (such as meat products such as sausages and ham) increases the risk of bowel cancer.
                                Adults should eat no more than 70g a day, which is the same as around 2 slices of roast
                                meat. You can find out more in our section on a healthy diet.
                            </p>

                            <h3 className="font-patua font-normal text-lg leading-6 mb-2 mt-3">Alcohol and cancer</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Reducing the amount of alcohol you drink can help you prevent cancer.
                                Current recommendations are that consumption should be limited to no more than 14 units of alcohol per week for men and women.
                            </p>
                            <p className="text-gray-800 leading-6 text-justify">
                                One unit is the amount of pure alcohol in a 25ml measure of spirits, a third of a pint of beer, or half a 175ml glass of red wine.
                            </p>

                            <h3 className="font-patua font-normal text-lg leading-6 mb-2 mt-3">Body weight and cancer</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Being overweight increases the risk of 13 different types of cancer,
                                including 2 of the most common types of cancer (breast and bowel cancers)
                                and 3 of the hardest to treat (pancreatic, oesophageal and gallbladder cancers).
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
                                    <h2>Types of diabetes</h2>
                                    <p>
                                        There are two types of diabetes, Type 1 and Type 2.
                                        Type 1 develops when cells in the pancreas that produce insulin are destroyed.
                                        This type of diabetes is treated with insulin, a hormone that regulates the blood.
                                    </p>

                                    <h2>Type 2 diabetes</h2>
                                    <p className="mt-2">
                                        Type 2 diabetes occurs when the body doesn't produce enough of the hormone insulin to function properly,
                                        or the body's cells don't react to it.  It can cause high blood glucose levels which can cause damage to
                                        the body. If left untreated, type 2 diabetes can have serious consequences including kidney, eye and foot
                                        damage, hearing impairment and heart and blood vessel disease which can result in limb amputations.
                                        Being overweight or obese or drinking lots of sugary drinks increases the risk of developing type 2 diabetes.
                                        The majority of type 2 diabetics in Scotland are overweight or obese.
                                    </p>

                                    <p className="mt-2">
                                        Eating a healthy diet, achieving and maintaining a healthy weight and being active can reduce the risk of developing
                                        type 2 diabetes. More information on diabetes and maintaining a healthy diet can be found on diabetes.org.
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    </>)
}

export default WellBeing