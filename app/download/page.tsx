import React from 'react'
import MobileFrame from '../components/design/mobile-frame'
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';
import StoreButtons from '../components/buttons/store-buttons';

export const metadata: Metadata = {
  title: "Download Vitaway",
  description: "Download Vitaway, the ultimate virtual health companion app. Empower your wellness with comprehensive care, virtual doctor consultations, health tracking, and personalized wellness plans.",
  keywords: "Vitaway, virtual health companion, health app, wellness app, healthcare app, virtual doctor consultations, health tracking, personalized wellness plans, download app, download Vitaway, health management, wellness management, healthcare technology, health monitoring, health management app, vitaway health ltd, vitaway health, health rwanda",
  metadataBase: new URL("https://www.vitaway.org/download"),
  openGraph: {
    title: "Download Vitaway",
    description: "Download Vitaway, the ultimate virtual health companion app. Empower your wellness with comprehensive care, virtual doctor consultations, health tracking, and personalized wellness plans.",
    type: "website",
    url: "https://vitaway.com/download",
    images: [
      {
        url: "https://vitaway.com/images/vitaway-logo.png",
        width: 1200,
        height: 630,
        alt: "Vitaway Logo",
      },
    ],
  },
};

function Download() {
  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            Your plan, between visits. That is what the app is <span className="font-accent">for</span>.
          </>
        }
        description="Appointments, measurements, and coaching — on your phone after you leave the clinic."
      />

      <SectionCard className="bg-[#F6F3EE] py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
              Vitaway <span className="font-accent">Plus</span>
            </h2>
            <p className="mt-4 max-w-md text-[#003E48]/70">
              Virtual consultations, health tracking, and a plan built around the food you already cook.
            </p>
            <ul className="mt-6 max-w-md space-y-2.5">
              {[
                'Your plan and your meal guidance.',
                'Your measurements, charted against week one.',
                'Appointment reminders by SMS and in-app.',
                'Chat and Call your Coach.',
                'Messages to your own named nutritionist, not a chatbot.',
              ].map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-relaxed text-[#003E48]/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85A2E]" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <StoreButtons className="mt-8" />
            <p className="mt-4 max-w-xs text-sm text-[#003E48]/50">
              Take charge of your well-being with care that stays on your phone.
            </p>
          </div>
          <div className="flex items-end justify-center gap-4 overflow-x-auto lg:col-span-7 lg:justify-end">
            <MobileFrame title="Vitaway Blood Pressure Dashboard Screen" image="/images/screens/blood-pressure.png" width="220px" height="440px" />
            <div className="hidden sm:block">
              <MobileFrame title="Vitaway Categories Screen" image="/images/screens/Categories.png" width="250px" height="500px" />
            </div>
            <div className="hidden md:block">
              <MobileFrame title="Vitaway Weight management Screen" image="/images/screens/weight-screen.png" width="220px" height="440px" />
            </div>
          </div>
        </div>
      </SectionCard>
    </GuestLayout>
  )
}

export default Download;
