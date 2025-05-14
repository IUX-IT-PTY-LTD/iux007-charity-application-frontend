import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="w-full">
      <div className="flex py-20 flex-col items-center justify-center px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="rounded-lg p-10 w-full shadow-xl bg-light max-md:mx-auto">
            <form className="space-y-4">
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-extrabold">Forgot Password</h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email address</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter your email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
                  </svg>
                </div>
              </div>

              <div className="!mt-8">
                <button
                  type="button"
                  className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none"
                >
                  Send Reset Instructions
                </button>
              </div>

              <p className="text-sm !mt-8 text-center text-gray-800">
                Remember your password?{' '}
                <Link
                  href="./login"
                  className="text-primary font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  Back to login
                </Link>
              </p>
            </form>
          </div>
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <Image
              width={500}
              height={500}
              src="/assets/img/forgot-password.svg"
              className="w-full h-full max-md:w-4/5 mx-auto block object-contain"
              alt="Forgot Password"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
