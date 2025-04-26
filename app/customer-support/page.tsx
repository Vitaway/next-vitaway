import GuestLayout from "../layouts/GuestLayout";

export default function CustomerSupport() {
    return (
        <GuestLayout>
            <div className="max-w-3xl mx-auto py-10 px-6">
                <h1 className="text-3xl font-bold mb-4 text-slate-700">Ethics & Compliance</h1>
                <p className="text-gray-700">
                    Vitaway Health Ltd is committed to upholding the highest standards of ethics and compliance in all its activities. Below is important information about our commitment to ethical conduct and compliance with applicable laws and regulations.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">Code of Conduct</h2>
                <p className="text-gray-600">
                    Our code of conduct outlines our ethical principles and standards of behaviour. Our code of conduct covers conflicts of interest, confidentiality, gifts and gratuities, and compliance with laws and regulations. All employees, contractors, and partners must abide by our code of conduct.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">Compliance Program</h2>
                <p className="text-gray-600">
                    We have established a compliance program to ensure we comply with applicable laws and regulations. Our compliance program includes policies and procedures for billing and coding, privacy and security, and anti-corruption. We also provide training and education to our employees and contractors on compliance-related topics.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">Reporting and Non-Retaliation</h2>
                <p className="text-gray-600">
                    We encourage our employees, contractors, and partners to report any concerns or suspected violations of our code of conduct or applicable laws and regulations. We have established a reporting mechanism for reporting such concerns, and we investigate and take appropriate action on all reported concerns. We also have a non-retaliation policy prohibiting retaliation against individuals who report concerns in good faith.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">External Audits and Monitoring</h2>
                <p className="text-gray-600">
                    We periodically engage external auditors and consultants to assess our compliance with applicable laws and regulations and identify improvement areas. We also monitor our compliance program internally to ensure it remains effective and up-to-date.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">Contact Us</h2>
                <p className="text-gray-600">
                    If you have any questions or concerns regarding our commitment to ethics and compliance, please get in touch with us at <a href="mailto:vitawayeclinic@gmail.com" className="text-indigo-500">vitawayeclinic@gmail.com</a>.
                </p>
            </div>
        </GuestLayout>
    );
}