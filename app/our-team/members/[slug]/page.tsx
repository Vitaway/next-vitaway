import fs from "fs";
import path from "path";
import Image from "next/image";
import { notFound } from "next/navigation";
import GuestLayout from "@/app/layouts/GuestLayout";

interface Member {
  slug: string;
  name: string;
  description: string;
  role: string;
  image: string;
  bio: string;
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "content", "members.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const members: Member[] = JSON.parse(jsonData);

  return members.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), "content", "members.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const members: Member[] = JSON.parse(jsonData);

  const member = members.find((m) => m.slug === params.slug);

  if (!member) return notFound();

  return {
    title: member.name,
    description: member.description,
    keywords: member.role,

    openGraph: {
      title: member.name,
      description: member.description,
      type: "website",
      url: `https://www.vitaway.com/our-team/members/${member.slug}`,
      images: [
        {
          url: member.image,
          width: 1200,
          height: 630,
          alt: member.name,
        },
      ],
    },
  };
}

export default async function MemberPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), "content", "members.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const members: Member[] = JSON.parse(jsonData);

  const member = members.find((m) => m.slug === params.slug);

  if (!member) return notFound();

  return (
    <GuestLayout>
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