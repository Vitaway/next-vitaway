import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import SectionCard from '@/app/components/sections/section-card'
import Image from 'next/image'
import React from 'react'

function Adult() {
    return (
        <GuestLayout>
            <PageHeader
                title={<>Adult: managing a healthy <span className="font-accent">weight</span></>}
                description='The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.'
                backgroundImage='https://images.unsplash.com/photo-1534954553104-88cb75be7648?auto=format&fit=crop&q=80&w=2960&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <h2 className="text-[#003E48]">Managing a healthy weight</h2>
                    <p>Being overweight can make it harder to get around and increase your risk of heart disease and type 2 diabetes. Equally, any sudden loss of weight can also indicate a health problem. Talk to your GP if you’re worried about your weight.</p>
                    <p>The Eatwell Guide has lots of information about how to have a healthy, balanced diet. If you have any special dietary requirements or medical needs, talk to your GP or a registered dietician about adapting the Eatwell guidelines.</p>
                </div>
            </SectionCard>

            <SectionCard className="bg-[#F6F3EE]">
                <div className="flex flex-col overflow-hidden rounded-[24px] lg:flex-row">
                    <div className="relative h-80 lg:min-h-[400px] lg:w-1/2 lg:h-auto">
                        <Image fill sizes="(min-width: 1024px) 50vw, 100vw" src="https://images.unsplash.com/photo-1675179181234-aa537607528b?auto=format&fit=crop&q=80&w=2926&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Getting enough to drink" className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
                        <h3 className="text-lg font-bold text-[#003E48]">Getting enough to drink</h3>
                        <p className="mt-3 leading-relaxed text-[#003E48]/70">Even if you don’t feel thirsty, your body needs water. Signs of dehydration include:</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-[#003E48]/70">
                            <li>darker urine than usual or not passing much urine when you go to the toilet</li>
                            <li>headaches</li>
                            <li>feeling confused or irritable, or finding it hard to concentrate.</li>
                        </ul>

                        <h2 className="mt-6 text-lg font-bold text-[#003E48]">Losing your appetite</h2>
                        <p className="mt-3 leading-relaxed text-[#003E48]/70">
                            As we get older, our appetite can decrease. Even if you don’t feel like eating,
                            it’s still important to have a healthy balanced diet to get all the energy and
                            nutrients you need.
                        </p>
                        <p className="mt-3 leading-relaxed text-[#003E48]/70">
                            If you are underweight and your appetite has decreased, try not to fill up on
                            foods that are high in saturated fat or sugar like cakes, biscuits and sugary
                            drinks.
                        </p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <h2 className="text-[#003E48]">Staying active</h2>
                    <p>Physical activity helps you stay healthy, mobile and independent.
                        It also helps keep the heart healthy and lowers the risk of heart disease and stroke.
                        Keeping active can also improve your appetite.</p>
                    <p>
                        If you’re underweight, have mobility problems or a disability talk to your GP or
                        practice nurse before starting any physical activity.
                    </p>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default Adult
