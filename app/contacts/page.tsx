import Link from 'next/link'
import React from 'react'

function Contact() {
  return (<>
    <div className="overflow-hidden bg-gradient-to-b from-[#272749] to-[#111827]">
      <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
        <div className="flex flex-col items-center justify-between xl:flex-row">
          <div className="w-full max-w-xl mb-12 xl:pr-16 xl:mb-0 xl:w-7/12">
            <h2
              className="max-w-lg mb-6 font-sans text-3xl font-normal  tracking-tight text-white sm:text-4xl sm:leading-none">
              Contact Vitaway today, and let&apos;s connect for <span
                className="text-gray-400 font-normal ">a Healthier tomorrow</span>
            </h2>
            <p className="max-w-xl mb-4 text-base font-normal  text-gray-400 md:text-lg">
              We&apos;d love to hear from you! Reach out to our dedicated team of experts at Vitaway and let us
              assist you on your healthcare journey.
            </p>

            <div className="grid space-y-3 sm:gap-2 sm:grid-cols-2 sm:space-y-0">
              <ul className="space-y-3">
                <li className="flex text-gray-400">
                  <span className="mr-1">
                    <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                      <polygon strokeWidth="4" stroke-linecap="round" stroke-linejoin="round"
                        fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                    </svg>
                  </span>
                  Product information
                </li>
                <li className="flex text-gray-400">
                  <span className="mr-1">
                    <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                      <polygon strokeWidth="4" stroke-linecap="round" stroke-linejoin="round"
                        fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                    </svg>
                  </span>
                  Any support
                </li>
                <li className="flex text-gray-400">
                  <span className="mr-1">
                    <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                      <polygon strokeWidth="4" stroke-linecap="round" stroke-linejoin="round"
                        fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                    </svg>
                  </span>
                  Partnership opportunities
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex text-gray-400">
                  <span className="mr-1">
                    <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                      <polygon strokeWidth="4" stroke-linecap="round" stroke-linejoin="round"
                        fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                    </svg>
                  </span>
                  Have question
                </li>
                <li className="flex text-gray-400">
                  <span className="mr-1">
                    <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                      <polygon strokeWidth="4" stroke-linecap="round" stroke-linejoin="round"
                        fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                    </svg>
                  </span>
                  Feedback, or inquiries
                </li>
                <li className="flex text-gray-400">
                  <span className="mr-1">
                    <svg className="w-5 h-5 mt-px text-gray-400" stroke="currentColor" viewBox="0 0 52 52">
                      <polygon strokeWidth="4" stroke-linecap="round" stroke-linejoin="round"
                        fill="none" points="29 13 14 29 25 29 23 39 38 23 27 23"></polygon>
                    </svg>
                  </span>
                  About us
                </li>
              </ul>
            </div>

            <div className="col-lg-12 more-detail-buttons mt-10">
              <a href="https://wa.me/250787279560" rel="noopener" target="__blank">
                <button type="button"
                  className="text-white  font-normal bg-green-600 hover:bg-green-600/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
                  Use Whatsapp
                </button>
              </a>
              <Link href="/download">
                <button type="button"
                  className="text-gray-900  font-normal bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
                  Download The app
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
            <div className="relative">
              <svg viewBox="0 0 52 24" fill="currentColor"
                className="absolute bottom-0 right-0 z-0 hidden w-32 -mb-8 -mr-20 text-gray-300 lg:w-32 lg:-mr-16 sm:block">
                <defs>
                  <pattern id="766323e1-e594-4ffd-a688-e7275079d540" x="0" y="0" width=".135"
                    height=".30">
                    <circle cx="1" cy="1" r=".7"></circle>
                  </pattern>
                </defs>
                <rect fill="url(#766323e1-e594-4ffd-a688-e7275079d540)" width="52" height="24">
                </rect>
              </svg>
              <div className="relative bg-white rounded-xl shadow-2xl p-7 sm:p-10 text-slate-700">
                <h3 className="mb-4 text-xl font-normal  sm:text-center sm:mb-6 sm:text-2xl">
                  Connect With Vitaway
                </h3>
                <div>
                  <form>
                    <div className="mb-1 sm:mb-2">
                      <label className="inline-block mb-1 font-normal ">Fullname</label>
                      <input v-model="payload.fullname" placeholder="Use Fullname" type="text" className="flex-grow w-full h-12 px-4 mb-2 font-normal  transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline" id="fullname" name="fullname" />
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label className="inline-block mb-1 font-normal ">E-mail</label>
                      <input v-model="payload.email" placeholder="john.doe@example.org" type="text" className="flex-grow w-full h-12 px-4 mb-2 font-normal  transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline" id="email" name="email" />
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label className="inline-block mb-1 font-normal ">Message</label>
                      <textarea v-model="payload.message" placeholder="Write a Message..." className="flex-grow w-full h-14 px-4 py-3 mb-2 font-normal  transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    <div className="mt-4 mb-2 sm:mb-4">
                      <button type="button" className="relative inline-flex items-center justify-center w-full h-12 px-6 font-normal  tracking-wide text-white transition duration-200 rounded bg-indigo-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none">
                        Contact
                        <div v-if="isLoading" className="absolute right-0 left-0 bottom-0 top-0 flex items-center rounded justify-center bg-slate-900/30">
                          <span className="inline-flex h-6 w-6 animate-spin rounded-full border-4 border-dotted border-gray-200"></span>
                        </div>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 sm:text-sm font-normal ">
                      We respect your privacy. <span className="text-green-600"></span>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  </>)
}

export default Contact