import GuestLayout from "../layouts/GuestLayout";

export default function TermsAndConditions() {
    return (
        <GuestLayout>
            <div className="max-w-3xl mx-auto py-10 px-6">
                <h1 className="text-3xl font-bold mb-4 text-slate-700">Terms and Conditions</h1>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">1. Limitation of Liability</h2>
                <p className="text-gray-600">
                    The information contained on this website (<a href="https://vitaway.org" className="text-indigo-500">https://vitaway.org</a>) is for general information purposes only. The information is provided by Vitaway Health Ltd, and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, sustainability, or availability with respect to the website or the information, products, services, and related graphics contained on the website for any purpose. Therefore, any reliance on such information is strictly at your own risk.
                </p>
                <p className="text-gray-600 mt-4">
                    In no event will we be liable for any loss or damage, including, without limitation, indirect or consequential loss or damage arising from loss of data or profits arising out of or in connection with the use of this website.
                </p>
                <p className="text-gray-600 mt-4">
                    Every effort is made to keep the website up and running smoothly. However, Vitaway Health Ltd takes no responsibility for and will not be liable for the website being temporarily unavailable due to technical issues beyond our control.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">2. Intellectual Property</h2>
                <p className="text-gray-600">
                    All content on our website, including text, graphics, images, and logos, is the property of Vitaway Health Ltd and is protected by copyright laws. You may not use or reproduce any content on our website without our prior written consent.
                </p>

                <h2 className="text-xl mb-3 font-semibold mt-6 text-slate-700">3. Changes to Disclaimer</h2>
                <p className="text-gray-600">
                    Vitaway Health Ltd reserves the right to make changes to this disclaimer at any time without prior notice. It is your responsibility to review this disclaimer periodically for any updates or changes.
                </p>
            </div>
        </GuestLayout>
    );
}