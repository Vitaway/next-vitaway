import GuestLayout from '@/app/layouts/GuestLayout';
import { Metadata } from 'next';
import Stepper from './Stepper';

export const metadata: Metadata = {
  title: "CanRisk - Diabetes Risk Assessment",
  description: "Assess your risk for diabetes and gain insights into your health with Vitaway's CanRisk tool. Take the first step towards a healthier future.",
  keywords: "CanRisk, Diabetes Risk, Health Assessment, Vitaway, Diabetes Prevention, Health Insights, Wellness, Risk Assessment, Personalized Care",
  metadataBase: new URL("https://www.vitaway.org/individuals/canrisk"),
}

function CanRisk() {
  return (
    <GuestLayout>
      <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
        <div className="border border-gray-200 p-6 rounded-3xl">
          <h1 className='text-3xl font-bold text-slate-800'>Diabetes</h1>
          <h1 className='text-3xl font-bold text-slate-800'>Are you at risk?</h1>
          <p className='mt-4 text-slate-800'>This page will help you determine if you are at risk for certain conditions.</p>
          <Stepper />
        </div>
      </div>
    </GuestLayout>
  );
}

export default CanRisk;