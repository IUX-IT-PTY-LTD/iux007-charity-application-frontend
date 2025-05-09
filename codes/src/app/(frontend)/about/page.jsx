import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <>
      <section className="overflow-hidden pt-20 pb-12 bg-white dark:bg-dark">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="flex flex-wrap items-center justify-between -mx-4 mb-20">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3"
                      alt="People helping each other"
                      className="w-full rounded-2xl shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3"
                      alt="Community support"
                      className="w-full rounded-2xl shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative z-10 my-4">
                    <img
                      src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3"
                      alt="Charity work"
                      className="w-full rounded-2xl shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <span className="block text-xl font-semibold text-primary mb-4">
                  Making a Difference Together
                </span>
                <h2 className="mb-8 text-4xl font-bold text-secondary sm:text-[40px]/[48px]">
                  Empowering Communities Through Compassionate Giving
                </h2>
                <p className="mb-8 text-lg text-body-color dark:text-dark-6">
                  At our core, we believe in the power of collective giving to transform lives. Our platform connects generous donors with meaningful causes, creating lasting positive impact in communities worldwide. Join us in building a better future for all.
                </p>
                <Link
                  href="/donations"
                  className="inline-flex items-center justify-center py-4 text-base font-medium text-center text-white border border-transparent rounded-lg px-8 bg-primary hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Make a Difference Today
                </Link>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Impact Areas</h2>
            <p className="text-xl text-body-color max-w-2xl mx-auto">
              We focus on key areas where we can make the most significant difference in people's lives.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Community Development
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Building stronger communities through sustainable development projects, education initiatives, and local empowerment programs.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Emergency Relief
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Providing rapid response and support to communities affected by natural disasters and humanitarian crises.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Healthcare Access
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Improving access to quality healthcare services and medical resources for underserved communities worldwide.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Leadership Team</h2>
            <p className="text-xl text-body-color max-w-2xl mx-auto">
              Meet the dedicated professionals leading our mission to create positive change.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3"
                  alt="Sarah Johnson"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-secondary">
                    Sarah Johnson
                  </h4>
                  <p className="text-primary font-medium">Executive Director</p>
                  <p className="text-sm text-body-color mt-2">
                    15+ years in nonprofit leadership
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
                  alt="Michael Chen"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-secondary">
                    Michael Chen
                  </h4>
                  <p className="text-primary font-medium">Operations Director</p>
                  <p className="text-sm text-body-color mt-2">
                    Expert in global operations
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3"
                  alt="Emma Rodriguez"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-secondary">
                    Emma Rodriguez
                  </h4>
                  <p className="text-primary font-medium">Program Manager</p>
                  <p className="text-sm text-body-color mt-2">
                    Specialized in community development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
