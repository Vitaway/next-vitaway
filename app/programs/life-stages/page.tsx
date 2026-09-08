import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import React from 'react';
import lifestages from '../../../content/life-stages.json';
import SectionCard from '@/app/components/sections/section-card'
import PressButton from '@/app/components/buttons/press-button'

function LifeStage() {
    return (
        <GuestLayout>
            <PageHeader
                title={<>Life <span className="font-accent">stages</span></>}
                description='Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness.'
                backgroundImage='https://images.unsplash.com/photo-1534768654272-e97681c3a2c7?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <div className="grid gap-4 md:grid-cols-3">
                        {lifestages.map((stage, index) => (
                            <div key={index} className="flex flex-col justify-between rounded-[24px] bg-[#F6F3EE] p-6 sm:p-8">
                                <div>
                                    <h2 className="text-xl font-bold text-[#003E48] sm:text-2xl">
                                        {stage.title}
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-[#003E48]/70 sm:text-base">
                                        {stage.description}
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <PressButton href={stage.link} size="sm">
                                        Read More
                                    </PressButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionCard>
        </GuestLayout>
    )
}

export default LifeStage
