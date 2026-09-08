/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from 'next/navigation';
import GuestLayout from "@/app/layouts/GuestLayout";
import membersData from '@/content/members.json';
import Head from "next/head";
import PageHeader from "@/app/components/headers/page-header";
import SectionCard from "@/app/components/sections/section-card";
import PressButton from "@/app/components/buttons/press-button";
import { memberImageClass } from "@/lib/member-image-focus";

// ─── Types ────────────────────────────────────────────────────────────────────

type SocialMedia = {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
};

type Member = {
  name: string;
  slug: string;
  role: string;
  description: string;
  image: string;
  bio?: string;
  social_media?: SocialMedia;
  teamLabel?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAllMembers(): Member[] {
  const { advisory_boad, clinical_members, coaching_team } = membersData;

  const tagged = (list: any[], label: string): Member[] =>
    (list ?? []).map((m) => ({ ...m, teamLabel: label }));

  return [
    ...tagged(advisory_boad, "Advisory Board"),
    ...tagged(clinical_members, "Clinical & Nutrition Team"),
    ...tagged(coaching_team, "Coaching Team"),
  ];
}

function accentName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return <span className="font-accent">{parts[0]}</span>;
  }
  const last = parts.pop();
  return (
    <>
      {parts.join(' ')} <span className="font-accent">{last}</span>
    </>
  );
}

// ─── Social Icons ─────────────────────────────────────────────────────────────

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

function SocialLinks({ social_media }: { social_media?: SocialMedia }) {
  if (!social_media) return null;

  const links = [
    { href: social_media.linkedin, icon: <LinkedInIcon />, label: "LinkedIn" },
    { href: social_media.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { href: social_media.twitter, icon: <TwitterIcon />, label: "Twitter / X" },
  ].filter((l) => !!l.href);

  if (links.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-medium text-[#003E48]/55">
        Connect
      </p>
      <div className="flex items-center gap-3">
        {links.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F3EE] text-[#003E48]/55 transition-all duration-200 hover:bg-[#003E48] hover:text-white"
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Back Button ──────────────────────────────────────────────────────────────

function BackButton() {
  return (
    <Link
      href="/our-team"
      className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#E85A2E] transition-colors duration-200 hover:underline"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:-translate-x-1"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Back to Our Team
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberPage() {
  const { slug } = useParams();
  const allMembers = getAllMembers();
  const member = allMembers.find((m) => m.slug === slug);

  if (!member) return notFound();

  return (
    <GuestLayout>
      <Head>
        <title>{member.name}; Vitaway Health</title>
        <meta name="description" content={member.bio || member.description} />
        <meta name="keywords" content="Vitaway, Our Team, Healthcare, Medical Professionals" />
        <meta property="og:title" content={member.name} />
        <meta property="og:description" content={member.bio || member.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.vitaway.org" />
        <meta property="og:image" content={member.image} />
      </Head>

      <PageHeader
        title={accentName(member.name)}
        description={member.role}
        backgroundImage={member.image}
        imageClassName={memberImageClass(member.slug, 'object-cover object-[center_20%]')}
        className="min-h-[300px] sm:min-h-[360px]"
      />

      <SectionCard className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
          <BackButton />

          <div className="grid grid-cols-1 items-start gap-x-10 gap-y-10 lg:grid-cols-2 xl:gap-x-16">
            <div>
              <div className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-[#EEF6F4] sm:min-h-[440px] sm:rounded-[28px]">
                <Image
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className={memberImageClass(member.slug)}
                  src={member.image}
                  alt={member.name}
                />
              </div>
              <p className="mt-4 text-sm font-medium text-[#E85A2E]">
                {member.role}
              </p>
            </div>

            <div className="flex flex-col">
              <p className="text-base font-semibold leading-snug text-[#003E48] sm:text-lg lg:text-xl">
                {member.description}
              </p>

              {member.bio && (
                <p className="mt-6 text-base leading-relaxed text-[#003E48]/70">
                  {member.bio}
                </p>
              )}

              <SocialLinks social_media={member.social_media} />

              {member.teamLabel != "Advisory Board" && (
                <div className="mt-8">
                  <p className="mb-4 text-sm text-[#003E48]/60">
                    Ready to take the next step in your health journey?
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <PressButton href={`/appointments/book?member=${member.slug}`}>
                      Book an Appointment
                    </PressButton>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-full bg-[#F6F3EE] px-6 py-3 text-sm font-semibold text-[#003E48] hover:bg-[#E8F7F4]"
                    >
                      Send a Message
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </GuestLayout>
  );
}
