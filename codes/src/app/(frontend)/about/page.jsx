import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <>
      <section className="overflow-hidden pt-20 pb-12 bg-white dark:bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between -mx-4">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://i.ibb.co/gFb3ns6/image-1.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://i.ibb.co/rfHFq15/image-2.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative z-10 my-4">
                    <img
                      src="https://i.ibb.co/9y7nYCD/image-3.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <span className="block text-xl font-semibold text-primary">
                  Why Choose Us
                </span>
                <h2 className="mb-5 text-3xl font-bold text-secondary sm:text-[40px]/[48px]">
                  Donation is the best way to help, and we make it easy.
                </h2>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  We are a team of passionate people whose goal is to improve
                  everyone's life through disruptive products. We build great
                  products to solve your business problems.
                </p>
                <Link
                  href="/donations"
                  className="inline-flex items-center justify-center py-3 text-base font-medium text-center text-white border border-transparent rounded-md px-7 bg-primary hover:bg-opacity-90"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* what we do */}
          <h2 className="mt-12">
            <span className="block text-3xl font-semibold text-primary">
              What We Do
            </span>
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold text-secondary">
                Fundraising
              </h3>
              <p className="mt-4 text-base text-body-color dark:text-dark-6">
                We are a team of passionate people whose goal is to improve
                everyone's life through disruptive products. We build great
                products to solve your business problems.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold text-secondary">
                Charity
              </h3>
              <p className="mt-4 text-base text-body-color dark:text-dark-6">
                We are a team of passionate people whose goal is to improve
                everyone's life through disruptive products. We build great
                products to solve your business problems.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold text-secondary">
                Donations
              </h3>
              <p className="mt-4 text-base text-body-color dark:text-dark-6">
                We are a team of passionate people whose goal is to improve
                everyone's life through disruptive products. We build great
                products to solve your business problems.
              </p>
            </div>
          </div>


          {/* our team */}
          <h2 className="mt-12">
            <span className="block text-3xl font-semibold text-primary">
              Our Team
            </span>
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="/assets/img/avatar.jpg"
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-secondary">
                      John Doe
                    </h4>
                    <p className="text-base text-body-color dark:text-dark-6">
                      CEO
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="/assets/img/avatar.jpg"
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-secondary">
                      John Doe
                    </h4>
                    <p className="text-base text-body-color dark:text-dark-6">
                      CEO
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="/assets/img/avatar.jpg"
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-secondary">
                      John Doe
                    </h4>
                    <p className="text-base text-body-color dark:text-dark-6">
                      CEO
                    </p>
                  </div>
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
