'use client';

import React, { useState } from 'react'

function Questionair() {
    const [currentStep, setCurrentStep] = useState(0);

    const questions = [
        'Do you have a family history of diabetes?',
        'Do you experience frequent thirst?',
        'Do you urinate frequently?',
        'Do you feel fatigued often?',
        'Do you have blurred vision?',
        'Do you have slow-healing wounds?',
        'Do you experience unexplained weight loss?',
        'Do you have tingling or numbness in your hands or feet?',
        'Do you have high blood pressure?',
        'Do you have a sedentary lifestyle?'
      ];

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      };
    
      const handlePrevious = () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
        }
      };
    
      const handleRestart = () => {
        setCurrentStep(0);
      };

    return (
        <div>
            <h2 className='text-xl font-bold'>Step {currentStep + 1} of {questions.length}</h2>
            <p className='mt-4'>{questions[currentStep]}</p>

            <div className='mt-6 flex space-x-4'>
                <button
                    className='px-4 py-2 bg-gray-300 text-gray-700 rounded'
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    Previous
                </button>
                <button
                    className='px-4 py-2 bg-blue-500 text-white rounded'
                    onClick={handleNext}
                    disabled={currentStep === questions.length - 1}
                >
                    Next
                </button>
                <button
                    className='px-4 py-2 bg-red-500 text-white rounded'
                    onClick={handleRestart}
                >
                    Restart
                </button>
            </div>
        </div>
    )
}

export default Questionair