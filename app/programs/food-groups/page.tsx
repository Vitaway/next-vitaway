import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout';
import Link from 'next/link';
import React from 'react'

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

    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Program'
                title='Food Groups'
                description='Eating healthily helps us stay at the right weight and lowers the risk of diet-related illness. In this section'
                backgroundImage='https://images.unsplash.com/photo-1529314317205-42e5009e8f08?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                    {foodGroups.map((group, index) => (
                        <div className="bg-white border rounded-lg shadow-sm" key={index}>
                            <div className="p-8">
                                <div>
                                    <h5 className="mb-6 text-xl font-semibold sm:text-xl text-slate-700">{group.title}</h5>
                                    <p className="mb-6 text-gray-700 md:text-lg sm:mb-8 text-sm line-clamp-3">{group.caption}</p>
                                </div>
                                <div className="flex items-center">
                                    <Link href={`/programs/food-groups/groups/${group.slug}`} className="inline-flex text-sm font-normal px-4 py-2 tracking-wide text-white transition duration-200 rounded bg-blue-400 hover:bg-blue-500">
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GuestLayout>
    </>)
}

export default FoodGroup