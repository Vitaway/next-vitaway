/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import SectionCard from '@/app/components/sections/section-card'
import Image from 'next/image'
import React from 'react'

function Pregnancy() {
    return (
        <GuestLayout>
            <PageHeader
                title={<>Eating well in <span className="font-accent">pregnancy</span></>}
                description='Making healthy food choices along with regular physical activity will help fuel your baby’s growth and keep you healthy during pregnancy and while you are breastfeeding.'
                backgroundImage='https://images.unsplash.com/photo-1457342813143-a1ae27448a82?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <p>
                        Eating well during pregancy and while breastfeeding has health benefits for you and your baby.
                    </p>
                    <p>
                        VITAWAY E-Clinic is a great source of information if you are pregnant, trying to get pregnant or breastfeeding. They have lots of tips to give your child a great start in life by offering a healthy balanced diet which will support their developing bodies.
                    </p>
                </div>
            </SectionCard>

            <SectionCard className="bg-[#F6F3EE]">
                <div className="flex flex-col overflow-hidden rounded-[24px] lg:flex-row">
                    <div className="relative h-80 lg:min-h-[400px] lg:w-1/2 lg:h-auto">
                        <Image fill sizes="(min-width: 1024px) 50vw, 100vw" src="https://images.unsplash.com/photo-1454334281609-87a89762912c?auto=format&fit=crop&q=80&w=2785&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eat Healthy" className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
                        <h3 className="text-lg font-bold text-[#003E48]">Eat Healthy</h3>
                        <p className="mt-3 leading-relaxed text-[#003E48]/70">
                            Fruits, vegetables, whole grains, protein foods, and fat-free or low-fat dairy products are healthy choices.
                            Include a variety of protein foods such as seafood, lean meats, poultry, beans, peas, lentils, nuts, and eggs.
                            Limit foods and beverages higher in added sugars, saturated fat, and sodium. Eating seafood during pregnancy may
                            benefit your baby's growth and is a healthy protein source for you during both pregnancy and while breastfeeding.
                            Choose options lower in methylmercury, like cod, salmon, tilapia, or herring.
                        </p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <h2 className="text-[#003E48]">Make Safe Choices</h2>
                    <ul>
                        <li>
                            <b>Food Safety During Pregnancy</b> <br />
                            You and your unborn child are more susceptible to the effects of foodborne illnesses. Take special care to keep foods safe and to avoid certain foods that increase your risk.
                            <ul>
                                <li>
                                    During pregnancy, make sure that seafood, meat, poultry, or eggs have been cooked to the recommended safe minimum internal temperatures.
                                </li>
                                <li>oAvoid consuming unpasteurized (raw) juice or milk, raw sprouts, or some soft cheeses made from unpasteurized milk.</li>
                                <li>Reheat deli and luncheon meats and hot dogs to steaming hot or 165°F.</li>
                                <li>More information is available at CDC's Maternal Diet webpage.</li>
                            </ul>
                        </li>
                        <li>
                            <b>Food Allergies in Your Child</b> <br />
                            When making food and beverage choices, unless you are advised by your healthcare provider, you do not need to restrict your choices during pregnancy or while breastfeeding to prevent food allergies from developing in your child.
                        </li>
                        <li>
                            <b>Alcohol</b> <br />
                            Pregnant women and women who may become pregnant should not drink alcohol. Drinks containing alcohol include beer, wine, liquor, mixed drinks, malt beverages, etc. No amount of alcohol is safe for your baby when you are pregnant. Talk with your doctor before considering drinking alcohol while you are breastfeeding. No alcohol consumption is the safest option.
                        </li>
                        <li>
                            <b>Caffeine</b> <br />
                            Caffeine is found in coffee, tea, and soda. Consult your healthcare provider for advice about consuming caffeine during pregnancy and while you are breastfeeding.
                        </li>
                    </ul>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default Pregnancy
