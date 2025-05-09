'use client';

import GuestLayout from '@/app/layouts/GuestLayout';
import React, { useState } from 'react';
import Questionair from './tabs/Questionair';
import Score from './tabs/Score';
import Information from './tabs/Information';
import Share from './tabs/Share';

function CanRisk() {
  const [activeTab, setActiveTab] = useState('Diabetes Questionnaire');

  const tabs = [
    'Diabetes Questionnaire',
    'My Score',
    'More Information',
    'Share',
  ];

  return (
    <GuestLayout>
      <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
        <div className="border border-gray-200 p-6 rounded-3xl">
          <h1 className='text-3xl font-bold text-slate-800'>Diabetes</h1>
          <h1 className='text-3xl font-bold text-slate-800'>Are you at risk?</h1>
          <p className='mt-4 text-slate-800'>This page will help you determine if you are at risk for certain conditions.</p>

          {/* Tabs */}
          <div className='mt-6 flex space-x-4'>
            {tabs.map((tab) => (
              <button key={tab} className={`px-4 py-2 font-semibold rounded-lg ${activeTab === tab ? 'bg-gradient-to-b from-[#003E48] to-[#282e33] text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className='mt-6'>
            {activeTab === 'Diabetes Questionnaire' && (<Questionair />)}
            {activeTab === 'My Score' && (<Score />)}
            {activeTab === 'More Information' && (<Information />)}
            {activeTab === 'Share' && (<Share />)}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

export default CanRisk;