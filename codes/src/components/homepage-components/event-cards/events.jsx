import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const EventCard = ({
  eventId,
  title,
  description,
  img,
  time,
  venue,
  targetAmount,
  raised,
  showDetails,
  buttonText
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 cursor-pointer hover:-translate-y-2 transition-all relative h-full flex flex-col">
      <div className="overflow-hidden mx-auto md:mb-2 mb-4 h-[200px]">
        <Image
          width={300}
          height={300}
          src={img}
          alt="Product 3"
          className="h-full w-full object-cover rounded-md"
          loader={({ src }) => src}
        />
      </div>

      <div className="flex flex-col flex-1">
        <p className="text-xs justify-start items-center gap-3 flex mb-3">
          <span className="justify-start items-center gap-1 bg-primary text-white px-3 py-1 rounded inline-flex">
            <FaClock /> {time}
          </span>
          {venue && (
            <span className="justify-start items-center gap-1 bg-primary text-white px-3 py-1 rounded inline-flex">
              <FaMapMarkerAlt />
              {venue}
            </span>
          )}
        </p>
       
        <Link href={`/event-details/${eventId}`}>
            <h3 className="text-medium font-semibold text-gray-800 mb-4 line-clamp-2 cursor-pointer hover:text-primary transition-colors">
                {title}
            </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {description}
        </p>
        {/* progress */}
        {showDetails && (
          <div className="mb-4">
            <div className="bg-gray-50 rounded p-3">
                <div className="flex items-baseline text-sm mb-2">
                    <span className="font-bold text-primary">${25000 || 0}</span>
                    <span className="text-gray-500 ml-1">raised of </span>
                    <span className="font-bold text-primary ml-1">${targetAmount || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{width: `${Math.min((25000 / targetAmount * 100), 100)}%`}}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{100 || 0} Donors</span>
                    <span>{Math.min((25000 / targetAmount * 100), 100).toFixed(1)}%</span>
                </div>
            </div>
          </div>

        )}
        <div className="buttons block relative w-full mt-auto">
          <Link
            href={`/event-details/${eventId}`}
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
