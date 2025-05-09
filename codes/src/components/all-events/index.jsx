'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import EventCard from "../homepage-components/event-card";
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';

const Events = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.get(ENDPOINTS.EVENTS.LIST);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  })
  const eventData = [
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
  ];
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <div className="mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 text-center">
          All Events
        </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
            {events.map((event) => (
              <EventCard
                eventId={event.uuid}
                title={event.title}
                description={event.description}
                img={event.featured_image}
                time={event.end_date}
                venue={event.location}
                targetAmount={event.target_amount}
                showDetails={true}
                // raised={event.raised}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
