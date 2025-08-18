import React from 'react';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="privacy-policy bg-gray-50 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg px-8 py-10">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
              Privacy Policy for Charity Fund
            </h1>
            <p className="text-gray-600 text-center mb-8">
              <strong>Effective Date:</strong> 2027-01-01
            </p>

            {[
              {
                title: '1. Introduction',
                content: `At Charity Fund ("we," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website [insert website URL], make a donation, volunteer, or participate in any of our programs or services.`,
              },
              {
                title: '2. Information We Collect',
                content: 'We may collect the following types of information:',
                list: [
                  {
                    title: 'Personal Information',
                    content:
                      'When you register for an event, donate, or volunteer, we may collect personal information, such as your name, email address, phone number, mailing address, and payment information.',
                  },
                  {
                    title: 'Non-Personal Information',
                    content:
                      'We may also collect non-personal information about you automatically when you visit our website, such as your IP address, browser type, operating system, pages visited, and the time and date of your visit.',
                  },
                ],
              },
              // ... similar structure for other sections
            ].map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <div className="prose prose-lg text-gray-600">
                  <p className="mb-4">{section.content}</p>
                  {section.list && (
                    <ul className="space-y-3">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>
                            {item.title && <strong className="text-gray-800">{item.title}:</strong>}{' '}
                            {item.content}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions or concerns about this Privacy Policy or our practices
                regarding your personal information, please contact us at:
              </p>
              <div className="text-gray-700">
                <strong>Charity Fund</strong>
                <br />
                Dhaka, Bangladesh
                <br />
                <a href="mailto:charity.fund@gmail.com" className="text-primary hover:underline">
                  charity.fund@gmail.com
                </a>
                <br />
                <a href="tel:+8800000000000" className="text-primary hover:underline">
                  +8800000000000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
