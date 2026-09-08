import PageHeader from '@/app/components/headers/page-header'
import GuestLayout from '@/app/layouts/GuestLayout'
import SectionCard from '@/app/components/sections/section-card'
import React from 'react'

function MyPlate() {
  return (
    <GuestLayout>
      <PageHeader
        title={<>What is <span className="font-accent">MyPlate</span></>}
        description=''
        backgroundImage='https://images.unsplash.com/photo-1514843319620-4f042827c481?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />

      <SectionCard className="bg-white py-12 sm:py-16">
        <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
          <h2 className="text-[#003E48]">What is food groups </h2>
          <p>A balanced diet gives your body the nutrients it needs to function correctly. To meet the nutrient requirements essential for good health, you need to eat a variety from each of the five food groups daily, in the recommended amounts.  It is not necessary to eat from each food group at every meal. In fact, in some instances, you only need to eat some of the foods in each food group a couple of times a week</p>
          <p>The <b>dietary Guidelines for American</b> and <b>Australian Guide</b> make up these five food groups. Foods are grouped together because they provide similar amounts of the key nutrients of that food group.  For example, the key nutrients of the milk, yogurt, cheese and alternatives food group include calcium and protein, while the fruit group is a good source of vitamins, especially vitamin C.</p>
          <p>
            A healthy eating routine is important at every stage of life and can have positive effects that add up over time. It’s important to eat a variety of fruits, vegetables, grains, protein foods, and dairy and fortified soy alternatives. When deciding what to eat or drink, choose options that are full of nutrients. Make every bite count.
          </p>
        </div>
      </SectionCard>
    </GuestLayout>
  )
}

export default MyPlate
