import React, { Suspense } from 'react';
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';
import AppointmentForm from '../components/forms/appointment-form';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule your appointment with Vitaway today! Let our healthcare experts assist you on your wellness journey.",
  keywords: "Vitaway, Appointment, Book, Healthcare, Wellness, Schedule",
  metadataBase: new URL("https://www.vitaway.org"),
};

function Appointment() {
  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            Book a visit. About an <span className="font-accent">hour</span>.
          </>
        }
        description="Pick a day and a time. Name and phone are enough. Email and a note are optional."
      />

      <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
          <Suspense fallback={null}>
            <AppointmentForm />
          </Suspense>
        </div>
      </SectionCard>
    </GuestLayout>
  );
}

export default Appointment;
