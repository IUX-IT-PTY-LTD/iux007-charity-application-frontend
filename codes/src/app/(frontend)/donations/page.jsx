'use client';
/* eslint-disable @next/next/no-img-element */
import EventCard from "@/components/homepage-components/event-cards/events";
import Image from "next/image";
import React, { act } from "react";

const Donations = () => {
  const donations = [
    {
      id: 1,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 2,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 10000,
      raised: 5000,
    },
    {
      id: 3,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500,
    },
    {
      id: 4,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 5,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 6,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 7,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 8,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 9,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 10,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    // add 10 more
    {
      id: 11,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 12,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 10000,
      raised: 5000,
    },
    {
      id: 13,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500,
    },
    {
      id: 14,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 15,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 16,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 17,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 18,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 19,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 20,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 21,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 22,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 23,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 24,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
  ];
  const [activePage, setActivePage] = React.useState(1);
  const totalPage = Math.ceil(donations.length / 10);
const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
};

const paginatedDonations = donations.slice((activePage - 1) * 10, activePage * 10);

return (
    <>
        <div className="py-16">
            <div className="container mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-16">
                    List of All Donations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 card-p-0">
                    {paginatedDonations.map((event) => (
                        <EventCard
                            key={event.id}
                            title={event.title}
                            description={event.description}
                            img={event.image}
                            time={event.date}
                            venue={event.venue}
                            target={event.target}
                            raised={event.raised}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    {Array.from({ length: totalPage }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 border rounded-full min-w-[45px] w-[45px] h-[45px] flex justify-center items-center border-primary ${
                                activePage === index + 1 ? "bg-primary text-white " : "bg-white text-primary"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </>
);
};

export default Donations;
