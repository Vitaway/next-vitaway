import { Metadata } from 'next';
import { OfferingHubView } from '@/app/components/offerings/offering-views';
import { individualsHub } from '@/content/offerings';

export const metadata: Metadata = {
    title: 'For Individuals',
    description: individualsHub.description,
    alternates: { canonical: 'https://www.vitaway.org/for-individuals' },
};

export default function ForIndividualsPage() {
    return <OfferingHubView content={individualsHub} />;
}
