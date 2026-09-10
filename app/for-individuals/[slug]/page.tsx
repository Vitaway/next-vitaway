import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OfferingPageView } from '@/app/components/offerings/offering-views';
import { individualPages } from '@/content/offerings';

const slugs = Object.keys(individualPages);

export function generateStaticParams() {
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = individualPages[slug];
    if (!page) return { title: 'Not found' };
    return {
        title: page.title,
        description: page.description,
        alternates: { canonical: `https://www.vitaway.org/for-individuals/${slug}` },
    };
}

export default async function IndividualOfferingPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = individualPages[slug];
    if (!page) return notFound();
    return <OfferingPageView content={page} />;
}
