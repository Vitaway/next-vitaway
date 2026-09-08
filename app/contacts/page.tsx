import Link from 'next/link';
import React from 'react';
import GuestLayout from '../layouts/GuestLayout';
import ContactForm from '../components/forms/contact-form';
import { Metadata } from 'next';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';

export const metadata: Metadata = {
  title: "Contact Vitaway Health | Schedule Your Health Consultation Today",
  description: "Get in touch with Vitaway Health's expert team in Kigali, Rwanda. Schedule a nutrition consultation, book a health assessment, or reach out for personalized healthcare guidance. Located in Kimironko with online services available.",
  keywords: [
    "contact Vitaway Health",
    "health consultation Kigali",
    "nutrition appointment Rwanda",
    "healthcare contact Kimironko",
    "book health assessment",
    "nutrition consultation booking",
    "Vitaway Health location",
    "healthcare services contact",
    "wellness consultation Rwanda",
    "health coaching contact"
  ],
  openGraph: {
    title: "Contact Vitaway Health | Schedule Your Health Consultation Today",
    description: "Get in touch with Vitaway Health's expert team in Kigali, Rwanda. Schedule consultations, book assessments, or reach out for personalized healthcare guidance.",
    type: "website",
    url: "https://www.vitaway.org/contacts",
    images: [
      {
        url: "/images/contact-vitaway.png",
        width: 1200,
        height: 630,
        alt: "Contact Vitaway Health - Healthcare Consultation in Kigali, Rwanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Vitaway Health | Schedule Your Health Consultation",
    description: "Get in touch with Vitaway Health's expert team in Kigali, Rwanda. Schedule consultations and personalized healthcare guidance.",
    images: ["/images/contact-vitaway.png"],
  },
  alternates: {
    canonical: "https://www.vitaway.org/contacts",
  },
};

const topics = [
  'Product information',
  'Any support',
  'Partnership opportunities',
  'Questions',
  'Feedback or inquiries',
  'About us',
];

function Contact() {
  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            Write to us. We will get you to the right <span className="font-accent">person</span>.
          </>
        }
        description="The clinic is in Niboye, Kicukiro. WhatsApp, email, or the form — we answer."
      />

      <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 lg:grid-cols-12 lg:gap-14 lg:px-12">
          <div className="lg:col-span-6">
            <h2 className="max-w-md text-2xl font-bold tracking-tight text-[#003E48] sm:text-3xl">
              What people usually write <span className="font-accent">about</span>
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {topics.map((topic) => (
                <li key={topic} className="rounded-[20px] bg-white px-4 py-3 text-sm font-medium text-[#003E48]">
                  {topic}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/250787279560"
                rel="noopener noreferrer"
                target="_blank"
                className="press-btn"
              >
                WhatsApp us
              </a>
              <Link
                href="/download"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#003E48] hover:bg-white/80"
              >
                Download the app
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </SectionCard>
    </GuestLayout>
  );
}

export default Contact;
