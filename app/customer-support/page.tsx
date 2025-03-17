import GuestLayout from "../layouts/GuestLayout";

export default function CustomerSupport() {
    return (
        <GuestLayout>
            <div className="max-w-3xl mx-auto py-10 px-6">
                <h1 className="text-3xl font-bold mb-4 text-slate-700">Customer Support</h1>
                <p className="text-gray-700">
                    Need help? Contact our support team for assistance.
                </p>
                <h2 className="text-2xl font-semibold mt-6 text-slate-700">Contact Information</h2>
                <p className="text-gray-600">Email: support@example.com</p>
                <p className="text-gray-600">Phone: +1 (234) 567-8900</p>
                <h2 className="text-2xl font-semibold mt-6 text-slate-700">Frequently Asked Questions</h2>
                <p className="text-gray-600">
                    Check our FAQ section for answers to common questions.
                </p>
            </div>
        </GuestLayout>
    );
}
