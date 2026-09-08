/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import SectionCard from '@/app/components/sections/section-card'
import Image from 'next/image'
import React from 'react'

function WellBeing() {
    return (
        <GuestLayout>
            <PageHeader
                title={<>Managing health <span className="font-accent">issues</span></>}
                description='The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.'
                backgroundImage='https://images.unsplash.com/photo-1565128401272-fcdd93cd3dc8?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <h2 className="text-[#003E48]">A healthy diet</h2>
                    <p>
                        Eating a healthy diet means you’re more likely to keep your body healthy.
                        Otherwise, you risk various disorders including obesity, type 2 diabetes or
                        cancer.
                    </p>

                    <h2 className="text-[#003E48]">Overweight and obesity</h2>
                    <p>
                        Obesity is being so overweight that it presents a serious threat to your health.
                        It’s caused by too many calories, and not enough physical activity.
                        Being overweight or obese increases the risk of developing heart disease, stroke,
                        high blood pressure, type 2 diabetes and certain types of cancers. Currently,
                        around two-thirds of adults in Scotland are either overweight or obese.
                    </p>

                    <h2 className="text-[#003E48]">How to discover whether you’re overweight</h2>
                    <p>
                        If you’re worried about your weight, you can calculate your BMI (body mass index) using a BMI calculator.
                    </p>

                    <h2 className="text-[#003E48]">How to achieve a healthy weight</h2>
                    <p>
                        You’ll be able to keep your weight healthy by following a healthy diet and
                        staying physically active. Don’t use crash diets, but make small, permanent
                        changes to the food you eat.
                    </p>

                    <h2 className="text-[#003E48]">Illnesses related to diet</h2>
                    <p>
                        A poor diet – too much fat, not enough fibre and fruit and vegetables, or
                        drinking too much alcohol – can cause a number of illnesses.
                    </p>
                </div>
            </SectionCard>

            <SectionCard className="bg-[#F6F3EE]">
                <div className="flex flex-col overflow-hidden rounded-[24px] lg:flex-row">
                    <div className="relative h-80 lg:min-h-[400px] lg:w-1/2 lg:h-auto">
                        <Image fill sizes="(min-width: 1024px) 50vw, 100vw" src="https://images.unsplash.com/photo-1631049123177-37356471f3dd?auto=format&fit=crop&q=80&w=2823&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cancer" className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
                        <h3 className="text-lg font-bold text-[#003E48]">Cancer</h3>
                        <p className="mt-2 leading-relaxed text-[#003E48]/70">
                            Cancer is the most common cause of death in Scotland.
                        </p>
                        <p className="mt-3 leading-relaxed text-[#003E48]/70">
                            Around 40% of cancers are preventable through lifestyle changes,
                            inlcuding eating a healthy diet, achiving and maintaining a healthy
                            weight, being active, not smoking and avoiding drinking more alcohol
                            than is recommended.
                        </p>

                        <h3 className="mt-5 text-lg font-bold text-[#003E48]">Red meat and bowel cancer</h3>
                        <p className="mt-2 leading-relaxed text-[#003E48]/70">
                            Eating lots of red meat (such as beef, lamb and pork) and processed meats
                            (such as meat products such as sausages and ham) increases the risk of bowel cancer.
                            Adults should eat no more than 70g a day, which is the same as around 2 slices of roast
                            meat. You can find out more in our section on a healthy diet.
                        </p>

                        <h3 className="mt-5 text-lg font-bold text-[#003E48]">Alcohol and cancer</h3>
                        <p className="mt-2 leading-relaxed text-[#003E48]/70">
                            Reducing the amount of alcohol you drink can help you prevent cancer.
                            Current recommendations are that consumption should be limited to no more than 14 units of alcohol per week for men and women.
                        </p>
                        <p className="mt-3 leading-relaxed text-[#003E48]/70">
                            One unit is the amount of pure alcohol in a 25ml measure of spirits, a third of a pint of beer, or half a 175ml glass of red wine.
                        </p>

                        <h3 className="mt-5 text-lg font-bold text-[#003E48]">Body weight and cancer</h3>
                        <p className="mt-2 leading-relaxed text-[#003E48]/70">
                            Being overweight increases the risk of 13 different types of cancer,
                            including 2 of the most common types of cancer (breast and bowel cancers)
                            and 3 of the hardest to treat (pancreatic, oesophageal and gallbladder cancers).
                        </p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <h2 className="text-[#003E48]">Types of diabetes</h2>
                    <p>
                        There are two types of diabetes, Type 1 and Type 2.
                        Type 1 develops when cells in the pancreas that produce insulin are destroyed.
                        This type of diabetes is treated with insulin, a hormone that regulates the blood.
                    </p>

                    <h2 className="text-[#003E48]">Type 2 diabetes</h2>
                    <p>
                        Type 2 diabetes occurs when the body doesn't produce enough of the hormone insulin to function properly,
                        or the body's cells don't react to it.  It can cause high blood glucose levels which can cause damage to
                        the body. If left untreated, type 2 diabetes can have serious consequences including kidney, eye and foot
                        damage, hearing impairment and heart and blood vessel disease which can result in limb amputations.
                        Being overweight or obese or drinking lots of sugary drinks increases the risk of developing type 2 diabetes.
                        The majority of type 2 diabetics in Scotland are overweight or obese.
                    </p>

                    <p>
                        Eating a healthy diet, achieving and maintaining a healthy weight and being active can reduce the risk of developing
                        type 2 diabetes. More information on diabetes and maintaining a healthy diet can be found on diabetes.org.
                    </p>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default WellBeing
