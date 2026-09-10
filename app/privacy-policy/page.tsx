import React from 'react';
import PageHeader from '../components/headers/page-header';
import { SITE_EMAIL, SITE_MAILTO } from '@/content/contact';
import GuestLayout from '../layouts/GuestLayout';
import SectionCard from '../components/sections/section-card';

function PrivacyPolicy() {
  return (
    <GuestLayout>
      <PageHeader
        title={
          <>
            How we handle your <span className="font-accent">information</span>
          </>
        }
        description="This Privacy Policy explains how we collect, use, and share your personal information."
      />
      <SectionCard className="bg-white py-12 sm:py-16">
        <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and share your personal information.
          </p>

          <h2>1. Information Collection and Use</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and medical history when you use our services or interact with our website. This information is used to provide you with the best possible healthcare services, communicate with you about your health, and improve our services.
          </p>

          <h2>2. Information Sharing and Disclosure</h2>
          <p>
            We do not share your personal information with third parties unless it is necessary to provide our services, respond to legal requests, or protect our rights or safety. We may share your personal information with our affiliates, business partners, or service providers who assist us in providing our services.
          </p>

          <h2>3. Data Security</h2>
          <p>
            We take the security of your personal information seriously and implement reasonable physical, technical, and administrative safeguards to protect your data from unauthorized access, use, or disclosure. We regularly review our security practices and update them as necessary to ensure your data’s confidentiality, integrity, and availability.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal information only for as long as it is necessary for the purposes for which it was collected or as required by law. When we no longer need your personal information, we securely dispose of or de-identify it.
          </p>

          <h2>5. Your Rights and Choices</h2>
          <p>
            You have the right to access, correct, or delete the personal information that we have collected. You may also object to or restrict the processing of your personal information or request a copy of your data. If you have any questions or concerns about your rights or choices, please contact us at{' '}
            <a href={SITE_MAILTO}>{SITE_EMAIL}</a>.
          </p>

          <h2>6. Children’s Privacy</h2>
          <p>
            We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at{' '}
            <a href={SITE_MAILTO}>{SITE_EMAIL}</a>, and we will take steps to delete the data.
          </p>

          <h2>7. Changes to Privacy Policy</h2>
          <p>
            Vitaway Health reserves the right to make changes to this privacy policy at any time without prior notice. It is your responsibility to review this privacy policy periodically for any updates or changes.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding our privacy policy, please contact us at{' '}
            <a href={SITE_MAILTO}>{SITE_EMAIL}</a>.
          </p>
        </div>
      </SectionCard>
    </GuestLayout>
  );
}

export default PrivacyPolicy;
