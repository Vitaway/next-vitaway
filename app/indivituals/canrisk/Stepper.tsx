'use client';

import React, { useState } from 'react';
import Questionair, { InputData } from './tabs/Questionair';
import Score from './tabs/Score';
import Information from './tabs/Information';
import Share from './tabs/Share';

function Stepper() {
    const [activeTab, setActiveTab] = useState('Diabetes Questionnaire');
    const [score, setScore] = useState<number | null>(null);
    const [collectedData, setCollectedData] = useState<InputData | null>(null);

    const tabs = [
        'Diabetes Questionnaire',
        'My Score',
        'More Information',
        'Share',
    ];

    // Handler to be called when questionnaire is completed
    const handleQuestionnaireComplete = (finalScore: number, data: InputData) => {
        setScore(finalScore);
        setCollectedData(data);
        setActiveTab('My Score');
    };

    // Handler to go to Information tab after viewing score
    const handleScoreNext = () => {
        setActiveTab('More Information');
    };

    // Handler to go to Share tab after viewing information
    const handleInformationNext = () => {
        setActiveTab('Share');
    };

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
                {activeTab === 'Diabetes Questionnaire' && (
                    <Questionair onComplete={handleQuestionnaireComplete} />
                )}
                {activeTab === 'My Score' && (
                    <Score score={score} data={collectedData} onNext={handleScoreNext} />
                )}
                {activeTab === 'More Information' && (
                    <Information score={score} data={collectedData} onNext={handleInformationNext} />
                )}
                {activeTab === 'Share' && <Share score={score} data={collectedData} />}
            </div>
        </>
    );
}

export default Stepper;