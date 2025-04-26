import React from 'react';
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import AppointmentForm from '../components/forms/appointment-form';

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule your appointment with Vitaway today! Let our healthcare experts assist you on your wellness journey.",
  keywords: "Vitaway, Appointment, Book, Healthcare, Wellness, Schedule",
  metadataBase: new URL("https://www.vitaway.org"),
};

function Appointment() {
  return (
    <GuestLayout>
      <div className="relative overflow-hidden bg-gradient-to-b from-[#272749] to-[#111827] min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#272749] to-[#111827] z-0"></div>

        <div className="relative z-10 px-4 py-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-10 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center justify-center z-10">
            <div className="w-full max-w-xl mb-8 text-center flex flex-col items-center">
              <h2 className="max-w-lg mb-6 text-center text-xl font-normal tracking-tight text-white sm:text-2xl md:text-3xl capitalize" style={{ lineHeight: '1.5' }}>
                Book your appointment with Vitaway for <span className="text-gray-400 font-normal">personalized healthcare</span>
              </h2>
              <p className="max-w-xl mb-4 text-sm font-normal text-gray-400 sm:text-base md:text-lg text-center">
                Schedule your appointment today and let our dedicated team at Vitaway guide you towards a healthier and happier life.
              </p>
            </div>
            <div className="max-w-4xl mx-auto relative">
              <svg viewBox="0 0 52 24" fill="currentColor" className="absolute bottom-0 right-0 z-0 hidden w-16 -mb-6 -mr-8 text-gray-300 sm:w-24 sm:-mr-12 lg:w-32 lg:-mr-16 sm:block">
                <defs>
                  <pattern id="766323e1-e594-4ffd-a688-e7275079d540" x="0" y="0" width=".135" height=".30">
                    <circle cx="1" cy="1" r=".7"></circle>
                  </pattern>
                </defs>
                <rect fill="url(#766323e1-e594-4ffd-a688-e7275079d540)" width="52" height="24"></rect>
              </svg>
              <AppointmentForm />
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[36rem] sm:w-[48rem] md:w-[60rem] lg:w-[72rem] bg-gradient-to-tr from-[#07f394] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>
    </GuestLayout>
  );
}

export default Appointment;