import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
<footer className="bg-black px-8 py-12">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {/* Logo & Social Links */}
      <div>
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/assets/img/logo.svg"
            alt="CharityFund Logo"
            width={80}
            height={80}
            className="mr-3"
          />
          <span className="text-xl font-semibold">
            <span className="text-white">Charity</span>
            <span className="text-primary">Fund</span>
          </span>
        </Link>

        <div className="mt-8 flex gap-4">
          {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
            <Link 
              key={social}
              href={`https://${social}.com`}
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{social}</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {/* Social icons paths */}
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      {[
        {
          title: 'Company',
          links: ['About', 'Careers', 'Partners', 'Blog', 'Contact']
        },
        {
          title: 'Resources',
          links: ['Documentation', 'Support', 'Legal', 'FAQ', 'Press']
        },
        {
          title: 'Platform',
          links: ['Services', 'Features', 'Technology', 'Pricing', 'Security']
        }
      ].map((section) => (
        <div key={section.title}>
          <h3 className="text-white font-semibold mb-4">{section.title}</h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link}>
                <Link 
                  href={`/${link.toLowerCase()}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <hr className="my-8 border-gray-800" />
    
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
      <div className="flex gap-6">
        <Link href="/privacy-policy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" className="hover:text-white transition-colors">
          Terms of Service
        </Link>
      </div>
      <p>© {new Date().getFullYear()} CharityFund. All rights reserved.</p>
    </div>
  </div>
</footer>
  );
};

export default Footer;
