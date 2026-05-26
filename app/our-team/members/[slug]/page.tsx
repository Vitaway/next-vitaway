'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from 'next/navigation';
import GuestLayout from "@/app/layouts/GuestLayout";
import membersData from '@/content/members.json';
import Head from "next/head";

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

/**
 * Flatten all member categories into one searchable list,
 * tagging each entry with its team label.
 */
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
      <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
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
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-[#003E48] hover:border-[#003E48] transition-all duration-200"
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
      className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 mb-6 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="group-hover:-translate-x-1 transition-transform duration-200"
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
        <title>{member.name} — Vitaway Health</title>
        <meta name="description" content={member.bio || member.description} />
        <meta name="keywords" content="Vitaway, Our Team, Healthcare, Medical Professionals" />
        <meta property="og:title" content={member.name} />
        <meta property="og:description" content={member.bio || member.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.vitaway.org" />
        <meta property="og:image" content={member.image} />
      </Head>

      <div className="team-section relative w-full h-full">
        {/* Hero gradient */}
        <div className="absolute w-full bg-gradient-to-b from-[#003E48] to-[#282e33] lg:block h-[500px]" />

        <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">

          {/* Back link */}
          <BackButton />

          {/* Hero header */}
          <div className="max-w-xl mb-16 md:mx-auto sm:text-center lg:max-w-2xl md:mb-16">
            {member.teamLabel && (
              <p className="inline-block font-normal px-3 py-px mb-4 text-xs tracking-wider text-white uppercase rounded-full bg-teal-accent-400">
                {member.teamLabel}
              </p>
            )}
            <h2 className="max-w-lg font-bold mb-4 text-4xl leading-tight tracking-tight text-white sm:text-4xl md:mx-auto">
              {member.name}
            </h2>
            <p className="text-base text-[#7ecfc0] md:text-lg font-medium">
              {member.role}
            </p>
          </div>

          {/* Content card */}
          <div className="relative bg-white rounded-3xl">
            <section className="bg-white rounded-3xl px-4 py-6 md:px-10 md:py-10">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 xl:gap-x-16 gap-y-10 items-start">

                  {/* Photo column */}
                  <div className="relative lg:mb-8">
                    {/* Decorative dots */}
                    <Image
                      width={100}
                      height={100}
                      className="absolute -right-0 -bottom-8 xl:-bottom-12 xl:-right-4 hidden lg:block"
                      src="https://cdn.rareblocks.xyz/collection/celebration/images/content/3/dots-pattern.svg"
                      alt=""
                    />
                    <div className="pl-0 pr-0 sm:pl-6 sm:pr-6">
                      <Image
                        width={600}
                        height={500}
                        className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl mx-auto object-cover object-top"
                        src={member.image}
                        alt={member.name}
                      />
                    </div>

                    {/* Role badge under photo */}
                    <div className="mt-6 sm:pl-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gray-100" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#003E48] whitespace-nowrap">
                        {member.role}
                      </span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                  </div>

                  {/* Bio column */}
                  <div className="2xl:pl-8 flex flex-col">
                    {/* Short description */}
                    <p className="text-base font-semibold leading-snug text-[#003E48] sm:text-lg lg:text-xl border-l-4 border-[#003E48] pl-4">
                      {member.description}
                    </p>

                    {/* Divider */}
                    {member.bio && (
                      <>
                        <div className="my-6 flex items-center gap-2">
                          <div className="h-px flex-1 bg-gray-100" />
                          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            About
                          </span>
                          <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        {/* Full bio */}
                        <p className="text-base leading-relaxed text-gray-600">
                          {member.bio}
                        </p>
                      </>
                    )}

                    {/* Social links */}
                    <SocialLinks social_media={member.social_media} />

                    {/* Appointment CTA */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-4">
                        Ready to take the next step in your health journey?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/appointments/book?member=${member.slug}`}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003E48] text-white text-sm font-semibold rounded-xl hover:bg-[#005060] active:scale-95 transition-all duration-200 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Book an Appointment
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#003E48] text-[#003E48] text-sm font-semibold rounded-xl hover:bg-[#003E48]/5 active:scale-95 transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          Send a Message
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </GuestLayout>
  );
}