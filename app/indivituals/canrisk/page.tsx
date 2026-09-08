import GuestLayout from '@/app/layouts/GuestLayout';
import { Metadata } from 'next';
import Stepper from './Stepper';
import PageHeader from '@/app/components/headers/page-header';
import SectionCard from '@/app/components/sections/section-card';

export const metadata: Metadata = {
  title: "CanRisk - Diabetes Risk Assessment",
  description: "Assess your risk for diabetes and gain insights into your health with Vitaway's CanRisk tool. Take the first step towards a healthier future.",
  keywords: "CanRisk, Diabetes Risk, Health Assessment, Vitaway, Diabetes Prevention, Health Insights, Wellness, Risk Assessment, Personalized Care",
  metadataBase: new URL("https://www.vitaway.org/individuals/canrisk"),
}

function CanRisk() {
  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            Diabetes. Are you at <span className="font-accent">risk</span>?
          </>
        }
        description="This page will help you determine if you are at risk for certain conditions."
      />

      <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
          <div className="rounded-[24px] bg-white p-5 sm:p-8 md:p-10">
            <Stepper />
          </div>
        </div>
      </SectionCard>
    </GuestLayout>
  );
}

export default CanRisk;
