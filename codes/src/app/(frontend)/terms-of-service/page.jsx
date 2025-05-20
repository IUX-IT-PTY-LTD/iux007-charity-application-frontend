import React from 'react';

const TermsConditions = () => {
  return (
    <>
      <div className="terms-conditions bg-gray-50 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg px-8 py-10">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Terms and Conditions for Charity Fund</h1>
            <div className="border-b pb-4 mb-8">
              <p className="text-gray-600">
                <strong>Effective Date:</strong> 2027-01-01
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to the Charity Fund website (the "Site"). By accessing or using the Site, you
                  agree to comply with and be bound by these Terms and Conditions. If you do not agree
                  to these terms, please do not use our Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Eligibility</h2>
                <p className="text-gray-600 leading-relaxed">
                  By using our Site, you represent and warrant that you are at least 18 years of age or
                  are using the Site with parental or guardian consent. If you are under the age of 18,
                  you may not use our Site without such consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Donations</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Donations made through the Site are processed securely. You agree to provide accurate
                    and complete information when making a donation and to update such information as
                    necessary.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    All donations are non-refundable unless otherwise stated. By making a donation, you
                    acknowledge that you have read and understood our donation policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Conduct</h2>
                <p className="text-gray-600 mb-4">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
                  <li>Using the Site for any unlawful purpose or in violation of any applicable law.</li>
                  <li>Interfering with or disrupting the security, integrity, or performance of the Site.</li>
                  <li>Attempting to gain unauthorized access to the Site or its related systems or networks.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on the Site, including but not limited to text, graphics, logos, and
                  images, is the property of Charity Fund or its content suppliers and is protected by
                  intellectual property laws. You may not reproduce, distribute, or modify any content
                  without prior written consent from us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Links to Third-Party Websites</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our Site may contain links to third-party websites that are not operated by us. We
                  have no control over these websites and are not responsible for their content or
                  practices. We encourage you to review the terms and conditions and privacy policies of
                  any third-party websites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Disclaimer of Warranties</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Site is provided on an "as is" and "as available" basis. We make no
                  representations or warranties of any kind, express or implied, regarding the operation
                  of the Site or the information, content, materials, or products included on the Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  To the fullest extent permitted by law, Charity Fund shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages arising out of or
                  related to your use of the Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to These Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update these Terms and Conditions from time to time. Any changes will be
                  effective when we post the revised terms on this page with a new effective date. We
                  encourage you to review these terms periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions or concerns regarding these Terms and Conditions, please
                  contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    Charity Fund <br />
                    Dhaka, Bangladesh <br />
                    <a href="mailto:charity.fund@gmail.com" className="text-blue-600 hover:underline">charity.fund@gmail.com</a> <br />
                    <a href="tel:+8800000000000" className="text-blue-600 hover:underline">+8800000000000</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
