import Image from 'next/image'
import React from 'react'
import MobileFrame from '../components/design/mobile-frame'
import GuestLayout from '../layouts/GuestLayout';
import { Metadata } from 'next';

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
  return (<>
    <GuestLayout>
      <div className="relative bg-white overflow-hidden border-t">
        <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">

          <div className="absolute inset-0">
            <div className="absolute inset-y-0 z-0 w-full h-full bg-gradient-to-b from-[#003E48] to-[#282e33] lg:w-3/6"></div>
          </div>

          <div className="relative">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center md:pr-10 xl:pr-0 lg:max-w-lg">
                <div className="max-w-xl mb-6 section-title-content">
                  <h2 className="mb-6 font-semibold text-3xl tracking-tight text-white sm:text-4xl sm:leading-none">
                    <span className="relative inline-block">
                      <svg viewBox="0 0 52 24" fill="currentColor" className="absolute top-0 left-28 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-32 lg:-mt-10 sm:block">
                        <defs>
                          <pattern id="6b0188f3-b7a1-4e9b-b95e-cad916bb3042" x="0" y="0" width=".135" height=".30">
                            <circle cx="1" cy="1" r=".7"></circle>
                          </pattern>
                        </defs>
                        <rect fill="url(#6b0188f3-b7a1-4e9b-b95e-cad916bb3042)" width="52" height="24"></rect>
                      </svg>
                      <span className="relative  font-normal bg-[#2e91ce]/50 hover:bg-[#1da1f2]/90 rounded-tl-lg rounded-br-lg px-3">All-in-One</span>
                    </span>
                    <span className='ml-2'> Virtual Health Companion
                      Empowering Your Wellness <br /> Comprehensive Care</span>
                  </h2>
                  <p className="text-base text-gray-300 md:text-lg">
                    Designed to improve your healthcare experience,
                    from virtual doctor consultations to health tracking and personalized wellness plans.
                  </p>
                  <hr className="my-8 border-gray-600" />
                  <div className="flex items-center mb-3 sm:justify-left">
                    <a href="https://apps.apple.com/rw/app/vitaway-plus/id6745190821" target='__blank' className="mr-3 transition duration-300 hover:shadow-lg">
                      <Image width={100} height={100} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1000px-Download_on_the_App_Store_Badge.svg.png" className="object-cover object-top w-32 mx-auto" alt="Download Vitaway From App Store" />
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=org.vitaway.app" target='__blank' className="transition duration-300 hover:shadow-lg">
                      <Image width={100} height={100} src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1000px-Google_Play_Store_badge_EN.svg.png" className="object-cover object-top w-32 mx-auto" alt="Download Vitaway From Google Play Store" />
                    </a>
                  </div>
                  <p className="max-w-xs text-xs text-gray-300 sm:text-sm sm:max-w-sm">
                    Take charge of your well-being with convenience and comprehensive care at your fingertips.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6 pl-0 ml-0 md:pl-8 md:ml-20">
                <div className="flex flex-col items-center">
                  <MobileFrame
                    title='Vitaway Blood Pressure Dashboard Screen'
                    image='/images/screens/blood-pressure.png'
                    width='250px'
                    height='500px'
                  />
                </div>

                <div className="flex flex-col items-center">
                  <MobileFrame
                    title='Vitaway Categories Screen'
                    image='/images/screens/Categories.png'
                    width='280px'
                    height='580px'
                  />
                </div>

                <div className="flex flex-col items-center">
                  <MobileFrame
                    title='Vitaway Weight management Screen'
                    image='/images/screens/weight-screen.png'
                    width='250px'
                    height='500px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  </>)
}

export default Download;