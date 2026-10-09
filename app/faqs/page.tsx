import React from 'react';
import faqs from '../../content/faqs.json';
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import FaqsBrowser from '../components/sections/faqs-browser';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "At Vitaway, we're revolutionizing virtual care across multiple chronic conditions. We help people shift their mindsets to change their health. Do you have questions about how we do it? We are here to help.",
  keywords: "Vitaway, FAQs, Questions, Answers, Health, Virtual Care, Chronic Conditions, Vitaway Health, Health Questions, Health Answers, Vitaway FAQs, Health Information, Vitaway Health Ltd",
  metadataBase: new URL("https://www.vitaway.org/faqs"),
};

function FAQs() {
  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            Before you book, here is what people <span className="font-accent">ask</span>
          </>
        }
        description="Clinic visits, programmes, the app, packages, and the shop — pick a category and get the answers."
      />

      <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
        <div className="mx-auto max-w-[900px] px-5 lg:px-12">
          <FaqsBrowser categories={faqs} />
        </div>
      </SectionCard>
    </GuestLayout>
  );
}

export default FAQs;
