import { Metadata } from 'next';
import { OfferingHubView } from '@/app/components/offerings/offering-views';
import { organizationsHub } from '@/content/offerings';

export const metadata: Metadata = {
    title: 'For Organizations',
    description: organizationsHub.description,
    alternates: { canonical: 'https://www.vitaway.org/for-organizations' },
};

export default function ForOrganizationsPage() {
    return <OfferingHubView content={organizationsHub} />;
}
