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
      <div className='container'>
        <h1 className='text-3xl font-bold'>Can I Risk?</h1>
        <p className='mt-4'>This page will help you determine if you are at risk for certain conditions.</p>

        {/* Tabs */}
        <div className='mt-6 flex space-x-4'>
          {tabs.map((tab) => (
            <button key={tab} className={`px-4 py-2 font-semibold ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActiveTab(tab)}>
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
    </GuestLayout>
  );
}

export default CanRisk;