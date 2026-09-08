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
            <div className='mt-2 flex flex-wrap gap-2'>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 sm:text-base ${
                            activeTab === tab
                                ? 'bg-[#003E48] text-white'
                                : 'bg-[#F6F3EE] text-[#003E48] hover:bg-[#003E48]/10'
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