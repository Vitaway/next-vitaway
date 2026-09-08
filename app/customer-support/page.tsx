import GuestLayout from "../layouts/GuestLayout";
import PageHeader from "../components/headers/page-header";
import SectionCard from "../components/sections/section-card";

export default function CustomerSupport() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        How we hold ourselves to <span className="font-accent">account</span>
                    </>
                }
                description="Ethics, compliance, and how to report a concern."
            />
            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <p>
                        Vitaway Health Ltd is committed to upholding the highest standards of ethics and compliance in all its activities. Below is important information about our commitment to ethical conduct and compliance with applicable laws and regulations.
                    </p>

                    <h2>Code of Conduct</h2>
                    <p>
                        Our code of conduct outlines our ethical principles and standards of behaviour. Our code of conduct covers conflicts of interest, confidentiality, gifts and gratuities, and compliance with laws and regulations. All employees, contractors, and partners must abide by our code of conduct.
                    </p>

                    <h2>Compliance Program</h2>
                    <p>
                        We have established a compliance program to ensure we comply with applicable laws and regulations. Our compliance program includes policies and procedures for billing and coding, privacy and security, and anti-corruption. We also provide training and education to our employees and contractors on compliance-related topics.
                    </p>

                    <h2>Reporting and Non-Retaliation</h2>
                    <p>
                        We encourage our employees, contractors, and partners to report any concerns or suspected violations of our code of conduct or applicable laws and regulations. We have established a reporting mechanism for reporting such concerns, and we investigate and take appropriate action on all reported concerns. We also have a non-retaliation policy prohibiting retaliation against individuals who report concerns in good faith.
                    </p>

                    <h2>External Audits and Monitoring</h2>
                    <p>
                        We periodically engage external auditors and consultants to assess our compliance with applicable laws and regulations and identify improvement areas. We also monitor our compliance program internally to ensure it remains effective and up-to-date.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions or concerns regarding our commitment to ethics and compliance, please get in touch with us at{' '}
                        <a href="mailto:vitawayeclinic@gmail.com">vitawayeclinic@gmail.com</a>.
                    </p>
                </div>
            </SectionCard>
        </GuestLayout>
    );
}
