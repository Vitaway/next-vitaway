import Link from 'next/link';
import React from 'react';
import GuestLayout from '../layouts/GuestLayout';
import ContactForm from '../components/forms/contact-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Vitaway today! Reach out to our dedicated team of experts and let us assist you on your healthcare journey.",
  keywords: "Vitaway, Contact, Reach Out, Healthcare, Assistance",
  metadataBase: new URL("https://www.vitaway.org"),
}

function Contact() {
  return (
    <GuestLayout>
      <div className="relative overflow-hidden bg-gradient-to-b from-[#272749] to-[#111827] h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#272749] to-[#111827] z-0"></div>

        <div className="relative z-10 px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
          <div className="flex flex-col items-center justify-between xl:flex-row z-10">
            <div className="w-full max-w-xl mb-12 xl:pr-16 xl:mb-0 xl:w-7/12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-normal tracking-tight text-white sm:text-4xl sm:leading-none">
                Contact Vitaway today, and let&apos;s connect for <span className="text-gray-400 font-normal">a Healthier tomorrow</span>
              </h2>
              <p className="max-w-xl mb-4 text-base font-normal text-gray-400 md:text-lg">
                We&apos;d love to hear from you! Reach out to our dedicated team of experts at Vitaway and let us assist you on your healthcare journey.
              </p>

              <div className="grid space-y-3 sm:gap-2 sm:grid-cols-2 sm:space-y-0">
                <ul className="space-y-3">
                  <li className="flex text-gray-400">
                    <span className="mr-1">
                      <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                        <polygon strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                      </svg>
                    </span>
                    Product information
                  </li>
                  <li className="flex text-gray-400">
                    <span className="mr-1">
                      <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                        <polygon strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                      </svg>
                    </span>
                    Any support
                  </li>
                  <li className="flex text-gray-400">
                    <span className="mr-1">
                      <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                        <polygon strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                      </svg>
                    </span>
                    Partnership opportunities
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex text-gray-400">
                    <span className="mr-1">
                      <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                        <polygon strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                      </svg>
                    </span>
                    Have question
                  </li>
                  <li className="flex text-gray-400">
                    <span className="mr-1">
                      <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                        <polygon strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                      </svg>
                    </span>
                    Feedback, or inquiries
                  </li>
                  <li className="flex text-gray-400">
                    <span className="mr-1">
                      <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                        <polygon strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                      </svg>
                    </span>
                    About us
                  </li>
                </ul>
              </div>

              <div className="col-lg-12 more-detail-buttons mt-10">
                <a href="https://wa.me/250787279560" rel="noopener" target="__blank">
                  <button type="button" className="text-white font-normal bg-green-600 hover:bg-green-600/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
                    Use Whatsapp
                  </button>
                </a>
                <Link href="/download">
                  <button type="button" className="text-gray-900 font-normal bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
                    Download The app
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
              <div className="relative">
                <svg viewBox="0 0 52 24" fill="currentColor" className="absolute bottom-0 right-0 z-0 hidden w-32 -mb-8 -mr-20 text-gray-300 lg:w-32 lg:-mr-16 sm:block">
                  <defs>
                    <pattern id="766323e1-e594-4ffd-a688-e7275079d540" x="0" y="0" width=".135" height=".30">
                      <circle cx="1" cy="1" r=".7"></circle>
                    </pattern>
                  </defs>
                  <rect fill="url(#766323e1-e594-4ffd-a688-e7275079d540)" width="52" height="24"></rect>
                </svg>

                {/* contact Form */}
                <ContactForm />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#07f394] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>
    </GuestLayout>
  );
}

export default Contact;