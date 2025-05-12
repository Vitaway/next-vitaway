'use client';

import React, { useState } from 'react';
import Questionair from './tabs/Questionair';
import Score from './tabs/Score';
import Information from './tabs/Information';
import Share from './tabs/Share';

function Stepper() {
    const [activeTab, setActiveTab] = useState('Diabetes Questionnaire');

    const tabs = [
        'Diabetes Questionnaire',
        'My Score',
        'More Information',
        'Share',
    ];

    return (<>
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
    </>)
}

export default Stepper