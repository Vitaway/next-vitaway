/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import Link from 'next/link';
import React from 'react';
import membersData from '../../content/members.json';
import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';
import { memberImageClass } from '@/lib/member-image-focus';

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
    <div className="mt-4 flex items-center space-x-3">
      {social_media?.linkedin && (
        <a href={social_media.linkedin} target="_blank" rel="noreferrer"
          className="text-[#003E48]/40 transition-colors duration-300 hover:text-[#E85A2E]">
          <LinkedInIcon />
        </a>
      )}
      {social_media?.instagram && (
        <a href={social_media.instagram} target="_blank" rel="noreferrer"
          className="text-[#003E48]/40 transition-colors duration-300 hover:text-[#E85A2E]">
          <InstagramIcon />
        </a>
      )}
      {social_media?.twitter && (
        <a href={social_media.twitter} target="_blank" rel="noreferrer"
          className="text-[#003E48]/40 transition-colors duration-300 hover:text-[#E85A2E]">
          <TwitterIcon />
        </a>
      )}
    </div>
  );
}


function MemberCard({ member, cardClass }: { member: any; cardClass: string }) {
  return (
    <Link
      href={`/our-team/members/${member.slug}`}
      className={`grid overflow-hidden rounded-[24px] transition duration-200 sm:grid-cols-6 ${cardClass}`}
    >
      <div className="relative h-72 w-full overflow-hidden bg-[#EEF6F4] sm:col-span-3 sm:h-full sm:min-h-[300px]">
        <Image
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
          className={memberImageClass(member.slug)}
          src={member.image}
          alt={member.name}
        />
      </div>
      <div className="flex flex-col p-5 sm:col-span-3">
        <p className="text-lg font-bold text-[#003E48]">{member.name}</p>
        <p className="mt-1 mb-4 text-sm font-medium leading-5 text-[#E85A2E]">{member.role}</p>
        <p className="line-clamp-4 text-sm leading-6 text-[#003E48]/65">{member.description}</p>
        <SocialLinks social_media={member.social_media} />
      </div>
    </Link>
  );
}


function TeamSection({
  title,
  members,
  className,
  cardClass,
}: {
  title: React.ReactNode;
  members: any[];
  className: string;
  cardClass: string;
}) {
  if (!members || members.length === 0) return null;

  return (
    <SectionCard className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
        <h2 className="max-w-lg text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {members.map((member, index) => (
            <MemberCard key={index} member={member} cardClass={cardClass} />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}


function CeoMessage({ ceo }: { ceo: any }) {
  return (
    <SectionCard className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 lg:grid-cols-12 lg:gap-14 lg:px-12">
        <div className="lg:col-span-4">
          <div className="relative min-h-[320px] overflow-hidden rounded-[24px] sm:min-h-[380px] sm:rounded-[28px]">
            <Image
              fill
              sizes="(min-width: 1024px) 28vw, 100vw"
              className={memberImageClass(ceo.slug, 'object-cover object-[center_18%]')}
              src={ceo.image}
              alt={ceo.name}
            />
          </div>
          <div className="mt-4">
            <p className="text-base font-bold text-[#003E48]">{ceo.name}</p>
            <p className="mt-1 text-sm font-medium text-[#E85A2E]">{ceo.postion}</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <h2 className="text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
            CEO&apos;s <span className="font-accent">Message</span>
          </h2>
          <svg className="mb-2 mt-6 h-10 w-10 text-[#003E48] opacity-20" fill="currentColor" viewBox="0 0 32 32" aria-hidden>
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="text-base italic leading-7 text-[#003E48]/70">
            {ceo.message}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function OurTeam() {
  const { ceo_message, advisory_boad, clinical_members, coaching_team } = membersData;

  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            Our Experts &amp; <span className="font-accent">Leadership</span>
          </>
        }
        description="This dedicated group of individuals forms the backbone of Vitaway, and their collective expertise and commitment drive the mission forward."
        backgroundImage="/images/Gallery/image-12.jpg"
        imageClassName="object-cover object-[center_28%]"
        className="min-h-[320px] sm:min-h-[400px]"
      />

      {ceo_message?.[0] && (
        <CeoMessage ceo={ceo_message[0]} />
      )}

      <TeamSection
        title={<>Advisory <span className="font-accent">Board</span></>}
        members={advisory_boad}
        className="bg-[#F6F3EE]"
        cardClass="bg-white"
      />

      <TeamSection
        title={<>Clinical &amp; Nutrition <span className="font-accent">Team</span></>}
        members={clinical_members}
        className="bg-white"
        cardClass="bg-[#F6F3EE]"
      />

      <TeamSection
        title={<>Coaching <span className="font-accent">Team</span></>}
        members={coaching_team}
        className="bg-[#F6F3EE]"
        cardClass="bg-white"
      />
    </GuestLayout>
  );
}

export default OurTeam;
