'use client';
/* eslint-disable @next/next/no-img-element */
import EventCard from '@/components/homepage-components/event-cards/events';
import Image from 'next/image';
import React, { act, useEffect, useState } from 'react';
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';

const Events = () => {
  const [activePage, setActivePage] = React.useState(1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get(ENDPOINTS.EVENTS.LIST);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const paginatedDonations = events.slice((activePage - 1) * 10, activePage * 10);
  const totalPage = Math.ceil(events.length / 10);

  return (
    <>
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Explore Our Donation Campaigns
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us in making a difference. Every contribution counts towards creating positive
              change in our community.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paginatedDonations.map((event) => (
                  <div
                    key={event.uuid}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <EventCard
                      eventId={event.uuid}
                      title={event.title}
                      description={event.description}
                      img={event.featured_image}
                      time={event.end_date}
                      venue={event.location}
                      targetAmount={event.target_amount}
                      showDetails={true}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center space-x-2 mt-12">
                {Array.from({ length: totalPage }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                      ${
                        activePage === index + 1
                          ? 'bg-primary text-white shadow-lg transform scale-105'
                          : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                      }
                    `}
                    aria-label={`Page ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Events;
