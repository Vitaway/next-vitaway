'use client';

import React, { useState } from 'react';
import '@/app/styles/questionnaire.css';

import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import StepFive from './steps/StepFive';
import StepSix from './steps/StepSix';
import StepSeven from './steps/StepSeven';
import StepEight from './steps/StepEight';
import StepNine from './steps/StepNine';
import StepTen from './steps/StepTen';
import StepEleven from './steps/StepEleven';
import StepTwelve from './steps/StepTwelve';
import StepThirteen from './steps/StepThirteen';


function Questionair() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      component: <StepOne />,
    },
    {
      component: <StepTwo />,
    },
    {
      component: <StepThree />,
    },
    {
      component: <StepFour />,
    },
    {
      component: <StepFive />,
    },
    {
      component: <StepSix />,
    },
    {
      component: <StepSeven />,
    },
    {
      component: <StepEight />,
    },
    {
      component: <StepNine />,
    },
    {
      component: <StepTen />,
    },
    {
      component: <StepEleven />,
    },
    {
      component: <StepTwelve />,
    },
    {
      component: <StepThirteen />,
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
    <div className='border border-gray-200 p-6 rounded-xl bg-white flex flex-col items-center'>
      <div className='w-full'>
        <div className='mt-4 text-slate-800 questionnaire'>
          {steps[currentStep].component}
        </div>
      </div>

      <div tabIndex={-1} className="progressTracking mt-5 w-full text-center">
        <progress id="progressbar" className='rounded' value={currentStep + 1} max={steps.length}></progress>
        <div id="progressText" className="mt-2 text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
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