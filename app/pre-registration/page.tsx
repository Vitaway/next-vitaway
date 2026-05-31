import { Metadata } from 'next';
import PreRegistrationWizard from './PreRegistrationWizard';

export const metadata: Metadata = {
    title: 'Pre-Registration | Vitaway',
    description: 'Register with Vitaway and start your personalised wellness journey. Complete your pre-registration in under 5 minutes.',
    robots: { index: true, follow: true },
};

export default function PreRegistrationPage() {
    return <PreRegistrationWizard />;
}
