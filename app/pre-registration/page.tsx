import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import PreRegistrationPageClient from './pre-registration-page-client';

export const metadata: Metadata = {
    title: 'Pre-Registration | Vitaway',
    description:
        'Register with Vitaway and start your personalised wellness journey. Complete your pre-registration in under 5 minutes.',
    robots: { index: true, follow: true },
};

export default function PreRegistrationPage() {
    return (
        <GuestLayout>
            <PreRegistrationPageClient />
        </GuestLayout>
    );
}
