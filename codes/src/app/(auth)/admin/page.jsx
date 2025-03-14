'use client';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import getConfig from 'next/config';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

const Login = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const version = process.env.NEXT_PUBLIC_API_VERSION;

  console.log(`${baseUrl}/admin/${version}/login`);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch(`${baseUrl}/admin/${version}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);
      console.log(data);

      if (data.status === 'success') {
        toast.success(data.message);
        setLoading(false);
        console.log(data);

        // set access token in cookie
        document.cookie = `admin_token=${data.data.access_token}`;

        // reset form
        form.reset();

        // redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again later');
    }
  };

  return (
    <div className=" h-screen flex justify-center items-center">
      <div className="flex py-20 flex-col w-full items-center justify-center px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <Image
              width={500}
              height={500}
              src="/assets/img/login.svg"
              className="w-full h-full max-md:w-4/5 mx-auto block object-contain"
              alt="Login"
            />
          </div>
          <div className="rounded-lg p-10 w-full shadow-xl bg-light max-md:mx-auto">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Sign in
                </h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Sign in as an admin to manage your website.
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter user name"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter password"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-primary focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
              </div> */}

              <div className="!mt-8">
                {
                  loading ? (
                    <button
                      type="button"
                      disabled
                      className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none"
                    >
                      Loading...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none"
                    >
                      Log in
                    </button>
                  )
                }
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
