import Image from 'next/image'
import React from 'react'

function OurTeam() {
  return (<>
    <div className="team-section relative w-full h-full">
      <div className="absolute hidden w-full from-[#272749] bg-gradient-to-b lg:block h-96"></div>

      <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">

        <div className="max-w-xl mb-20 md:mx-auto sm:text-center lg:max-w-2xl md:mb-20">
          <div>
            <p className="inline-block  font-normal px-3 py-px mb-4 text-xs tracking-wider text-white uppercase rounded-full bg-teal-accent-400">
              Meet The Dream Team
            </p>
          </div>
          <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-white sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
              <svg viewBox="0 0 52 24" fill="currentColor"
                className="absolute top-9 -right-1 z-0 hidden w-28 -mt-8 -ml-20 text-blue-gray-100 lg:w-28 lg:-ml-28 lg:-mt-10 sm:block">
                <defs>
                  <pattern id="18302e52-9e2a-4c8e-9550-0cbb21b38e55" x="0" y="0" width=".135"
                    height=".30">
                    <circle cx="1" cy="1" r=".7"></circle>
                  </pattern>
                </defs>
                <rect fill="url(#18302e52-9e2a-4c8e-9550-0cbb21b38e55)" width="52" height="24">
                </rect>
              </svg>
              <span
                className="relative  font-normal bg-[#2e91ce]/50 hover:bg-[#1da1f2]/90 rounded-tl-lg rounded-br-lg px-3">
              </span>
            </span>
            Meet The Dedicated Individuals Who Make Vitaway Tick.
          </h2>
          <p className="text-base text-gray-900 md:text-lg font-merri font-normal">
            This dedicated group of individuals forms the backbone of Vitaway, and their collective expertise
            and commitment drive the mission forward.
          </p>
        </div>

        <div className="grid gap-5 mx-auto lg:grid-cols-2 lg:max-w-screen-xl mt-5">
          {/* {{-- Emmanuel HAKUZIMANA --}} */}
          <div className="grid sm:grid-cols-6">
            <div className="relative w-full !h-64 max-h-full rounded sm:h-auto sm:col-span-3 border-gray-200 border">
              <Image width={100} height={100} className="absolute object-cover object-top w-full h-full rounded bg-top"
                src="/images/members/member-1.jpg" alt="Emmanuel HAKUZIMANA" />
            </div>
            <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
              <p className="text-lg font-normal  mb-3 text-gray-900">Emmanuel HAKUZIMANA</p>
              <p className="mb-4 text-lg leading-5 text-gray-600  font-normal">Co-Founder & CEO</p>
              <p className="text-gray-700 leading-6">
                Promoting health and wellness to the community through digital
                technology.
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="https://www.linkedin.com/in/emmanuel-hakuzimana-rn-123309188/"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://x.com/Heynemjtc1"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-.139 9.237c.209 4.617-3.234 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.08-4.03 3.199-4.03.943 0 1.797.398 2.395 1.037.748-.147 1.451-.42 2.086-.796-.246.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.439.656-.996 1.234-1.639 1.697z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/heynemjtc?igsh=cGZpYWQwYXpubjY4"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* {{-- Eric NIYONGIRA --}} */}
          <div className="grid sm:grid-cols-6">
            <div className="relative w-full !h-64 max-h-full rounded sm:h-auto sm:col-span-3 border-gray-200 border">
              <Image width={100} height={100} className="absolute object-cover object-top w-full h-full rounded bg-top"
                src="/images/members/member-2.jpeg" alt="Eric NIYONGIRA" />
            </div>
            <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
              <p className="text-lg font-bold text-gray-900">Eric NIYONGIRA</p>
              <p className="mb-4 text-md leading-5 text-gray-600 mt-2  font-normal">Co-founder &
                Business Strategy Development</p>
              <p className="text-gray-700 leading-6">
                Research and developing strategies to drive innovation in the
                fields of FinTech and HealthTech. 🚀
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="https://www.linkedin.com/in/eric-niyongira-b4a6b0193/"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://x.com/EricNiyongira3"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-.139 9.237c.209 4.617-3.234 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.08-4.03 3.199-4.03.943 0 1.797.398 2.395 1.037.748-.147 1.451-.42 2.086-.796-.246.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.439.656-.996 1.234-1.639 1.697z" />
                  </svg>
                </a>
                <a href="#"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* {{-- Steven SHIMIRWA --}} */}
          <div className="grid sm:grid-cols-6">
            <div className="relative w-full !h-64 max-h-full rounded sm:h-auto sm:col-span-3 border-gray-200 border">
              <Image width={100} height={100} className="absolute object-cover object-top w-full h-full rounded bg-top"
                src="/images/members/member-3.jpg" alt="Steven SHIMIRWA" />
            </div>
            <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
              <p className="text-lg font-bold text-gray-900">Steven SHIMIRWA</p>
              <p className="mb-4 text-md leading-5 text-gray-600 mt-2  font-normal">Co-founder & Head
                of Clinical Medicine</p>
              <p className="text-gray-700 leading-6">
                Innovation powered by collaboration and critical thinking enhances
                and makes my work about health enhancement a success. </p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="https://www.linkedin.com/in/steven-shimirwa-0b4077178"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* {{-- MANIRABONA H. Patience --}} */}
          <div className="grid sm:grid-cols-6">
            <div
              className="relative w-full !h-64 max-h-full rounded sm:h-auto sm:col-span-3 border-gray-200 border">
              <Image width={100} height={100} className="absolute object-cover object-top w-full h-full rounded bg-top"
                src="/images/members/member-4.jpg" alt="MANIRABONA H. Patience" />
            </div>
            <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
              <p className="text-lg font-bold text-gray-900">Patience H. MANIRABONA</p>
              <p className="mb-4 text-md leading-5 text-gray-600 mt-2  font-normal">Software Engineer &
                Product Development</p>
              <p className="text-gray-700 leading-6">
                Software developer dedicated to creating innovative solutions for
                advancing different societies.
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="https://www.linkedin.com/in/manirabona-patience/"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://x.com/ManirabonaW"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-.139 9.237c.209 4.617-3.234 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.08-4.03 3.199-4.03.943 0 1.797.398 2.395 1.037.748-.147 1.451-.42 2.086-.796-.246.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.439.656-.996 1.234-1.639 1.697z" />
                  </svg>
                </a>
                <a href=""
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* {{-- Noella Lidvine ISINGIZWE --}} */}
          <div className="grid sm:grid-cols-6">
            <div className="relative w-full !h-64 max-h-full rounded sm:h-auto sm:col-span-3 border-gray-200 border">
              <Image width={100} height={100} className="absolute object-cover object-top w-full h-full rounded bg-top"
                src="/images/members/member-5.jpg" alt="Noella Lidvine ISINGIZWE" />
            </div>
            <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
              <p className="text-lg font-bold text-gray-900">Noella Lidvine ISINGIZWE</p>
              <p className="mb-4 text-md leading-5 text-gray-600 mt-2  font-normal">
                Gender Equality Specialist
              </p>
              <p className="text-gray-700 leading-6">
                Pursuing a Master&apos;s in Public Health at Umeå University,
                focusing on health economics and sustainable development.
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="https://www.linkedin.com/in/no%C3%ABlla-lidvine-isingizwe-706702161/"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* {{-- Faustin NZITONDA --}} */}
          <div className="grid sm:grid-cols-6">
            <div
              className="relative w-full !h-64 max-h-full rounded sm:h-auto sm:col-span-3 border-gray-200 border">
              <Image width={100} height={100} className="absolute object-cover object-top w-full h-full rounded bg-top"
                src="/images/members/member-6.jpeg" alt="Faustin NZITONDA" />
            </div>
            <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
              <p className="text-lg font-bold text-gray-900">Faustin NZITONDA</p>
              <p className="mb-4 text-md leading-5 text-gray-600 mt-2  font-normal">AI Data Engineer &
                Product Development</p>
              <p className="text-gray-700 leading-6">
                Years of experience in machine learning models, retraining models, and generating
                data analytic.
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <a href="https://www.linkedin.com/in/faustinnzitonda/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default OurTeam