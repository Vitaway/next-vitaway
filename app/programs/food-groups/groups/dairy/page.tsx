/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import React from 'react'

function Diary() {
  return (<>
    <GuestLayout>
      <PageHeader
        sup_title='Food Groups'
        title='What is Dairy group'
        description='Vegetables and fruits are an important part of a healthy diet, and variety is as important as quantity.'
        backgroundImage='https://plus.unsplash.com/premium_photo-1683141058830-bf7feb63212c?auto=format&fit=crop&q=80&w=2944&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />

      <section className="px-20 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-32 lg:px-28 lg:py-20">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="col-lg-8">
              <div className="main-contents">
                <div className="font-merri font-normal text-gray-900">
                  <p className='my-8'>
                    Dairy and dairy alternatives are good sources of protein and vitamins. They also contain calcium, which helps keep our bones healthy and strong. Semi-skimmed, skimmed, and 1% fat milk all contain less fat than full-fat milk, but still give you protein, vitamins and calcium.
                  </p>
                  <p className='my-8'>
                    Dairy-free milk alternatives include soya milk and nut milks – if you chose dairy-free milk then go for unsweetened varieties which have been fortified with calcium.
                  </p>

                  <h2 className='text-2xl font-semibold mt-5'>
                    How much should I eat from Dairy group
                  </h2>
                  <p className='my-8'>
                    The amount of dairy you need depends on your age, sex, height, weight, and level of physical activity. For women, the amount can also depend on whether you are pregnant or breastfeeding.
                  </p>
                  <p className='my-8'>
                    In general, 1 cup of milk, yogurt, or soy milk, or 1 ½ ounces of natural cheese can be considered as 1 cup from the Dairy Group. The table below lists specific amounts that count as 1 cup in the Dairy Group towards your daily recommended intake.
                  </p>


                  <h2 className='text-2xl font-semibold mt-5'>
                    Daily dairy tables
                  </h2>
                  <p className='my-8'>These are general recommendations by age</p>
                  <table className="table-auto items-center bg-transparent w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Daily Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="">
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-patua font-normal">Toddlers</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">12 to 23 months</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1⅔ to 2 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={3}>Children</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2-3 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 to 2½ cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">4-8 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2½ cups</td>
                      </tr>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={2}>Girls</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">9-13 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">14-18 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={2}>Boys</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">9-13 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">14-18 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={3}>Women</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">19-30 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">31-59 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">60+ yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={3}>Men</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">19-30 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">31-59 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">3 cups</td>
                      </tr>
                      <tr>
                        <td>60+ yrs</td>
                        <td>3 cups</td>
                      </tr>
                    </tbody>
                  </table>

                  <h4 className="mt-5">Cup of dairy table</h4>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"> </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Amount That Counts as 1 Cup in the Dairy Group</th>
                      </tr>
                    </thead>
                    <tbody>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={5}>Milk</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 cup milk</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 half-pint container milk</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">½ cup evaporated milk</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 cup calcium-fortified soy milk</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 half-pint container calcium-fortified soy milk</td>
                      </tr>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">Yogurt</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 cup yogurt (dairy or fortified soy)</td>
                      </tr>

                      <tr>
                        <td className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={7}>Cheese</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 ½ ounces hard cheese (cheddar, mozzarella, Swiss, Parmesan)</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">⅓ cup shredded cheese</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 ounce processed cheese (American)</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">½ cup ricotta cheese</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 ¼ cup cottage cheese</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 ounces Queso fresco</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 slices Queso blanco</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2 className='text-2xl font-semibold mt-5'>
                    Health benefit of Dairy group
                  </h2>
                  <p className='my-8'>
                    Consuming dairy products provides health benefits — especially building and maintaining strong bones. Foods in the Dairy Group provide nutrients that are vital for health and maintenance of your body. These nutrients include calcium, potassium, vitamin D, and protein.
                  </p>
                  <p className='my-8'>
                    Calcium and vitamin D are important nutrients at any age. Intake of dairy products that contain these nutrients help to:
                  </p>
                  <ul className='my-4 list-disc list-inside'>
                    <li>Improve bone health especially in children and adolescents, when bone mass is being built.</li>
                    <li>Promote bone health and prevent the onset of osteoporosis in adults, most of whom do not get enough of these nutrients.</li>
                  </ul>

                  <h2 className='text-2xl font-semibold mt-5'>Nutrients </h2>
                  <ul className='my-4 list-disc list-inside'>
                    <li>
                      The dairy group provides essential nutrients, including calcium, phosphorus, vitamin A, vitamin D (in fortified products), riboflavin, vitamin B12, protein, potassium, zinc, choline, magnesium, and selenium.
                    </li>
                    <li>
                      Calcium is crucial for building and maintaining strong bones and teeth throughout life. Dairy products are the primary source of calcium in many diets.
                    </li>
                    <li>
                      Potassium, which many people lack in their diets, helps maintain healthy blood pressure. Dairy products like milk, yogurt, and fortified soy milk are excellent sources of potassium.
                    </li>
                    <li>
                      Vitamin D supports the body's ability to maintain proper levels of calcium and phosphorus, aiding in bone health. Fortified milk, soy milk, and certain fish like salmon are good sources of vitamin D.
                    </li>
                    <li>
                      Low-fat or fat-free dairy products provide essential nutrients while containing minimal saturated fat, making them a healthier choice.
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

export default Diary