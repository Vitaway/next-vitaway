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

    return (
        <>
            {/* Tabs */}
            <div className='mt-6 flex flex-wrap space-x-2 sm:space-x-4 space-y-2 sm:space-y-0'>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base font-semibold rounded-lg ${
                            activeTab === tab
                                ? 'bg-gradient-to-b from-[#003E48] to-[#282e33] text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className='mt-6'>
                {activeTab === 'Diabetes Questionnaire' && <Questionair />}
                {activeTab === 'My Score' && <Score />}
                {activeTab === 'More Information' && <Information />}
                {activeTab === 'Share' && <Share />}
            </div>
        </>
    );
}

export default Stepper