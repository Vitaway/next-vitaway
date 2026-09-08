/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import SectionCard from '@/app/components/sections/section-card'
import React from 'react'

const thClass = 'border-b border-[#003E48]/15 py-3 pr-4 text-left text-sm font-semibold text-[#003E48]'
const tdClass = 'border-b border-[#003E48]/10 py-3 pr-4 text-sm text-[#003E48]/70'

function Diary() {
  return (
    <GuestLayout>
      <PageHeader
        title={<>What is the <span className="font-accent">dairy</span> group</>}
        description='Vegetables and fruits are an important part of a healthy diet, and variety is as important as quantity.'
        backgroundImage='https://plus.unsplash.com/premium_photo-1683141058830-bf7feb63212c?auto=format&fit=crop&q=80&w=2944&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />

      <SectionCard className="bg-white py-12 sm:py-16">
        <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
          <p>
            Dairy and dairy alternatives are good sources of protein and vitamins. They also contain calcium, which helps keep our bones healthy and strong. Semi-skimmed, skimmed, and 1% fat milk all contain less fat than full-fat milk, but still give you protein, vitamins and calcium.
          </p>
          <p>
            Dairy-free milk alternatives include soya milk and nut milks – if you chose dairy-free milk then go for unsweetened varieties which have been fortified with calcium.
          </p>

          <h2 className="text-[#003E48]">
            How much should I eat from Dairy group
          </h2>
          <p>
            The amount of dairy you need depends on your age, sex, height, weight, and level of physical activity. For women, the amount can also depend on whether you are pregnant or breastfeeding.
          </p>
          <p>
            In general, 1 cup of milk, yogurt, or soy milk, or 1 ½ ounces of natural cheese can be considered as 1 cup from the Dairy Group. The table below lists specific amounts that count as 1 cup in the Dairy Group towards your daily recommended intake.
          </p>


          <h2 className="text-[#003E48]">
            Daily dairy tables
          </h2>
          <p>These are general recommendations by age</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className={thClass}>Daily Recommendation</th>
                  <th className={thClass}></th>
                  <th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdClass}>Toddlers</td>
                  <td className={tdClass}>12 to 23 months</td>
                  <td className={tdClass}>1⅔ to 2 cups</td>
                </tr>
                <tr>
                  <td className={tdClass} rowSpan={3}>Children</td>
                  <td className={tdClass}>2-3 yrs</td>
                  <td className={tdClass}>2 to 2½ cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>4-8 yrs</td>
                  <td className={tdClass}>2½ cups</td>
                </tr>

                <tr>
                  <td className={tdClass} rowSpan={2}>Girls</td>
                  <td className={tdClass}>9-13 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>14-18 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>

                <tr>
                  <td className={tdClass} rowSpan={2}>Boys</td>
                  <td className={tdClass}>9-13 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>14-18 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>

                <tr>
                  <td className={tdClass} rowSpan={3}>Women</td>
                  <td className={tdClass}>19-30 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>31-59 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>60+ yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>

                <tr>
                  <td className={tdClass} rowSpan={3}>Men</td>
                  <td className={tdClass}>19-30 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>31-59 yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
                <tr>
                  <td className={tdClass}>60+ yrs</td>
                  <td className={tdClass}>3 cups</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="mt-8 text-lg font-bold text-[#003E48]">Cup of dairy table</h4>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className={thClass}> </th>
                  <th className={thClass}>Amount That Counts as 1 Cup in the Dairy Group</th>
                </tr>
              </thead>
              <tbody>

                <tr>
                  <td className={tdClass} rowSpan={5}>Milk</td>
                  <td className={tdClass}>1 cup milk</td>
                </tr>
                <tr>
                  <td className={tdClass}>1 half-pint container milk</td>
                </tr>
                <tr>
                  <td className={tdClass}>½ cup evaporated milk</td>
                </tr>
                <tr>
                  <td className={tdClass}>1 cup calcium-fortified soy milk</td>
                </tr>
                <tr>
                  <td className={tdClass}>1 half-pint container calcium-fortified soy milk</td>
                </tr>

                <tr>
                  <td className={tdClass}>Yogurt</td>
                  <td className={tdClass}>1 cup yogurt (dairy or fortified soy)</td>
                </tr>

                <tr>
                  <td className={tdClass} rowSpan={7}>Cheese</td>
                  <td className={tdClass}>1 ½ ounces hard cheese (cheddar, mozzarella, Swiss, Parmesan)</td>
                </tr>
                <tr>
                  <td className={tdClass}>⅓ cup shredded cheese</td>
                </tr>
                <tr>
                  <td className={tdClass}>1 ounce processed cheese (American)</td>
                </tr>
                <tr>
                  <td className={tdClass}>½ cup ricotta cheese</td>
                </tr>
                <tr>
                  <td className={tdClass}>1 ¼ cup cottage cheese</td>
                </tr>
                <tr>
                  <td className={tdClass}>2 ounces Queso fresco</td>
                </tr>
                <tr>
                  <td className={tdClass}>2 slices Queso blanco</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-[#003E48]">
            Health benefit of Dairy group
          </h2>
          <p>
            Consuming dairy products provides health benefits — especially building and maintaining strong bones. Foods in the Dairy Group provide nutrients that are vital for health and maintenance of your body. These nutrients include calcium, potassium, vitamin D, and protein.
          </p>
          <p>
            Calcium and vitamin D are important nutrients at any age. Intake of dairy products that contain these nutrients help to:
          </p>
          <ul>
            <li>Improve bone health especially in children and adolescents, when bone mass is being built.</li>
            <li>Promote bone health and prevent the onset of osteoporosis in adults, most of whom do not get enough of these nutrients.</li>
          </ul>

          <h2 className="text-[#003E48]">Nutrients </h2>
          <ul>
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
      </SectionCard>
    </GuestLayout>
  )
}

export default Diary
