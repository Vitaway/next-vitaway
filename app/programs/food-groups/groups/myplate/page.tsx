import PageHeader from '@/app/components/headers/page-header'
import React from 'react'

function MyPlate() {
  return (<>
    <PageHeader
      sup_title='Food Groups'
      title='My Plates'
      description=''
      backgroundImage='https://images.unsplash.com/photo-1514843319620-4f042827c481?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    />

    <section className="content-section">
      <div className="container">
        <div className="flex items-center justify-center">
          <div className="col-lg-8">
            <div className="main-contents">
              <div className="font-merri font-normal text-gray-900">
                <h2>What is food groups </h2>
                <p>A balanced diet gives your body the nutrients it needs to function correctly. To meet the nutrient requirements essential for good health, you need to eat a variety from each of the five food groups daily, in the recommended amounts.  It is not necessary to eat from each food group at every meal. In fact, in some instances, you only need to eat some of the foods in each food group a couple of times a week</p>
                <p className="mt-5">The <b>dietary Guidelines for American</b> and <b>Australian Guide</b> make up these five food groups. Foods are grouped together because they provide similar amounts of the key nutrients of that food group.  For example, the key nutrients of the milk, yogurt, cheese and alternatives food group include calcium and protein, while the fruit group is a good source of vitamins, especially vitamin C.</p>
                <p>
                  A healthy eating routine is important at every stage of life and can have positive effects that add up over time. It’s important to eat a variety of fruits, vegetables, grains, protein foods, and dairy and fortified soy alternatives. When deciding what to eat or drink, choose options that are full of nutrients. Make every bite count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>)
}

export default MyPlate