'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import { set } from 'date-fns';


const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  useEffect(() => {
    
  })
  const fetchFAQData = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.FAQ);
      console.log(response.status);
      if(response.status === 'success') {
        setFaqData(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      return [];
    }
  }
  const handleAccordion = (e) => {
    const accordion = e.target.closest("[role='accordion']");
    // hide all other accordions
    const accordions = document.querySelectorAll("[role='accordion']");
    accordions.forEach((acc) => {
      if (acc !== accordion) {
        const content = acc.querySelector('div');
        const minus = acc.querySelector('.minus');
        const plus = acc.querySelector('.plus');
        content.classList.add('hidden');
        minus.classList.add('hidden');
        plus.classList.remove('hidden');
      }
    });
    const content = accordion.querySelector('div');
    const minus = accordion.querySelector('.minus');
    const plus = accordion.querySelector('.plus');
    content.classList.toggle('hidden');
    minus.classList.toggle('hidden');
    plus.classList.toggle('hidden');
  };

  useEffect(() => {
    fetchFAQData();
  }, []);

  return (
    <div className="rounded-lg container mx-auto py-16">
      <div className="mb-8">
        <h2 className="sm:text-4xl text-2xl font-bold text-primary">FAQ</h2>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-20">
        <div className="grid-item space-y-4">
          {faqData.map((faq) => (
            <div 
              key={faq.id} 
              role="accordion"
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                type="button"
                className="w-full text-left font-semibold p-6 text-gray-800 flex items-center bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={handleAccordion}
              >
                <span className="mr-4 text-lg">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-current ml-auto shrink-0 minus hidden text-primary transition-transform duration-300 ease-in-out"
                  viewBox="0 0 124 124"
                >
                  <path
                    d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                    data-original="#000000"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-current ml-auto shrink-0 plus text-primary transition-transform duration-300 ease-in-out"
                  viewBox="0 0 42 42"
                >
                  <path
                    d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                    data-original="#000000"
                  />
                </svg>
              </button>
              <div className="overflow-hidden transition-all duration-300 ease-in-out hidden">
                <div className="p-6 bg-gray-50 rounded-b-lg">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid-item flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl overflow-hidden rounded-xl shadow-xl">
            <Image
              src={'/assets/img/donation-faq.jpg'}
              width={800}
              height={600}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              alt="Donate Hero"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
