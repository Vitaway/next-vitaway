import GuestLayout from "../layouts/GuestLayout";
import PageHeader from "../components/headers/page-header";
import SectionCard from "../components/sections/section-card";

export default function TermsAndConditions() {
    return (
        <GuestLayout>
            <PageHeader
                title={
                    <>
                        Terms you should <span className="font-accent">read</span>
                    </>
                }
                description="How this website, its content, and our liability are defined."
            />
            <SectionCard className="bg-white py-12 sm:py-16">
                <div className="prose-vitaway mx-auto max-w-[800px] px-5 lg:px-12">
                    <h2>1. Limitation of Liability</h2>
                    <p>
                        The information contained on this website (<a href="https://vitaway.org">https://vitaway.org</a>) is for general information purposes only. The information is provided by Vitaway Health Ltd, and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, sustainability, or availability with respect to the website or the information, products, services, and related graphics contained on the website for any purpose. Therefore, any reliance on such information is strictly at your own risk.
                    </p>
                    <p>
                        In no event will we be liable for any loss or damage, including, without limitation, indirect or consequential loss or damage arising from loss of data or profits arising out of or in connection with the use of this website.
                    </p>
                    <p>
                        Every effort is made to keep the website up and running smoothly. However, Vitaway Health Ltd takes no responsibility for and will not be liable for the website being temporarily unavailable due to technical issues beyond our control.
                    </p>

                    <h2>2. Intellectual Property</h2>
                    <p>
                        All content on our website, including text, graphics, images, and logos, is the property of Vitaway Health Ltd and is protected by copyright laws. You may not use or reproduce any content on our website without our prior written consent.
                    </p>

                    <h2>3. Changes to Disclaimer</h2>
                    <p>
                        Vitaway Health Ltd reserves the right to make changes to this disclaimer at any time without prior notice. It is your responsibility to review this disclaimer periodically for any updates or changes.
                    </p>
                </div>
            </SectionCard>
        </GuestLayout>
    );
}
