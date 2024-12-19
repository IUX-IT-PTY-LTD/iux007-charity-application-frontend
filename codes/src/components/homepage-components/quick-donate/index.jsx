import Image from "next/image";
import React from "react";

const QuickDonate = () => {
  return (
    <div className="bg-secondary container mx-auto mt-20 mb-8">
      <div className="grid md:grid-cols-2 items-center md:max-h-[475px] overflow-hidden">
        <div className="lg:p-14 p-4">
          <h1 className="sm:text-4xl text-2xl font-bold text-white">
            Make a quick donation
          </h1>
          <p className="mt-4 text-sm text-gray-300"></p>
          <p className="mt-2 text-sm text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            accumsan, nuncet tempus blandit, metus mi consectetur nibh.
          </p>
          <div className="flex lg:flex-nowrap flex-wrap justify-start items-center lg:gap-5 gap-2">
            <button
              type="button"
              className="px-6 py-3 mt-8 rounded-md text-white text-sm tracking-wider border-none outline-none bg-primary hover:bg-accent hover:text-primary"
            >
              Zakat
            </button>
            <button
              type="button"
              className="px-6 py-3 mt-8 rounded-md text-white text-sm tracking-wider border-none outline-none bg-primary hover:bg-accent hover:text-primary"
            >
              Sadaqah
            </button>
            <button
              type="button"
              className="px-6 py-3 lg:mt-8 rounded-md text-white text-sm tracking-wider border-none outline-none bg-primary hover:bg-accent hover:text-primary"
            >
              Tainted Wealth
            </button>
          </div>
        </div>
        <Image
          width={500}
          height={500}
          src="/assets/img/quick-donate.jpg"
          className="w-full h-full object-cover shrink-0"
          unoptimized
          alt=""
        />
      </div>
    </div>
  );
};

export default QuickDonate;
