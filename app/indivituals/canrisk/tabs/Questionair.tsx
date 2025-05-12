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
import AlertModal from '@/app/components/alerts/alert-modal';

type InputData = {
  gender?: string;
  age?: number;
  weight?: string;
  height?: string;
  waist?: string;
  exercise?: string;
  vegetable?: string;
  bloodPressure?: string;
  bloodPressurePills?: string;
  bloodSugar?: string[];
  pregnancy?: string;
  relatives?: string[];
  father?: string;
  mother?: string;
  education?: string;
}

function Questionair() {
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState<InputData>({});
  const [showAlert, setShowAlert] = useState(false);

  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: 'success' | 'error' | 'info';
    actionUrl: string;
  }>({
    title: '',
    message: '',
    status: 'success',
    actionUrl: ''
  });

  const calculateScore = () => {
    let score = 0;

    // Age group scoring
    if (collectedData.age) {
      if (collectedData.age >= 40 && collectedData.age <= 44) score += 0;
      else if (collectedData.age >= 45 && collectedData.age <= 54) score += 7;
      else if (collectedData.age >= 55 && collectedData.age <= 64) score += 13;
      else if (collectedData.age >= 65 && collectedData.age <= 74) score += 15;
    }

    // Gender scoring
    if (collectedData.gender === 'Male') score += 6;

    // BMI scoring
    if (collectedData.height && collectedData.weight) {
      const heightInMeters = parseFloat(collectedData.height) / 100;
      const weightInKg = parseFloat(collectedData.weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);

      if (bmi < 25) score += 0;
      else if (bmi >= 25 && bmi < 30) score += 4;
      else if (bmi >= 30 && bmi < 35) score += 9;
      else if (bmi >= 35) score += 14;
    }

    // Waist circumference scoring
    if (collectedData.waist) {
      const waistInCm = parseFloat(collectedData.waist);

      if (collectedData.gender === 'Male') {
        if (waistInCm < 94) score += 0;
        else if (waistInCm >= 94 && waistInCm <= 102) score += 4;
        else if (waistInCm > 102) score += 6;
      } else if (collectedData.gender === 'Female') {
        if (waistInCm < 80) score += 0;
        else if (waistInCm >= 80 && waistInCm <= 88) score += 4;
        else if (waistInCm > 88) score += 6;
      }
    }

    // Physical activity scoring
    if (collectedData.exercise === 'No') score += 1;

    // Vegetable consumption scoring
    if (collectedData.vegetable === 'Not every day') score += 2;

    // High blood pressure scoring
    if (collectedData.bloodPressure === 'Yes') score += 4;

    // High blood sugar scoring
    if (collectedData.bloodSugar?.includes('Yes')) score += 14;

    // Pregnancy-related scoring
    if (collectedData.pregnancy === 'Yes') score += 1;

    // Family history scoring
    if (collectedData.relatives) {
      const familyScore = Math.min(collectedData.relatives.length * 2, 8);
      score += familyScore;
    }

    // Ethnic background scoring
    if (collectedData.father || collectedData.mother) {
      const ethnicScores = {
        Aboriginal: 3,
        Black: 5,
        'East Asian': 10,
        'South Asian': 11,
        'Other non-white': 3,
        White: 0,
      };
      const fatherScore = ethnicScores[collectedData.father as keyof typeof ethnicScores] || 0;
      const motherScore = ethnicScores[collectedData.mother as keyof typeof ethnicScores] || 0;
      score += Math.max(fatherScore, motherScore);
    }

    // Education level scoring
    if (collectedData.education) {
      const educationScores: Record<string, number> = {
        'Some high school or less': 5,
        'High school': 1,
        'Some college or university': 0,
        'College/University degree': 0,
      };
      score += educationScores[collectedData.education] || 0;
    }

    return score;
  };

  const handleComplete = () => {
    const finalScore = calculateScore();
    let riskMessage = '';

    if (finalScore < 21) {
      riskMessage = `Low Risk: Your risk of having pre-diabetes or type 2 diabetes is fairly low, though it always pays to maintain a healthy lifestyle.`;
    } else if (finalScore >= 21 && finalScore <= 32) {
      riskMessage = `Moderate Risk: Based on your identified risk factors, your risk of having pre-diabetes or type 2 diabetes is moderate. You may wish to consult with a health care practitioner about your risk of developing diabetes.`;
    } else if (finalScore >= 33) {
      riskMessage = `High Risk: Based on your identified risk factors, your risk of having pre-diabetes or type 2 diabetes is high. You may wish to consult with a health care practitioner to discuss getting your blood sugar tested.`;
    }

    const feedback = `These risk scores are in no way a substitute for actual clinical diagnosis.\n\nIf you have any concerns, please consider discussing your results with a health care practitioner (e.g., family doctor, nurse practitioner, pharmacist).\n\nDiabetes is a serious chronic disease and uncontrolled diabetes can lead to heart disease, kidney disease, and other conditions.\n\nWhile you can’t change some factors such as age, gender, family history, and ethno-cultural background, other risk factors for diabetes may respond to lifestyle changes. These include weight, physical activity, diet, and smoking.\n\nIf your BMI is 25 or higher, lowering your weight may help you reduce your risk of developing type 2 diabetes. Even a small change in body weight or physical activity can reduce your risk. Embrace a healthy balanced diet which emphasizes vegetables, fruit, and whole grains. Consult Canada’s Food Guide for helpful suggestions. If you are not active, begin slowly and increase your activity gradually. Check with your doctor before beginning any exercise program.\n\nIf you smoke, it’s never too late to quit. Every step you take to improve your health counts!\n\nThank you for completing the Canadian Diabetes Risk Questionnaire.`;

    setShowAlert(true);

    setAlert({
      title: 'CanRisk Assessment Completed',
      message: `Your final score is: <b>${finalScore}</b>\n\n${riskMessage}\n\n${feedback}`,
      status: 'success',
      actionUrl: '',
    });
  };

  const steps = [
    {
      component: <StepOne />,
    },
    {
      component: <StepTwo />,
    },
    {
      component: <StepThree onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepFour onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepFive onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepSix onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepSeven onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepEight onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepNine onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepTen onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepEleven onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepTwelve onInputChange={(data) => handleInputChanged(data)} />,
    },
    {
      component: <StepThirteen onInputChange={(data) => handleInputChanged(data)} onComplete={handleComplete} />,
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

  const handleInputChanged = (data: InputData) => {
    setCollectedData((prevData) => ({ ...prevData, ...data }));
  }

  return (
    <div className='border border-gray-200 p-6 rounded-xl bg-white flex flex-col items-center'>
      <div className='w-full'>
        <div className='mt-4 text-slate-800 questionnaire'>
          {steps[currentStep].component}
        </div>
      </div>

      {showAlert && <AlertModal title={alert.title} message={alert.message} status={alert.status} actionUrl={alert.actionUrl} onOk={() => {
        setCurrentStep(0);
        setShowAlert(false);
      }} onClose={() => {
        setCurrentStep(0);
        setShowAlert(false);
      }} />}

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