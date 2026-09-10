import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';
import PressButton from '../components/buttons/press-button';
import { featuredSuccessStory, successStories } from '@/content/success-stories';
import { SITE_WHATSAPP_URL } from '@/content/contact';

export const metadata: Metadata = {
    title: 'Success Stories',
    description:
        'Real people who sat with a Vitaway nutritionist, cooked the plan, and measured again — individuals and organisations in Kigali.',
    alternates: {
        canonical: 'https://www.vitaway.org/success-stories',
    },
};

function SuccessStoriesPage() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        They came in. Then the numbers <span className="font-accent">moved</span>.
                    </>
                }
                description="People who sat with a nutritionist, cooked the plan, and measured again at week twelve — and organisations that got a report a board can read."
                backgroundImage="/images/clinic/waist-measure-success.jpg"
                actions={
                    <div className="flex flex-wrap gap-3">
                        <PressButton href="/for-individuals/health-check">Book a health check</PressButton>
                        <PressButton href={SITE_WHATSAPP_URL} variant="secondary" surface="dark">
                            WhatsApp us
                        </PressButton>
                    </div>
                }
            />

            <SectionCard className="bg-[#F6F3EE] py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <figure className="relative min-h-[380px] overflow-hidden rounded-[28px] sm:min-h-[460px]">
                        <Image
                            src={featuredSuccessStory.image}
                            alt=""
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003E48] via-[#003E48]/50 to-transparent" />
                        <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                            <p className="max-w-3xl text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-[34px] lg:leading-[1.25]">
                                “{featuredSuccessStory.quote}”
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5CE0C6] text-base font-bold text-[#003E48]">
                                    {featuredSuccessStory.name.slice(0, 1)}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-white">{featuredSuccessStory.name}</p>
                                    <p className="text-sm text-white/75">{featuredSuccessStory.role}</p>
                                </div>
                            </div>
                        </figcaption>
                    </figure>
                </div>
            </SectionCard>

            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
                    <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#003E48] sm:text-4xl">
                        More voices from the <span className="font-accent">clinic</span>
                    </h2>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {successStories.map((story) => (
                            <article
                                key={story.name}
                                className="overflow-hidden rounded-[28px] bg-[#F6F3EE] shadow-[0_10px_30px_rgba(0,62,72,0.06)]"
                            >
                                <div className="relative h-44 w-full">
                                    <Image
                                        src={story.image}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    />
                                </div>
                                <div className="p-6">
                                    {story.programme ? (
                                        <p className="text-sm font-semibold text-[#E85A2E]">{story.programme}</p>
                                    ) : null}
                                    <blockquote className="mt-2 text-[17px] leading-relaxed text-[#003E48]">
                                        “{story.quote}”
                                    </blockquote>
                                    <div className="mt-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003E48] text-sm font-bold text-[#5CE0C6]">
                                            {story.name.slice(0, 1)}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-[#003E48]">{story.name}</p>
                                            <p className="text-sm text-[#003E48]/55">{story.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </SectionCard>

            <SectionCard className="bg-[#003E48] py-12 sm:py-16">
                <div className="mx-auto max-w-[1440px] px-5 text-center lg:px-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready for your own <span className="font-accent">story</span>?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base text-white/75">
                        Start with a health check, or ask about a programme for your organisation.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <PressButton href="/for-individuals">For individuals</PressButton>
                        <PressButton href="/for-organizations" variant="secondary" surface="dark">
                            For organisations
                        </PressButton>
                        <Link href="/blogs" className="text-sm font-semibold text-[#5CE0C6] hover:underline">
                            Read the blog →
                        </Link>
                    </div>
                </div>
            </SectionCard>
        </GuestLayout>
    );
}

export default SuccessStoriesPage;
