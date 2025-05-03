import React from "react";
import GuestLayout from "../layouts/GuestLayout";

function PrivacyPolicy() {
  return (
    <GuestLayout>
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-4 text-slate-700">Privacy Policy</h1>
        <p className="text-gray-700">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and share your personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">1. Information Collection and Use</h2>
        <p className="text-gray-600">
          We may collect personal information such as your name, email address, phone number, and medical history when you use our services or interact with our website. This information is used to provide you with the best possible healthcare services, communicate with you about your health, and improve our services.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">2. Information Sharing and Disclosure</h2>
        <p className="text-gray-600">
          We do not share your personal information with third parties unless it is necessary to provide our services, respond to legal requests, or protect our rights or safety. We may share your personal information with our affiliates, business partners, or service providers who assist us in providing our services.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">3. Data Security</h2>
        <p className="text-gray-600">
          We take the security of your personal information seriously and implement reasonable physical, technical, and administrative safeguards to protect your data from unauthorized access, use, or disclosure. We regularly review our security practices and update them as necessary to ensure your data’s confidentiality, integrity, and availability.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">4. Data Retention</h2>
        <p className="text-gray-600">
          We retain your personal information only for as long as it is necessary for the purposes for which it was collected or as required by law. When we no longer need your personal information, we securely dispose of or de-identify it.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">5. Your Rights and Choices</h2>
        <p className="text-gray-600">
          You have the right to access, correct, or delete the personal information that we have collected. You may also object to or restrict the processing of your personal information or request a copy of your data. If you have any questions or concerns about your rights or choices, please contact us at <a href="mailto:vitawayeclinic@gmail.com" className="text-indigo-500">vitawayeclinic@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">6. Children’s Privacy</h2>
        <p className="text-gray-600">
          We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at <a href="mailto:vitawayeclinic@gmail.com" className="text-indigo-500">vitawayeclinic@gmail.com</a>, and we will take steps to delete the data.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">7. Changes to Privacy Policy</h2>
        <p className="text-gray-600">
          Vitaway Health reserves the right to make changes to this privacy policy at any time without prior notice. It is your responsibility to review this privacy policy periodically for any updates or changes.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-slate-700 mb-3">8. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions or concerns regarding our privacy policy, please contact us at <a href="mailto:vitawayeclinic@gmail.com" className="text-indigo-500">vitawayeclinic@gmail.com</a>.
        </p>
      </div>
    </GuestLayout>
  );
}

export default PrivacyPolicy;