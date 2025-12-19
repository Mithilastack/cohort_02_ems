import React from 'react';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-8">
                    Terms of Service
                </h1>

                <div className="space-y-6 text-slate-300 leading-relaxed">
                    <p>Last updated: December 19, 2025</p>

                    <p>
                        Please read these terms and conditions carefully before using Our Service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Interpretation and Definitions</h2>

                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">Interpretation</h3>
                    <p>
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">Definitions</h3>
                    <p>For the purposes of these Terms of Service:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                        <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                        <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to EventMS.</li>
                        <li><strong>Service</strong> refers to the Website.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Acknowledgment</h2>
                    <p>
                        These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                    </p>
                    <p>
                        Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">User Accounts</h2>
                    <p>
                        When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Termination</h2>
                    <p>
                        We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
                    <p>If you have any questions about these Terms of Service, You can contact us:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>By email: support@eventms.com</li>
                        <li>By visiting this page on our website: /contact</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
