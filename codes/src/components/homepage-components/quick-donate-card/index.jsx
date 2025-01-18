import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const QuickDonateCard = ({
    title,
    img,
    time,
    venue,
    buttonText
}) => {
    return (
        <div className="bg-white rounded-2xl p-0 cursor-pointer hover:-translate-y-2 transition-all relative">
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
                <p className="text-xs justify-start items-center gap-3 flex mb-2">
                    <span className="justify-start items-center gap-1 bg-primary text-white px-3 py-1 rounded inline-flex">
                        <FaClock /> {time}
                    </span>
                    <span className="justify-start items-center gap-1 bg-primary text-white px-3 py-1 rounded inline-flex">
                        <FaMapMarkerAlt />
                        {venue}
                    </span>
                </p>
                {/* progress */}
                <h3 className="text-lg font-extrabold text-gray-800 mb-3">{title}</h3>

                {/* few options like $50, $100, $200, custom to quick donate */}

                <div className="flex flex-wrap gap-2">
                    <button className="bg-primary text-white px-3 text-sm py-1 rounded">
                        $50
                    </button>
                    <button className="bg-primary text-white px-3 text-sm py-1 rounded">
                        $100
                    </button>
                    <button className="bg-primary text-white px-3 text-sm py-1 rounded">
                        $200
                    </button>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        className="bg-gray-100 text-gray-800 px-3 py-2 text-sm w-full rounded"
                    />
                </div>

                <div className="buttons block relative mt-4 w-full hover-breath-border cursor-pointer">
                    <Link
                        href={"/checkout"}
                        className="bg-primary text-sm h-full text-white px-5 py-2 rounded-md block text-center w-full"
                    >
                        {
                            buttonText || "Quick Donate"
                        }
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuickDonateCard;
