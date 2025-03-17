import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import React from 'react'

function Proteins() {
  return (<>
    <GuestLayout>
      <PageHeader
        sup_title='Food Groups'
        title='Proteins'
        description='Did you know that adult males need to eat less red meat? Yet many children and some women may need to eat more?'
        backgroundImage='https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />

      <section className="px-20 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-32 lg:px-28 lg:py-20">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="col-lg-8">
              <div className="main-contents">
                <div className="font-merri font-normal text-gray-900">
                  <p className="mt-5">
                    All foods made from seafood; meat, poultry, and eggs; beans, peas, and lentils; and nuts, seeds, and soy products are part of the Protein Foods Group. Beans, peas, and lentils are also part of the Vegetable Group.
                  </p>

                  <h2 className='text-2xl font-semibold mt-5'>
                    Foods from this food group fall into 6 categories. <br /> Examples include:
                  </h2>
                  <p className="mt-5">
                    <ol type="1">
                      <li>Lean meats - Beef, lamb, veal, pork, kangaroo, lean (lower salt) sausages</li>
                      <li>Poultry - Chicken, turkey, duck, emu, goose, bush birds</li>
                      <li>Fish and seafood - Fish, prawns, crab, lobster, mussels, oysters, scallops, clams</li>
                      <li>Eggs - Chicken eggs, duck eggs</li>
                      <li>Nuts and seeds - Almonds, pine nuts, walnut, macadamia, hazelnut, cashew, peanut, nut spreads, pumpkin seeds, sesame seeds, sunflower seeds, brazil nuts</li>
                      <li>Legumes/beans - All beans, lentils, chickpeas, split peas, tofu.</li>
                    </ol>
                    The Guidelines recommend that you eat 1-3 serves of foods from this food group a day, depending on your age.  During pregnancy, 3-4 serves a day are recommended.
                  </p>

                  <h2 className='text-2xl font-semibold mt-5'>
                    Daily Protein Foods Table
                  </h2>
                  <p className="mt-5">
                    These are general recommendations by age. Find
                    the right amount for you by getting your
                    <a href="https://www.myplate.gov/myplate-plan"><strong>MyPlate Plan</strong></a>.
                  </p>

                  <table className="usa-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" colSpan={3}>Daily Recommendations*
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"><strong>Toddlers</strong></th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">12 to 23 months</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">½ to 1 cup</td>
                      </tr>
                      <tr>
                        <th className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={2}>
                          <strong>Children</strong>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2-4 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 to 1½ cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">5-8 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1 to 2 cups</td>
                      </tr>
                      <tr>
                        <th className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={2}><strong>Girls</strong>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">9-13 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1½ to 2 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">14-18 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1½ to 2 cups</td>
                      </tr>
                      <tr>
                        <th className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={2}><strong>Boys</strong>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">9-13 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1½ to 2 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">14-18 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 to 2½ cups</td>
                      </tr>
                      <tr>
                        <th className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={3}><strong>Women</strong>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">19-30 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1½ to 2 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">31-59 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1½ to 2 cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">60+ yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">1½ to 2 cups</td>
                      </tr>
                      <tr>
                        <th className="border-t-2 border-gray-100 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" rowSpan={3}><strong>Men</strong>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">19-30 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 to 2½ cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">31-59 yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 to 2½ cups</td>
                      </tr>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">60+ yrs</td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">2 cups</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2 className='text-2xl font-semibold mt-5'>
                    Why is it important to eat proteins?
                  </h2>
                  <p className="mt-5">
                    Lean red meat provides a very good source of nutrients, however consumption of greater than 100/120g per day of red meat, which is more than double the recommended amount, is associated with an increased risk of colorectal cancer and renal cancer.  So remember to also eat other foods from this food group. Non meat options such as legumes provide many of the same nutrients as meats, poultry, fish and eggs. In fact, nuts and seeds may help reduce the risk of heart disease and are not associated with weight gain if total energy intake (kilojoules) is controlled.
                  </p>

                  <blockquote>
                    Protein Foods subgroups can help increase intake of important nutrients, including unsaturated fats, dietary fiber, and vitamin D and help to limit intake of sodium and saturated fats coming from processed meat and poultry.
                  </blockquote>

                  <h2 className='text-2xl font-semibold mt-5'>Nutrients of  protein group</h2>
                  <ul className='my-4 list-disc list-inside'>
                    <li>Meat, poultry, seafood, beans,peans, and lentils, eggs,and nuts, seeds, and soy products supply many nutrients. These include protein, B vitamins ( niacin, thiamin, riboflavin, and B6), vitamin E, iron, zinc and magnesium. </li>
                    <li>Some food choices in the protein food group are high in saturated fat. These include fatty cuts of beef, pork, and lamb; regular ( 75% to 85% lean) ground beef; regular sausages,hot dogs, and bacon; some luncheon meats such as regular bologna and salami; and some poultry such as duck. To help keep saturated fat intake below 10% of daily calories, limit the amount of these foods you eat.</li>
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

export default Proteins