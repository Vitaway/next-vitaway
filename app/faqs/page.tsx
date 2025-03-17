"use client";

import React, { useState } from 'react';
import faqs from '../../content/faqs.json'
import GuestLayout from '../layouts/GuestLayout';

function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (<>
    <GuestLayout>
      <div className="team-section relative w-full h-full">
        <div className="absolute hidden w-full bg-gradient-to-b from-[#272749] to-[#111827] lg:block h-[500px]"></div>

        <div className="px-4 z-10 py-16 mx-auto relative sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
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
                <h2 className="max-w-lg mb-6 font-normal text-white text-3xl leading-none tracking-tight sm:text-4xl md:mx-auto">
                  <span className="relative inline-block font-normal">
                    <span className="relative  font-normal">Find </span>
                  </span>
                  and Unlock Answers to Your Questions! from different Insights
                </h2>
                <p className="text-base text-slate-200 md:text-lg">
                  Get the answers you&apos;ve been seeking! Dive into our FAQs for quick, concise solutions to common queries. Your knowledge, simplified.
                </p>
              </div>
            </div>

            {/* FAQs */}
            <div className='bg-white rounded-xl px-10 py-10'>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div className="border rounded shadow-sm" key={index}>
                    <button type="button" aria-label="Open item" title="Open item" className="flex items-center justify-between w-full p-4 focus:outline-none" onClick={() => handleToggle(index)}>
                      <p className="text-base text-slate-700 font-bold">{faq.question}</p>

                      <div className="flex items-center justify-center w-8 h-8 border rounded-full">
                        <svg viewBox="0 0 24 24" className={`w-3 text-gray-600 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                          <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" points="2,7 12,17 22,7" strokeLinejoin="round"></polyline>
                        </svg>
                      </div>
                    </button>

                    {openIndex === index && (
                      <div className="p-4 text-slate-700">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  </>)
}

export default FAQs