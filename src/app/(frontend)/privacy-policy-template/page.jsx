import React from 'react';

const PrivacyPolicy = () => {
  const privacyData = [
    {
      title: '1. Introduction',
      content: `At Charity Fund ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, make a donation, volunteer, or participate in any of our programs or services. By using our services, you agree to the collection and use of information in accordance with this policy.`,
    },
    {
      title: '2. Information We Collect',
      content: 'We may collect the following types of information when you interact with our charity services:',
      list: [
        {
          title: 'Personal Information',
          content: 'When you register for an account, donate, volunteer, or contact us, we may collect: name, email address, phone number, mailing address, payment information (credit card details, billing address), date of birth, and emergency contact information for volunteers.'
        },
        {
          title: 'Donation Information',
          content: 'Details about your donations including amount, frequency, designated programs, payment method, and tax receipt preferences.'
        },
        {
          title: 'Technical Information',
          content: 'IP address, browser type, operating system, device information, pages visited, time spent on pages, referring websites, and cookies and tracking technologies.'
        },
        {
          title: 'Communication Records',
          content: 'Records of communications between you and our organization, including emails, phone calls, and chat messages.'
        },
        {
          title: 'Volunteer Information',
          content: 'Skills, availability, background check results (where legally permitted), and participation records.'
        }
      ]
    },
    {
      title: '3. How We Use Your Information',
      content: 'We use the collected information for the following purposes:',
      list: [
        {
          title: 'Service Provision',
          content: 'Processing donations, managing volunteer activities, providing tax receipts, and delivering newsletters and updates.'
        },
        {
          title: 'Communication',
          content: 'Sending donation confirmations, program updates, fundraising appeals, volunteer opportunities, and administrative notices.'
        },
        {
          title: 'Legal Compliance',
          content: 'Meeting regulatory requirements for charitable organizations, maintaining accurate financial records, and reporting to government agencies as required.'
        },
        {
          title: 'Service Improvement',
          content: 'Analyzing usage patterns to improve our website and services, conducting research to enhance our programs, and personalizing your experience.'
        },
        {
          title: 'Security',
          content: 'Protecting against fraud and unauthorized access, ensuring the safety of our volunteers and beneficiaries.'
        }
      ]
    },
    {
      title: '4. Information Sharing and Disclosure',
      content: 'We may share your information in the following circumstances:',
      list: [
        {
          title: 'Service Providers',
          content: 'With trusted third-party service providers who assist us in operating our website, processing payments, sending emails, or conducting our charitable activities.'
        },
        {
          title: 'Legal Requirements',
          content: 'When required by law, regulation, or court order, or to protect our rights, property, or safety, or the rights, property, or safety of others.'
        },
        {
          title: 'Partner Organizations',
          content: 'With partner charities or organizations when collaborating on specific programs, with your explicit consent.'
        },
        {
          title: 'Business Transfers',
          content: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.'
        },
        {
          title: 'Public Recognition',
          content: 'With your consent, we may recognize donors or volunteers publicly in our publications, website, or events.'
        }
      ]
    },
    {
      title: '5. Data Security',
      content: 'We implement appropriate technical and organizational security measures to protect your personal information:',
      list: [
        {
          title: 'Encryption',
          content: 'All sensitive data, including payment information, is encrypted during transmission and storage using industry-standard protocols.'
        },
        {
          title: 'Access Controls',
          content: 'Access to personal information is restricted to authorized personnel who need it for legitimate business purposes.'
        },
        {
          title: 'Regular Audits',
          content: 'We conduct regular security audits and vulnerability assessments to identify and address potential risks.'
        },
        {
          title: 'Staff Training',
          content: 'Our staff receives regular training on privacy protection and data security best practices.'
        },
        {
          title: 'Secure Infrastructure',
          content: 'Our systems are hosted on secure servers with firewalls, intrusion detection, and monitoring systems.'
        }
      ]
    },
    {
      title: '6. Your Rights and Choices',
      content: 'You have the following rights regarding your personal information:',
      list: [
        {
          title: 'Access',
          content: 'You can request access to the personal information we hold about you.'
        },
        {
          title: 'Correction',
          content: 'You can request that we correct any inaccurate or incomplete information.'
        },
        {
          title: 'Deletion',
          content: 'You can request deletion of your personal information, subject to legal and regulatory requirements.'
        },
        {
          title: 'Opt-out',
          content: 'You can unsubscribe from our communications at any time using the unsubscribe link in our emails or by contacting us directly.'
        },
        {
          title: 'Data Portability',
          content: 'You can request a copy of your personal information in a commonly used electronic format.'
        },
        {
          title: 'Restriction',
          content: 'You can request that we restrict the processing of your personal information in certain circumstances.'
        }
      ]
    },
    {
      title: '7. Cookies and Tracking Technologies',
      content: 'Our website uses cookies and similar technologies to enhance your experience:',
      list: [
        {
          title: 'Essential Cookies',
          content: 'Necessary for the website to function properly, including login sessions and security features.'
        },
        {
          title: 'Analytics Cookies',
          content: 'Help us understand how visitors use our website to improve functionality and content.'
        },
        {
          title: 'Marketing Cookies',
          content: 'Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.'
        },
        {
          title: 'Cookie Control',
          content: 'You can control cookie settings through your browser preferences, though disabling certain cookies may limit website functionality.'
        }
      ]
    },
    {
      title: '8. Children\'s Privacy',
      content: 'We are committed to protecting children\'s privacy:',
      list: [
        {
          title: 'Age Restrictions',
          content: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.'
        },
        {
          title: 'Parental Consent',
          content: 'For children between 13-18, we require parental consent for certain activities such as volunteering.'
        },
        {
          title: 'Data Deletion',
          content: 'If we become aware that we have collected information from a child under 13, we will promptly delete such information.'
        },
        {
          title: 'Educational Programs',
          content: 'For educational or outreach programs involving minors, we follow strict guidelines and obtain appropriate permissions.'
        }
      ]
    },
    {
      title: '9. International Data Transfers',
      content: 'Information about how we handle international data transfers:',
      list: [
        {
          title: 'Cross-Border Transfers',
          content: 'Your information may be transferred to and processed in countries other than your own, where data protection laws may differ.'
        },
        {
          title: 'Safeguards',
          content: 'We ensure appropriate safeguards are in place to protect your information during international transfers.'
        },
        {
          title: 'Compliance',
          content: 'We comply with applicable international data protection regulations, including GDPR for European residents.'
        }
      ]
    },
    {
      title: '10. Data Retention',
      content: 'We retain your personal information for as long as necessary:',
      list: [
        {
          title: 'Active Relationships',
          content: 'We retain information for active donors and volunteers as long as the relationship continues.'
        },
        {
          title: 'Legal Requirements',
          content: 'Some information must be retained for specific periods as required by law (e.g., tax records for 7 years).'
        },
        {
          title: 'Inactive Accounts',
          content: 'For inactive accounts, we may retain basic information for up to 3 years before deletion.'
        },
        {
          title: 'Historical Records',
          content: 'Aggregate and anonymized data may be retained indefinitely for historical and research purposes.'
        }
      ]
    },
    {
      title: '11. Third-Party Links',
      content: 'Our website may contain links to third-party websites:',
      list: [
        {
          title: 'External Sites',
          content: 'We are not responsible for the privacy practices of external websites linked from our site.'
        },
        {
          title: 'Social Media',
          content: 'Our social media pages are governed by the privacy policies of the respective platforms.'
        },
        {
          title: 'Recommendation',
          content: 'We encourage you to review the privacy policies of any third-party sites you visit.'
        }
      ]
    },
    {
      title: '12. Updates to This Privacy Policy',
      content: 'We may update this Privacy Policy periodically:',
      list: [
        {
          title: 'Notification',
          content: 'We will notify you of any material changes through email or prominent website notices.'
        },
        {
          title: 'Effective Date',
          content: 'The updated policy will include a new effective date at the top of this page.'
        },
        {
          title: 'Continued Use',
          content: 'Your continued use of our services after policy updates constitutes acceptance of the new terms.'
        },
        {
          title: 'Review',
          content: 'We encourage you to review this policy periodically to stay informed about how we protect your information.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 lg:px-12 py-10">
            {/* Introduction Alert */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    By using our charity platform, donating, or volunteering with us, you acknowledge that you have read, 
                    understood, and agree to this Privacy Policy. This policy complies with applicable privacy laws including 
                    GDPR, CCPA, and other regional data protection regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy Sections */}
            {privacyData.map((section, index) => (
              <div key={index} className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {section.title.split('.')[0]}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>

                <div className="ml-14">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {section.content}
                  </p>

                  {section.list && (
                    <div className="space-y-4">
                      {section.list.map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.title}
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Contact Information Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us About Privacy
              </h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please don't hesitate to contact us. We're committed to addressing your privacy concerns promptly and transparently.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Primary Contact</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium text-lg">Privacy Officer</p>
                    <p>Charity Fund Organization</p>
                    <p>Dhaka, Bangladesh</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Get in Touch</h3>
                  <div className="space-y-3">
                    <a 
                      href="mailto:privacy@charity.fund.com" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      privacy@charity.fund.com
                    </a>
                    <a 
                      href="tel:+8800000000000" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +8800000000000
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 48 hours. 
                  For complex requests, we may need up to 30 days as permitted by applicable privacy laws.
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center p-4 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                This privacy policy is part of our commitment to transparency and data protection. 
                For our Terms of Service, please visit our{' '}
                <a href="/terms-of-service" className="text-blue-600 hover:underline">
                  Terms of Service page
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;