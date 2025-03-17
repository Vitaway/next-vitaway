'use client';

import Image from "next/image";
import { notFound, useParams } from 'next/navigation';
import GuestLayout from "@/app/layouts/GuestLayout";
import members from '@/content/members.json';
import Head from "next/head";

export default function MemberPage() {
  const { slug } = useParams();

  const member = members.find((m) => m.slug === slug);

  if (!member) return notFound();

  return (
    <GuestLayout>
      <Head>
        <title>{member.name}</title>
        <meta name="description" content={member.bio} />
        <meta name="keywords" content="Vitaway, Our Team, Healthcare, Medical Professionals" />
        <meta property="og:title" content={member.name} />
        <meta property="og:description" content={member.bio} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.vitaway.org" />
        <meta property="og:image" content={member.image} />
      </Head>
      
      <div className="team-section relative w-full h-full">
        <div className="absolute hidden w-full bg-gradient-to-b from-[#272749] to-[#111827] lg:block h-[500px]"></div>

        <div className="relative px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
          {/* Header */}
          <div className="max-w-xl mb-20 md:mx-auto sm:text-center lg:max-w-2xl md:mb-20">
            <p className="inline-block font-normal px-3 py-px mb-4 text-xs tracking-wider text-white uppercase rounded-full bg-teal-accent-400">
              Meet The Dream Team
            </p>
            <h2 className="max-w-lg font-bold mb-6 text-4xl leading-10 tracking-tight text-white sm:text-4xl md:mx-auto">
              Meet {member.name}
            </h2>
            <p className="text-base text-gray-200 md:text-lg font-merri font-normal">{member.role}</p>
          </div>

          <div className="relative bg-white rounded-xl px-10 py-5">
            <section className="py-10 bg-white sm:py-16 lg:py-24">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-24 gap-y-12">
                  <div className="relative lg:mb-12">
                    <Image width={100} height={100} className="absolute -right-0 -bottom-8 xl:-bottom-12 xl:-right-4" src="https://cdn.rareblocks.xyz/collection/celebration/images/content/3/dots-pattern.svg" alt="" />
                    <div className="pl-12 pr-6">
                      <Image width={600} height={500} className="relative w-[600px] height-[500px] rounded-xl" src={member.image} alt="" />
                    </div>
                  </div>

                  <div className="2xl:pl-16">
                    <h2 className="text-xl font-bold leading-tight text-black sm:text-2xl lg:text-3xl lg:leading-tight">{member.description}</h2>
                    <p className="text-xl leading-relaxed text-gray-900 mt-9">{member.bio}</p>
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