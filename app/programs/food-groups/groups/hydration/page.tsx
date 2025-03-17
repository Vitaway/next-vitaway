import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import React from 'react'

function Hydration() {
  return (<>
    <GuestLayout>
      <PageHeader
        sup_title='Food Groups'
        title='Hydration'
        description=''
        backgroundImage='https://images.unsplash.com/photo-1568691422603-24041316b924?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <section className="content-section">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="col-lg-8">
              <div className="main-contents">
                <div className="font-merri font-normal text-gray-900">
                  <p>
                    The body constantly loses fluid through breathing, sweating or going to the toilet and therefore this needs to be replaced. Aim to drink 6-8 glasses of fluid each day to help keep the body hydrated.
                  </p>
                  <p>
                    Water, lower fat milk and sugar free drinks, including tea and coffee all count. Choose sugar free options instead of sugary drinks.
                  </p>
                  <p>
                    Limit consumption of fruit juices and smoothies to no more than a combined total of 150ml per day, because they are high in sugar.
                  </p>
                  <p>Alcohol contains lots of calories, however the amount of calories an alcoholic drink contains depends on the type of alcohol, the amount served and what mixers are added. As an example, 1 pint of lager or a 175ml glass of wine contains around 135 calories while a 25ml shot of spirit contains around 56 calories.</p>
                  <p>To minimise the health risks associated with drinking alcohol, consumption should be limited to no more than 14 units per week for men and women. One unit is the same as one small single measure of spirits, while a 175ml glass of wine or a pint of standard strength lager or cider contains 2 units.</p>

                  <h2>Dehydration</h2>
                  <p>We get dehydrated when we don’t drink enough fluid. One of the first signs of dehydration is feeling thirsty but you may notice other signs:</p>
                  <ul>
                    <li>darker urine than usual or not passing much urine when you go to the toilet</li>
                    <li>headaches</li>
                    <li>feeling confused or irritable, or finding it hard to concentrate.</li>
                  </ul>
                  <p>Talk to your doctor if you have concerns about any of these symptoms.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  </>)
}

export default Hydration