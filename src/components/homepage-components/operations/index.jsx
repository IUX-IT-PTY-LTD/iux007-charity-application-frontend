import React from 'react';
import Link from 'next/link';
import { Heart, Users, DollarSign, ArrowRight } from 'lucide-react';

const Operations = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Need Help with Fundraising?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're here to support charitable causes and connect those in need with generous donors. 
            Start your fundraising journey with us today.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="lg:flex">
              {/* Left Content */}
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    Request for Fundraising
                  </h3>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Submit your fundraising request with comprehensive details about your charitable cause. 
                  Our platform will help you reach potential donors and raise the funds you need to make a difference.
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">Connect with donors</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">Transparent funding</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">Verified causes</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">Quick application</span>
                  </div>
                </div>

                <Link href="/charity-request">
                  <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center text-lg shadow-lg hover:shadow-xl">
                    Start Your Request
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>

              {/* Right Visual */}
              <div className="lg:w-1/3 bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white rounded-full p-6 shadow-lg mb-6 inline-block">
                    <Heart className="h-16 w-16 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Make an Impact
                  </h4>
                  <p className="text-gray-600">
                    Turn your charitable vision into reality with community support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Causes Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
            <div className="text-gray-600">Funds Raised</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-gray-600">Lives Impacted</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Operations;
