import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import React from 'react'

function Child() {
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Program'
                title='Childhood: Eating healthily'
                description='Childhood is a great time to start laying the foundations for a life-long healthy diet with plenty of fruit and vegetables, starchy foods and lean'
                backgroundImage='https://plus.unsplash.com/premium_photo-1664047696183-b6cb3252dbec?auto=format&fit=crop&q=80&w=2942&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <section className="px-20 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-32 lg:px-28 lg:py-20">
                <div className="container">
                    <div className="flex items-center justify-center">
                        <div className="col-lg-8">
                            <div className="main-contents">
                                <div className="font-merri font-normal text-gray-900">
                                    <h2 className='text-2xl font-semibold mt-5'>Strong bones</h2>
                                    <p className='my-4'>
                                        We need to develop strong bones when we’re young to help protect against bone diseases
                                        like osteoporosis later on in life. Bones grow throughout childhood – the fastest growth
                                        happens when children are very young, then again when they go through puberty.
                                        Children need enough calcium and vitamin D in their diet to build strong bones.
                                    </p>

                                    <h2 className='text-2xl font-semibold mt-5'>Sugar</h2>
                                    <p className='my-4'>
                                        We should only eat a small amount of sugar to stay a healthy weight and look after our teeth.
                                        It’s particularly important to cut down on free sugar – that’s the sugar added to food and drink
                                        as well as the sugar found in things like honey, syrup, fruit juices and smoothies.
                                    </p>
                                    <p className='my-4'>
                                        Sugary drinks are one of the main sources of free sugar in our diet and we know that teenagers often
                                        drink a lot of them. Just one can of cola can contain as much as seven cubes of sugar – that’s as
                                        much sugar as an adult should consume in a whole day.
                                    </p>
                                    <p className='my-4'>
                                        Encourage children and young people to swap sugary drinks for diet, sugar-free and no added sugar drinks
                                        as well as water and milk. Remember, fruit juices and smoothies contain a lot of sugar, so limit them
                                        to one small glass (around 150ml) each day.
                                    </p>

                                    <h2 className='text-2xl font-semibold mt-5'>Salt</h2>
                                    <p className='my-4'>
                                        We only need a small amount of salt – the maximum recommended for everyone over the age of 11 is just 6g per day.
                                        Children under 11 need even less - the amount per day depends on age:
                                    </p>
                                    <p className='my-4'>
                                        1 to 3 years: 2g a day (0.8g sodium)
                                        4 to 6 years: 3g a day (1.2g sodium)
                                        7 to 10 years: 5g a day (2g sodium)
                                    </p>

                                    <h2 className='text-2xl font-semibold mt-5'>Fish</h2>
                                    <p className='my-4'>
                                        Aim to eat two portions of fish every week, including one portion of oil-rich fish like salmon,
                                        mackerel or herring. Children shouldn’t eat swordfish, shark or marlin because it contains more mercury
                                        than other types of fish which can be harmful to their developing nervous system.
                                    </p>
                                    <p className='my-4'>
                                        Boys can eat up to four portions of oil-rich fish per week but girls should have no more than two portions.
                                        This is because the low level of pollutants in oil-rich fish could build up in their bodies and harm an
                                        unborn baby during any future pregnancies
                                    </p>
                                    <p className='my-4'>
                                        Don’t give raw shellfish to children – there’s a risk of food poisoning
                                    </p>
                                    <p className='my-4'>
                                        A healthy lunch
                                        School lunches are a great choice but if your child prefers a packed lunch there are lots of ways to make it a healthy option.
                                    </p>
                                    <ul className='my-4 list-disc list-inside'>
                                        <li>Base lunch around starchy carbohydrates like bread, potatoes, rice or pasta. It doesn’t always have to be a sandwich, why not try a pasta salad instead?</li>
                                        <li>Include fruit and veg, like a piece of fruit, some carrot or cucumber sticks or veggie soup</li>
                                        <li>Add some protein: beans, pulses, fish, eggs or lean meat. Tuna makes a great sandwich filler</li>
                                        <li>Use low-fat and low-sugar dairy foods – you could add a pot of low-fat natural yogurt with chopped whole fruit</li>
                                        <li>Remember sugary drinks have no place in a children’s diet – instead choose water, lower fat milk or sugar-free drinks</li>
                                    </ul>

                                    <h2 className='text-2xl font-semibold mt-5'>Healthy lunches for older kids</h2>
                                    <p className='my-4'>
                                        Older children and teenagers often go out for lunch during the school day. This makes it harder to make healthy choices, so encourage your child to stay at school for lunch or help them put together a healthy packed lunch.
                                    </p>
                                    <p className='my-4'>
                                        If they do go out for lunch, talk to them about the food they choose. If your child likes to pick up a meal deal encourage them to pick a sandwich with wholemeal bread and choose a sugar-free drink. Encourage them to cut down on the amount of unhealthy snacks they eat too.
                                    </p>
                                    <p className='my-4'>
                                        Some kid’s menus in restaurants are quite limited, but you can always ask for a smaller portion from the main menu.
                                    </p>
                                    <p className='my-4'>
                                        Talk to your children about food labelling and how it can help us make better choices – look out for calorie labelling in cafés, restaurants and takeaways when you’re out together.
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

export default Child