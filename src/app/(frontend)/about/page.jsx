'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getAboutUsContent } from '@/api/services/app/aboutUsService';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await getAboutUsContent();
        if (response.status === 'success') {
          setAboutData(response.data);
        } else {
          setError('Failed to load content');
        }
      } catch (err) {
        console.error('Error fetching about us content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-color">Loading About Us content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden pt-20 pb-12 bg-white dark:bg-dark">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="mb-8 text-4xl font-bold text-secondary sm:text-[40px]/[48px]">
                  {aboutData?.title || 'Empowering Communities Through Compassionate Giving'}
                </h2>
                <p className="mb-8 text-lg text-body-color dark:text-dark-6 text-justify">
                  {aboutData?.description || 'At our core, we believe in the power of collective giving to transform lives. Our platform connects generous donors with meaningful causes, creating lasting positive impact in communities worldwide. Join us in building a better future for all.'}
                </p>
            </div>

            {aboutData?.image && aboutData.image.trim() !== '' && (
              <div className="mt-12 flex justify-center">
                <div className="max-w-2xl">
                  <img
                    src={aboutData.image}
                    alt={aboutData.title || 'About Us'}
                    className="w-full rounded-2xl shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mission, Vision, Values Section */}
          {(aboutData?.mission || aboutData?.vision || aboutData?.values) && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Our Foundation</h2>
                <p className="text-xl text-body-color max-w-2xl mx-auto">
                  The core principles that guide our mission and drive our impact.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
                {aboutData?.mission && (
                  <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-primary mb-4">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Our Mission</h3>
                    <p className="text-body-color dark:text-dark-6">
                      {aboutData.mission}
                    </p>
                  </div>
                )}

                {aboutData?.vision && (
                  <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-primary mb-4">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Our Vision</h3>
                    <p className="text-body-color dark:text-dark-6">
                      {aboutData.vision}
                    </p>
                  </div>
                )}

                {aboutData?.values && (
                  <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-primary mb-4">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Our Values</h3>
                    <p className="text-body-color dark:text-dark-6">
                      {aboutData.values}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team Section */}
          {aboutData?.members && aboutData.members.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Our Team</h2>
                <p className="text-xl text-body-color max-w-2xl mx-auto">
                  Meet the dedicated professionals leading our mission to create positive change.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {aboutData.members
                  .filter(member => member.status === true || member.status === 1)
                  .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                  .map((member, index) => (
                    <div key={member.id || index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="text-center">
                        {member.image && member.image.trim() !== '' ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-24 h-24 rounded-full object-cover shadow-md mx-auto mb-4"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        )}
                        <h4 className="text-xl font-bold text-secondary mb-2">{member.name}</h4>
                        <p className="text-primary font-medium mb-2">{member.position}</p>
                        {member.bio && (
                          <p className="text-sm text-body-color mb-4">{member.bio}</p>
                        )}
                        
                        {/* Contact Links */}
                        <div className="flex justify-center gap-3">
                          {member.email && (
                            <a 
                              href={`mailto:${member.email}`} 
                              className="text-primary hover:text-secondary transition-colors"
                              title="Email"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                              </svg>
                            </a>
                          )}
                          {member.linkedin && (
                            <a 
                              href={member.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:text-secondary transition-colors"
                              title="LinkedIn"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                              </svg>
                            </a>
                          )}
                          {member.twitter && (
                            <a 
                              href={member.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:text-secondary transition-colors"
                              title="Twitter"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default About;