import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const QuickDonateCard = ({
    eventId,
    title,
    description,
    img,
    time,
    venue,
    buttonText,
    fixedDonation,
    donationAmount,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mx-auto max-w-sm">
            <div className="relative">
                <Link href={`/event-details/${eventId}`}>
                    <Image
                        width={400}
                        height={300}
                        src={img}
                        alt={title}
                        className="w-full h-[200px] object-cover cursor-pointer"
                        loader={({ src }) => src}
                    />
                </Link>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex gap-3 text-white text-xs">
                        <span className="flex items-center gap-1">
                            <FaClock className="text-primary" /> {time}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-primary" /> {venue}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <Link href={`/event-details/${eventId}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2 cursor-pointer hover:text-primary transition-colors">
                        {title}
                    </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                   {description}
                </p>
                <div className="space-y-4">
                    {!fixedDonation && (
                        <>
                            <div className="grid grid-cols-3 gap-1">
                                <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-200">
                                    $50
                                </button>
                                <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-200">
                                    $100
                                </button>
                                <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-200">
                                    $200
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </>
                    )}
                    
                    {fixedDonation && (
                        <div className="text-center text-2xl font-bold text-primary mb-4">
                            ${donationAmount}
                        </div>
                    )}

                    <div className="buttons block relative mt-4 w-full hover-breath-border cursor-pointer">
                        <Link
                            href={"/checkout"}
                            className="bg-primary text-sm h-full text-white px-5 py-2 rounded-md block text-center w-full"
                        >
                            {buttonText || "Quick Donate"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickDonateCard;
