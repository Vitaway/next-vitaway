import Image from 'next/image'
import Link from 'next/link';
import React from 'react';
import membersData from '../../content/members.json';
import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the dedicated individuals who make Vitaway tick. Our team is committed to providing the best healthcare services.",
  keywords: "Vitaway, Our Team, Healthcare, Medical Professionals",
  metadataBase: new URL("https://www.vitaway.org"),
};


function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path opacity=".6" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path opacity=".6" d="M17.636 7h.012" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 4.5c-.875.388-1.823.65-2.825.77 1.015-.609 1.8-1.574 2.165-2.723-.951.564-2.005.975-3.125 1.2-.896-.96-2.173-1.56-3.588-1.56-2.725 0-4.938 2.213-4.938 4.938 0 .388.044.766.125 1.125-4.1-.206-7.725-2.163-10.15-5.15-.425.725-.669 1.574-.669 2.475 0 1.7.863 3.2 2.175 4.075-.8-.025-1.55-.25-2.2-.625v.05c0 2.375 1.688 4.35 3.925 4.8-.413.113-.85.175-1.3.175-.313 0-.613-.038-.913-.1.613 1.925 2.388 3.325 4.5 3.363-1.65 1.3-3.738 2.075-6 2.075-.388 0-.775-.025-1.15-.075 2.138 1.375 4.675 2.175 7.4 2.175 8.85 0 13.725-7.35 13.725-13.725 0-.2-.013-.4-.025-.6.938-.675 1.75-1.525 2.4-2.475z" />
    </svg>
  );
}

function SocialLinks({ social_media }: { social_media: { linkedin?: string; twitter?: string; instagram?: string } }) {
  return (
    <div className="flex items-center space-x-3 mt-4">
      {social_media?.linkedin && (
        <a href={social_media.linkedin} target="_blank" rel="noreferrer"
          className="text-gray-400 hover:text-[#003E48] transition-colors duration-300">
          <LinkedInIcon />
        </a>
      )}
      {social_media?.instagram && (
        <a href={social_media.instagram} target="_blank" rel="noreferrer"
          className="text-gray-400 hover:text-[#003E48] transition-colors duration-300">
          <InstagramIcon />
        </a>
      )}
      {social_media?.twitter && (
        <a href={social_media.twitter} target="_blank" rel="noreferrer"
          className="text-gray-400 hover:text-[#003E48] transition-colors duration-300">
          <TwitterIcon />
        </a>
      )}
    </div>
  );
}


function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="max-w-xl mb-10 sm:text-left lg:max-w-2xl md:mb-10 mt-10">
      <p className="inline-block font-normal py-px mb-4 text-xs tracking-wider text-[#003E48] uppercase rounded-full bg-teal-accent-400">
        {label}
      </p>
      <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-[#003E48] sm:text-4xl">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        <div className="h-1 w-12 rounded-full bg-[#003E48]" />
        <div className="h-1 w-6 rounded-full bg-[#003E48] opacity-40" />
        <div className="h-1 w-3 rounded-full bg-[#003E48] opacity-20" />
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: any }) {
  return (
    <Link
      href={`/our-team/members/${member.slug}`}
      className="grid sm:grid-cols-6 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors duration-200"
    >
      <div className="relative w-full !h-64 max-h-full rounded-xl sm:h-auto sm:col-span-3 border-gray-200 border overflow-hidden">
        <Image
          width={500}
          height={500}
          className="absolute object-cover object-top w-full h-full rounded-xl bg-top"
          src={member.image}
          alt={member.name}
        />
      </div>
      <div className="flex flex-col mt-2 sm:mt-0 sm:p-5 sm:col-span-3">
        <p className="text-lg font-bold text-gray-900">{member.name}</p>
        <p className="mb-4 text-sm leading-5 text-[#003E48] mt-1 font-medium">{member.role}</p>
        <p className="text-slate-600 text-sm leading-6 line-clamp-4">{member.description}</p>
        <SocialLinks social_media={member.social_media} />
      </div>
    </Link>
  );
}


function TeamSection({ label, title, members }: { label: string; title: string; members: any[] }) {
  if (!members || members.length === 0) return null;

  return (
    <div className="relative bg-white rounded-xl px-3 py-2 md:px-10 md:py-5 mb-6">
      <SectionHeader label={label} title={title} />
      <div className="grid gap-5 mx-auto lg:grid-cols-2 lg:max-w-screen-xl mt-2 md:mt-5">
        {members.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}


function CeoMessage({ ceo }: { ceo: any }) {
  return (
    <div className="relative bg-white rounded-xl px-3 py-2 md:px-10 md:py-8 mb-6">
      <SectionHeader label="A Word From Our Founder" title="CEO's Message" />

      <div className="flex flex-col md:flex-row gap-8 items-start lg:max-w-screen-xl mt-2 md:mt-5">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="relative w-58 h-58 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Image
              width={200}
              height={200}
              className="object-cover object-top w-full h-full"
              src={ceo.image}
              alt={ceo.name}
            />
          </div>
          <div className="mt-3 text-left">
            <p className="font-bold text-gray-900 text-base">{ceo.name}</p>
            <p className="text-xs text-[#003E48] font-medium mt-1">{ceo.postion}</p>
          </div>
        </div>

        {/* Message */}
        <div className="flex-1">
          {/* Opening quote mark */}
          <svg className="w-10 h-10 text-[#003E48] opacity-20 mb-2" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>

          <p className="text-slate-600 text-base leading-7 italic">
            {ceo.message}
          </p>
        </div>
      </div>
    </div>
  );
}

function OurTeam() {
  const { ceo_message, advisory_boad, clinical_members, coaching_team } = membersData;

  return (
    <GuestLayout>
      <div className="team-section relative w-full h-full">
        {/* Hero gradient */}
        <div className="absolute w-full bg-gradient-to-b from-[#003E48] to-[#282e33] lg:block h-[500px]" />

        <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">

          {/* Page Header */}
          <div className="max-w-xl mb-20 md:mx-auto sm:text-center lg:max-w-2xl md:mb-20">
            <p className="inline-block font-normal px-3 py-px mb-4 text-xs tracking-wider text-white uppercase rounded-full bg-teal-accent-400">
              Meet the Team Behind Your Health
            </p>
            <h2 className="max-w-lg font-bold mb-6 text-3xl leading-none tracking-tight text-white sm:text-4xl md:mx-auto">
              <span className="relative inline-block">
                <svg viewBox="0 0 52 24" fill="currentColor"
                  className="absolute top-9 -right-1 z-0 hidden w-28 -mt-8 -ml-20 text-blue-gray-100 lg:w-28 lg:-ml-28 lg:-mt-10 sm:block">
                  <defs>
                    <pattern id="dot-pattern" x="0" y="0" width=".135" height=".30">
                      <circle cx="1" cy="1" r=".7" />
                    </pattern>
                  </defs>
                  <rect fill="url(#dot-pattern)" width="52" height="24" />
                </svg>
              </span>
              Our Experts &amp; Leadership
            </h2>
            <p className="text-base text-gray-200 md:text-lg font-merri font-normal">
              This dedicated group of individuals forms the backbone of Vitaway, and their collective expertise
              and commitment drive the mission forward.
            </p>
          </div>

          {/* CEO Message */}
          {ceo_message?.[0] && (
            <CeoMessage ceo={ceo_message[0]} />
          )}

          {/* Clinical & Nutrition Team */}
          <TeamSection
            label="Meet the Team Behind Your Health"
            title="Clinical & Nutrition Team"
            members={clinical_members}
          />

          {/* Coaching Team */}
          <TeamSection
            label="Meet the Team Behind Your Health"
            title="Coaching Team"
            members={coaching_team}
          />

          {/* Advisory Board */}
          <TeamSection
            label="Meet the Team Behind Your Health"
            title="Advisory Board"
            members={advisory_boad}
          />
        </div>
      </div>
    </GuestLayout>
  );
}

export default OurTeam;