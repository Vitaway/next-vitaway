/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout';
import Image from 'next/image'
import React from 'react';

function Program() {
    return (<>
        <GuestLayout>
            <PageHeader
                sup_title='Program'
                title='Eat Well Guide'
                description='The proportions of food groups been updated to take into account the new dietary recommendations for more fiber and less sugar.'
                backgroundImage='https://plus.unsplash.com/premium_photo-1661367955181-af6aa535b604?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />

            <section className="px-20 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-32 lg:px-28 lg:py-20">
                <div className="main-contents">
                    <div className="font-merri font-normal text-gray-900">
                        <p className='my-5'>
                            The Eatwell Guide helps us eat a healthy, balanced diet with plenty of fruit,
                            vegetables and starchy carbohydrates plus some dairy, meat, fish, pulses and other
                            kinds of protein. It replaced eat well plate as the main tool showing you a healthy
                            balanced diet. It no longer represents a ‘plate’ but still shows the proportions of
                            the foods and drinks that make up a healthy diet. The proportions of food groups been
                            updated to take into account the new dietary recommendations for more fiber and less sugar.
                        </p>
                        <p className='my-8'>
                            The recommendations in the Australian Dietary Guidelines and Australian Guide to Healthy Eating
                            help us choose foods for good health and to reduce our risk of chronic health problems.
                            If we are carrying extra weight, the Australian Dietary Guidelines can also help us lose weight.
                            They steer us towards foods that are high in nutrients but lower in kilojoules.
                            These choices are nutrient dense but less energy dense and helpful for both achieving and
                            maintaining a healthy weight.
                        </p>
                        <p className='my-8'>
                            People wanting to lose weight will also find this information useful for planning meals and snacks.
                            Following the recommended number of serves from the Five Food Groups and avoiding the discretionary
                            foods will result in a gradual but healthy weight loss for most people. However, some people, particularly
                            younger men and people who are taller than average or more active, may need additional serves of the five
                            food groups.
                        </p>

                        <h2 className='text-2xl font-semibold'>Eating Regularly</h2>
                        <p className='my-8'>
                            It’s essential for weight control and especially weight loss, to recognise and act on the feedback
                            your body gives you about when and how much you need to eat. However it’s also important to aim for
                            a regular eating pattern of meals, or meals and mid meals.
                            A planned pattern of eating is more likely to include the recommended number of serves from the five
                            food groups. A spontaneous, unstructured eating pattern is more likely to include too many discretionary
                            foods which means too much saturated fat, added sugars, added salt and kilojoules at the expense of fibre
                            and important nutrients.
                        </p>

                        <h2 className='text-2xl font-semibold'>Eat with other people not TV</h2>
                        <p className='my-8'>
                            We also know that people who eat with others and eat at the dining table, are more likely to eat regularly
                            and eat well than those who eat alone or in front of the TV. Meals with others tend to include more foods
                            from the five food groups. For example, people often report that they can’t be bothered cooking vegetables just for themselves.
                        </p>
                        <p className='my-8'>
                            Television watching is associated with eating more discretionary choices like take-away or convenience foods and fewer foods from the five foods.
                            It also makes it much more difficult to recognise and respond to our body’s signals about hunger and satiety.
                            Good meal planning and making healthy choices can sometimes be tricky but a few useful tips can make it easier.
                        </p>
                    </div>
                </div>
            </section>

            <div className="px-4 py-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
                <div className="flex flex-col max-w-screen-lg overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
                    <div className="relative lg:w-1/2">
                        <Image width={500} height={500} src="https://images.unsplash.com/photo-1572357176061-7c96fd2af22f?auto=format&fit=crop&q=80&w=2835&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Building a Healthy and Balanced Diet" className="object-cover w-full lg:absolute h-80 lg:h-full" />
                        <svg className="absolute top-0 right-0 hidden h-full text-white lg:inline-block" viewBox="0 0 20 104" fill="currentColor">
                            <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104"></polygon>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
                        <h5 className="mb-3 text-2xl font-normal sm:text-4xl text-slate-700">
                            Building a Healthy and Balanced Diet
                        </h5>
                        <p className="mb-5">
                            <h3 className="text-slate-700 font-semibold text-lg leading-6 mb-2">Make most of your meal vegetables and fruits – ½ of your plate.</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Aim for color and variety, and remember that potatoes don’t count as
                                vegetables on the Healthy Eating Plate because of their negative impact
                                on blood sugar.
                            </p>
                            <h3 className="mt-4 text-slate-700 font-semibold text-lg leading-6 mb-2">Go for whole grains – ¼ of your plate</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Whole and intact grains—whole wheat, barley, wheat berries,
                                quinoa, oats, brown rice, and foods made with them, such as
                                whole wheat pasta—have a milder effect on blood sugar and
                                insulin than white bread, white rice, and other refined grains.
                            </p>
                            <h3 className="mt-4 text-slate-700 font-semibold text-lg leading-6 mb-2">Protein power – ¼ of your plate.</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Fish, poultry, beans, and nuts are all healthy, versatile protein
                                sources—they can be mixed into salads, and pair well with vegetables
                                on a plate. Limit red meat, and avoid processed meats such as bacon
                                and sausage.
                            </p>
                            <h3 className="mt-4 text-slate-700 font-semibold text-lg leading-6 mb-2">Healthy plant oils – in moderation</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Choose healthy vegetable oils like olive, canola, soy, corn, sunflower,
                                peanut, and others, and avoid partially hydrogenated oils, which contain
                                unhealthy trans fats. Remember that low-fat does not mean “healthy.”
                            </p>
                            <h3 className="mt-4 text-slate-700 font-semibold text-lg leading-6 mb-2">Drink water, coffee, or tea.</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                Skip sugary drinks, limit milk and dairy products to one to two servings per day,
                                and limit juice to a small glass per day.
                            </p>
                            <h3 className="mt-4 text-slate-700 font-semibold text-lg leading-6 mb-2">Stay active.</h3>
                            <p className="text-gray-800 leading-6 text-justify">
                                The red figure running across the Healthy Eating Plate’s placemat is a
                                reminder that staying active is also important in weight control.
                            </p>
                        </p>
                    </div>
                </div>
            </div>

            <section className="px-20 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-32 lg:px-28 lg:py-20">
                <div className="main-contents">
                    <div className="font-merri font-normal text-gray-900">
                        <h2 className='text-2xl font-semibold'>The main message of the Healthy Eating Plate is to focus on diet quality:</h2>

                        <ul className=''>
                            <li>
                                The type of carbohydrate in the diet is more important than the amount of carbohydrate in the diet, because some sources of carbohydrate—like vegetables (other than potatoes), fruits, whole grains, and beans—are healthier than others.
                            </li>
                            <li>
                                The Healthy Eating Plate also advises consumers to avoid sugary beverages, a major source of calories—usually with little nutritional value—in the American diet.
                            </li>
                            <li>
                                The Healthy Eating Plate encourages consumers to use healthy oils, and it does not set a maximum on the percentage of calories people should get each day from healthy sources of fat. In this way, the Healthy Eating Plate recommends the opposite of the low-fat message promoted for decades by the USDA.
                            </li>
                        </ul>

                        <h2 className='text-2xl font-semibold mt-5'>Healthy Eating: Changing Your Eating Habits</h2>
                        <p className='my-8'>
                            The food you eat can affect your health and your risk for certain diseases.
                            To eat healthier food, you may need to change some of your daily habits.
                            You also may need to change some things in your environment.
                            Your environment includes everything around you,
                            like your home or the place you work.
                            You don&apos;t need to make huge changes to eat healthier.
                            And you don&apos;t have to change your habits all at the same time. It&apos;s best to set
                            small goals and change your habits a little bit at a time. Over time, small changes
                            can make a big difference in your health.
                        </p>
                        <p className='my-8'>This information will help you make useful changes for healthy eating.</p>
                        <ul className="mt-2">
                            <li>Changing your eating habits and your environment can help you eat healthier foods.</li>
                            <li>A healthy diet is good for your overall health. It also can help you reach a healthy weight and stay there.</li>
                            <li>To improve your eating habits, it&apos;s best to make small lifestyle changes that you can keep doing over time.</li>
                        </ul>

                        <h2 className='text-2xl font-semibold mt-5'>How can you change your eating habits?</h2>
                        <p className='my-8'>
                            To eat a healthy diet, you may need to make some changes. Remember that you can change your eating habits a little bit at a time. Small changes are easier to make and can lead to better health.
                            Here are some ways to make healthy changes in your eating habits:
                        </p>
                        <ul className="mt-2">
                            <li>Keep more fruits, low-fat dairy products (low-fat milk and low-fat yogurt), vegetables, and whole-grain foods at home and at work. Focus on adding healthy food to your diet, rather than just taking unhealthy foods away</li>
                            <li>Try to eat a family meal every day at the kitchen or dining table. This will help you focus on eating healthy meals.</li>
                            <li>Buy a healthy-recipe book, and cook for yourself. Chew gum when you cook so you won't be tempted to snack on the ingredients.</li>
                            <li>Pack a healthy lunch and snacks for work. This lets you have more control over what you eat.</li>
                            <li>Put your snacks on a plate instead of eating from the package. This helps you control how much you eat.</li>
                            <li>Don&apos;t skip or delay meals, and be sure to schedule your snacks. If you ignore your feelings of hunger, you may end up eating too much or choosing an unhealthy snack. If you often feel too hungry, it can cause you to focus a lot on food.</li>
                            <li>Eat your meals with others when you can. Relax and enjoy your meals, and don&apos;t eat too fast. Try to make healthy eating a pleasure, not a chore.</li>
                            <li>Drink water instead of high-sugar drinks (including high-sugar juice drinks).</li>
                        </ul>
                    </div>
                </div>
            </section>
        </GuestLayout>
    </>)
}

export default Program