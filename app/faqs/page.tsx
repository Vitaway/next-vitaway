/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import faqs from '../../content/faqs.json'
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import FaqsCollapsable from '../components/sections/faqs-collapsable';

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "At Vitaway, we're revolutionizing virtual care across multiple chronic conditions. We help people shift their mindsets to change their health. Do you have questions about how we do it? We are here to help.",
  keywords: "Vitaway, FAQs, Questions, Answers, Health, Virtual Care, Chronic Conditions, Vitaway Health, Health Questions, Health Answers, Vitaway FAQs, Health Information, Vitaway Health Ltd",
  metadataBase: new URL("https://www.vitaway.org/faqs"),
}

function FAQs() {
  return (<>
    <GuestLayout>
      <div className="team-section relative w-full h-full">
        <div className="absolute w-full bg-gradient-to-b from-[#003E48] to-[#282e33] lg:block h-[500px]"></div>

        <div className="px-4 z-10 py-10 mx-auto relative sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl sm:mx-auto lg:max-w-3xl">
            {/* Header */}
            <div className="flex flex-col mb-16 sm:text-center">
              <a href="#" className="mb-6 sm:mx-auto">
                <div className="flex items-center justify-center w-12 h-12 rounded-full ring-1 ring-gray-200 bg-indigo-50 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
              </a>
              <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
                <h2 className="max-w-lg mb-6 font-normal text-white text-3xl leading-[50px] tracking-tight sm:text-4xl md:mx-auto">
                  <span className="relative inline-block font-normal">
                    <span className="relative  font-normal">Find </span>
                  </span>
                  and Unlock Answers to Your Questions! from different Insights
                </h2>
                <p className="text-base text-slate-200 md:text-lg">
                  At Vitaway, we're revolutionizing virtual care across multiple
                  chronic conditions. We help people shift their mindsets to change
                  their health. Do you have questions about how we do it? We are
                  here to help.
                </p>
              </div>
            </div>

            {/* FAQs */}
            <div className='bg-white rounded-xl px-5 py-5'>
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-6 mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-gray-200 pb-2">
                    {faq.name}
                  </h2>
                  <FaqsCollapsable faqs={faq.questions} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  </>)
}

export default FAQs