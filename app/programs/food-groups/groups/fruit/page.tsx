import PageHeader from '@/app/components/headers/page-header'
import React from 'react'

function Fruit() {
  return (<>
    <PageHeader
      sup_title='Food Groups'
      title='What is Fruit and vegetables?'
      description='Vegetables and fruits are an important part of a healthy diet, and variety is as important as quantity.'
      backgroundImage='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2874&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    />

    <section className="content-section">
      <div className="container">
        <div className="flex items-center justify-center">
          <div className="col-lg-8">
            <div className="main-contents">
              <div className="font-merri font-normal text-gray-900">
                <p>
                  No single fruit or vegetable provides all of the nutrients you need to be healthy. Eat plenty every day.
                </p>

                <h2>
                  How much should I eat ?
                </h2>
                <p>
                  You should eat at least five portions of fruit and vegetables a day. They contain important vitamins and minerals that help prevent disease as well as fibre which can lower cholesterol, keep the bowel healthy and help digestion.
                </p>
                <p>It’s easy to get your five a day if you spread your portions through the day. Try:</p>
                <ul>
                  <li>adding chopped bananas to your cereal or toast at breakfast</li>
                  <li>enjoying a piece of fruit as a mid-morning snack</li>
                  <li>including a bowl of salad or vegetable soup with your lunch</li>
                  <li>snacking on a bowl of raw carrots, peppers and cucumbers mid-afternoon</li>
                  <li>adding a portion of veg to your evening meal.</li>
                </ul>

                <h2>
                  What counts as a portion of fruit and vegetables?
                </h2>
                <p>
                  <ol>
                    <li>1 apple, banana, pear, orange or other similar sized fruit</li>
                    <li>2plums or similar sized fruit</li>
                    <li>Half a grapefruit or avocado</li>
                    <li>1slice of large fruit like melon or pineapple</li>
                    <li>3 heaped tablespoons of vegetables</li>
                    <li>3 heaped tablespoons of fruit salad or stewed fruit</li>
                    <li>A dessert bowl of salad</li>
                  </ol>
                  Fruit juice and smoothies contain a lot of sugar, so limit them to just 150ml a day – that’s around the same as a small glass. Dried fruit is also high in sugar so it’s best not to eat it in-between meals to help prevent tooth decay.
                </p>

                <h2>
                  Why is it important to eat the Fruit and Vegetables?
                </h2>
                <p>
                  A diet rich in vegetables and fruits can lower blood pressure, reduce the risk of heart disease and stroke, prevent some types of cancer, lower risk of eye and digestive problems, and have a positive effect upon blood sugar, which can help keep appetite in check. Eating non-starchy vegetables and fruits like apples, pears, and green leafy vegetables may even promote weight loss. Their low glycemic loads prevent blood sugar spikes that can increase hunger (1) .
                </p>

                <p>
                  Protein Foods subgroups can help increase intake of important nutrients, including unsaturated fats, dietary fiber, and vitamin D and help to limit intake of sodium and saturated fats coming from processed meat and poultry.
                </p>

                <h3>Nutrients</h3>
                <ul>
                  <li>Most fruits are naturally low in fat, sodium, and calories. None have cholesterol </li>
                  <li>Fruits are sources of many essential nutrients that many people don’t get enough of including potassium, dietary fiber, vitamin C, and folate.</li>
                  <li>Diets rich in potassium may help to maintain healthy blood pressure. Fruit sources of potassium include bananas, prunes and prune juice, dried peaches and apricots, cantaloupe, honeydew melon, orange juice, sapote, jack fruit,guava, and kiwi.</li>
                  <li>Dietary fiber from fruitsm as part of an overall healthy diet, helps reduce blood cholesterol levels and  may lower risk of heart disease. Fiber is important for proper bowel function. Whole or cut-up fruits are sources of dietary fiber; fruit juices contain little or non fiber.</li>
                  <li>Vitamin C is important for growth and repair of all body tissues, helps heal cuts and wounds, and keeps teeth and gums healthy. Vitamin C helps your body absorb iron more easily. </li>
                </ul>

                <h3>References</h3>
                <ul>
                  <li>
                    1.Bertoia ML, Mukamal KJ, Cahill LE, Hou T, Ludwig DS, Mozaffarian D, Willett WC, Hu FB, Rimm EB. Changes in intake of fruits and vegetables and weight change in United States men and women followed for up to 24 years: analysis from three prospective cohort studies. PLoS medicine. 2015 Sep 22;12(9):e1001878.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>)
}

export default Fruit