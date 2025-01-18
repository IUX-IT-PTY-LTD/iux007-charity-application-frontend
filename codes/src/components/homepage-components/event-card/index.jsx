import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const EventCard = ({
  title,
  description,
  img,
  time,
  venue,
  target,
  raised,
  showDetails,
  buttonText
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 cursor-pointer hover:-translate-y-2 transition-all relative">
      {/* <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-6 right-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16px"
          className="fill-gray-800 inline-block"
          viewBox="0 0 64 64"
        >
          <path
            d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
            data-original="#000000"
          ></path>
        </svg>
      </div> */}

      <div className="overflow-hidden mx-auto md:mb-2 mb-4">
        <Image
          width={300}
          height={300}
          src={img}
          alt="Product 3"
          className="h-full w-full object-cover rounded-md"
        />
      </div>

      <div>
        <p className="text-xs justify-start items-center gap-3 flex mb-3">
          <span className="justify-start items-center gap-1 bg-primary text-white px-3 py-1 rounded inline-flex">
            <FaClock /> {time}
          </span>
          <span className="justify-start items-center gap-1 bg-primary text-white px-3 py-1 rounded inline-flex">
            <FaMapMarkerAlt />
            {venue}
          </span>
        </p>
        {/* progress */}
        {showDetails && (
          <div className="flex justify-between items-center">
            <span className="text-xs">
              <span className="text-primary font-bold">
                {raised.toLocaleString()}({Math.ceil((raised / target) * 100)}%
                )
              </span>
            </span>
            <span className="text-xs">
              <span className="text-secondary font-bold">
                {target.toLocaleString()}
              </span>
            </span>
          </div>
        )}
        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-3">
          <div
            className="absolute h-2 bg-primary rounded-full"
            style={{ width: `${(raised / target) * 100}%` }}
          ></div>
        </div>
        {/* progress */}
        <h3 className="text-lg font-extrabold text-gray-800">
          <Link href={"/donation-details"}>
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>

        <div className="buttons block relative mt-4 w-full">
          <Link
            href={"/checkout"}
            className="bg-primary text-sm h-full text-white px-5 py-2 rounded-md block text-center w-full"
          >
            {
              buttonText || "Donate"
            }
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
