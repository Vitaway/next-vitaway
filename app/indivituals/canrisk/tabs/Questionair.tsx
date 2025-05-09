'use client';

import React, { useState } from 'react';
import StepOne from './steps/StepOne';

function Questionair() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      component: <StepOne />,
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    <div className='border border-gray-200 p-6 rounded-xl bg-white'>
      <div>
        <div className='mt-4'>
          {steps[currentStep].component}
        </div>
      </div>

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
          disabled={currentStep === steps.length - 1}
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