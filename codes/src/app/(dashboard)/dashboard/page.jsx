import Image from "next/image";
import React from "react";
import { FaEye, FaLongArrowAltUp } from "react-icons/fa";

const Dashboard = () => {
  return <div className="dashboard">
    <h3 className="text-gray-800 text-3xl font-extrabold">
      Dashboard
    </h3>

    <div className="mt-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-[20px] shadow-lg border p-4 bg-gray-50 px-7.5 py-6 shadow-default dark:border-strokedark ">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 ">
            <FaEye className="text-blue-600 text-[20px] " size={20} />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black ">
                $3.456K
              </h4>
              <span className="text-sm font-medium">Total views</span>
            </div>

            <span className="flex items-center text-secondary gap-1 text-sm font-medium text-meta-3">
              0.43%
              <FaLongArrowAltUp className="fill-meta-3" size={10} />
            </span>
          </div>
        </div>
        <div className="rounded-[20px] shadow-lg border p-4 bg-gray-50 px-7.5 py-6 shadow-default dark:border-strokedark ">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 ">
            <FaEye className="text-blue-600 text-[20px] " size={20} />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black ">
                $3.456K
              </h4>
              <span className="text-sm font-medium">Total Profit</span>
            </div>

            <span className="flex items-center text-secondary gap-1 text-sm font-medium text-meta-3">
              0.43%
              <FaLongArrowAltUp className="fill-meta-3" size={10} />
            </span>
          </div>
        </div>
        <div className="rounded-[20px] shadow-lg border p-4 bg-gray-50 px-7.5 py-6 shadow-default dark:border-strokedark ">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 ">
            <FaEye className="text-blue-600 text-[20px] " size={20} />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black ">
                $3.456K
              </h4>
              <span className="text-sm font-medium">Total Products</span>
            </div>

            <span className="flex items-center text-secondary gap-1 text-sm font-medium text-meta-3">
              0.43%
              <FaLongArrowAltUp className="fill-meta-3" size={10} />
            </span>
          </div>
        </div>
        <div className="rounded-[20px] shadow-lg border p-4 bg-gray-50 px-7.5 py-6 shadow-default dark:border-strokedark ">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 ">
            <FaEye className="text-blue-600 text-[20px] " size={20} />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black ">
                $3.456K
              </h4>
              <span className="text-sm font-medium">Total Users</span>
            </div>

            <span className="flex items-center text-secondary gap-1 text-sm font-medium text-meta-3">
              0.43%
              <FaLongArrowAltUp className="fill-meta-3" size={10} />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-[20px] bg-gray-50 border px-5 pb-2.5 pt-6 shadow-xl  sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-bold text-black ">
              Donation History
            </h4>

            <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2  sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Source</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Visitors</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Revenues</h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Sales</h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Conversion</h5>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                  </div>
                  <p className="font-medium text-black  sm:block">
                    Google
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black ">3.5K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$5,768</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black ">590</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">4.8%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                  </div>
                  <p className="font-medium text-black  sm:block">
                    Twitter
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black ">2.2K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$4,635</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black ">467</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">4.3%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                  </div>
                  <p className="font-medium text-black  sm:block">
                    Github
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black ">2.1K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$4,290</p>
                </div>

                <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black ">420</p>
                </div>

                <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">3.7%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                  </div>
                  <p className="font-medium text-black  sm:block">
                    Vimeo
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black ">1.5K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$3,580</p>
                </div>

                <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black ">389</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">2.5%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                  </div>
                  <p className="font-medium text-black  sm:block">
                    Facebook
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black ">1.2K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$2,740</p>
                </div>

                <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black ">230</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">1.9%</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="col-span-12 rounded-[20px] bg-gray-50 border px-5 shadow-xl py-6 shadow-default dark:border-strokedark  xl:col-span-4">
          <h4 className="mb-6 px-7.5 text-xl font-bold text-black ">
            Chats
          </h4>

          <div>
            <a href="messages.html" className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="relative h-14 w-14 rounded-full">
                <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium text-black ">
                    Devid Heilo
                  </h5>
                  <p>
                    <span className="text-sm font-medium text-black ">Hello, how are you?</span>
                    <span className="text-xs"> . 12 min</span>
                  </p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">3</span>
                </div>
              </div>
            </a>
            <a href="messages.html" className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="relative h-14 w-14 rounded-full">
                <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium">Henry Fisher</h5>
                  <p>
                    <span className="text-sm font-medium">I am waiting for you</span>
                    <span className="text-xs"> . 5:54 PM</span>
                  </p>
                </div>
              </div>
            </a>
            <a href="messages.html" className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="relative h-14 w-14 rounded-full">
                <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-6"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium">Wilium Smith</h5>
                  <p>
                    <span className="text-sm font-medium">Where are you now?</span>
                    <span className="text-xs"> . 10:12 PM</span>
                  </p>
                </div>
              </div>
            </a>
            <a href="messages.html" className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="relative h-14 w-14 rounded-full">
                <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium text-black ">
                    Henry Deco
                  </h5>
                  <p>
                    <span className="text-sm font-medium text-black ">Thank you so much!</span>
                    <span className="text-xs"> . Sun</span>
                  </p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">2</span>
                </div>
              </div>
            </a>
            <a href="messages.html" className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="relative h-14 w-14 rounded-full">
                <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-7"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium">Jubin Jack</h5>
                  <p>
                    <span className="text-sm font-medium">I really love that!</span>
                    <span className="text-xs"> . Oct 23</span>
                  </p>
                </div>
              </div>
            </a>
            <a href="messages.html" className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
              <div className="relative h-14 w-14 rounded-full">
                <Image src="/assets/img/avatar.jpg" width={60} height={60} alt="User" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-6"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium">Wilium Smith</h5>
                  <p>
                    <span className="text-sm font-medium">Where are you now?</span>
                    <span className="text-xs"> . Sep 20</span>
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default Dashboard;
