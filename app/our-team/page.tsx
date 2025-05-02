import Image from 'next/image'
import Link from 'next/link';
import React from 'react';
import members from '../../content/members.json';
import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the dedicated individuals who make Vitaway tick. Our team is committed to providing the best healthcare services.",
  keywords: "Vitaway, Our Team, Healthcare, Medical Professionals",
  metadataBase: new URL("https://www.vitaway.org"),
};

function OurTeam() {
  return (<>
    <GuestLayout>
      <div className="team-section relative w-full h-full">
        <div className="absolute w-full bg-gradient-to-b from-[#003E48] to-[#282e33] lg:block h-[500px]"></div>

        <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
          {/* Header */}
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
            <p className="text-base text-gray-200 md:text-lg font-merri font-normal">
              This dedicated group of individuals forms the backbone of Vitaway, and their collective expertise
              and commitment drive the mission forward.
            </p>
          </div>

          <div className="relative bg-white rounded-xl px-3 py-2 md:px-10 md:py-5">
            <div className="grid gap-5 mx-auto lg:grid-cols-2 lg:max-w-screen-xl mt-2 md:mt-5">
              {members && members.map((member, index) => (
                <Link href={`/our-team/members/${member.slug}`} className="grid sm:grid-cols-6 hover:bg-gray-50 rounded-xl cursor-pointer" key={index}>
                  <div className="relative w-full !h-64 max-h-full rounded-xl sm:h-auto sm:col-span-3 border-gray-200 border">
                    <Image width={500} height={500} className="absolute object-cover object-top w-full h-full rounded-xl bg-top" src={member.image} alt={member.name} />
                  </div>
                  <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
                    <p className="text-lg font-bold text-gray-900">{member.name}</p>
                    <p className="mb-4 text-sm leading-5 text-slate-600 mt-2  font-normal">{member.role}</p>
                    <p className="text-slate-700 text-base leading-6 line-clamp-4">
                      {member.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-4">
                      {/* Linkendin */}
                      <a href={member.social_media.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>

                      {/* Instagram */}
                      <a href={member.social_media.instagram} target="_blank" rel="noreferrer" className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".34" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".34" d="M17.636 7h.012" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      </a>

                      {/* Twitter */}
                      <a href={member.social_media.twitter} target="_blank" rel="noreferrer" className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M24 4.5c-.875.388-1.823.65-2.825.77 1.015-.609 1.8-1.574 2.165-2.723-.951.564-2.005.975-3.125 1.2-.896-.96-2.173-1.56-3.588-1.56-2.725 0-4.938 2.213-4.938 4.938 0 .388.044.766.125 1.125-4.1-.206-7.725-2.163-10.15-5.15-.425.725-.669 1.574-.669 2.475 0 1.7.863 3.2 2.175 4.075-.8-.025-1.55-.25-2.2-.625v.05c0 2.375 1.688 4.35 3.925 4.8-.413.113-.85.175-1.3.175-.313 0-.613-.038-.913-.1.613 1.925 2.388 3.325 4.5 3.363-1.65 1.3-3.738 2.075-6 2.075-.388 0-.775-.025-1.15-.075 2.138 1.375 4.675 2.175 7.4 2.175 8.85 0 13.725-7.35 13.725-13.725 0-.2-.013-.4-.025-.6.938-.675 1.75-1.525 2.4-2.475z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  </>)
}

export default OurTeam