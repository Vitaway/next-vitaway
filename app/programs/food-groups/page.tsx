import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout';
import React from 'react'
import SectionCard from '@/app/components/sections/section-card'
import PressButton from '@/app/components/buttons/press-button'

function FoodGroup() {
    const foodGroups = [
        {
            title: "Vegatables food group",
            slug: 'vegetables',
            caption: "There is strong evidence that for each serve of vegetables eaten each day the risk of coronary heart disease is reduced even further!  Also, by eating vegetables, especially colourful vegetables, there is a reduced risk of stroke and weight gain."
        },
        {
            title: 'What is Dairy group',
            slug: "dairy",
            caption: "Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active."
        },
        {
            title: "Grains Starch food",
            slug: "grains-starch",
            caption: 'Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active.'
        },
        {
            title: "Proteins food group",
            slug: 'proteins-food',
            caption: "Did you know that adult males need to eat less red meat? Yet many children and some women may need to eat more?"
        },
        {
            title: "Fruit and vegetables",
            slug: 'fruit',
            caption: "Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active."
        },
        {
            title: "What is MyPlate",
            slug: "myplate",
            caption: "Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active."
        },
        {
            title: "Hydration",
            slug: "hydration",
            caption: "Our advice covers everything from getting the right amount of healthy food and cutting down on fat, salt and sugar to hydration and staying active."
        }
    ];

    return (
        <GuestLayout>
            <PageHeader
                title={<>Food <span className="font-accent">groups</span></>}
                description='Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness. In this section'
                backgroundImage='https://images.unsplash.com/photo-1529314317205-42e5009e8f08?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {foodGroups.map((group, index) => (
                            <div className="flex flex-col justify-between rounded-[24px] bg-[#F6F3EE] p-6 sm:p-8" key={index}>
                                <div>
                                    <h2 className="text-xl font-bold text-[#003E48]">{group.title}</h2>
                                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#003E48]/70 sm:text-base">{group.caption}</p>
                                </div>
                                <div className="mt-6">
                                    <PressButton href={`/programs/food-groups/groups/${group.slug}`} size="sm">
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

export default FoodGroup
