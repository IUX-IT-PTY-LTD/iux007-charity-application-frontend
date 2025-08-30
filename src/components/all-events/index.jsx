'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EventCard from '../homepage-components/event-cards/events';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';

const Events = ({ data }) => {
  let fallbackImage = 'https://iux007-charity-application.s3.ap-southeast-2.amazonaws.com/staging/assets/fallback_images/slider_fallback_image.jpg'
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <div className="mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 text-center">
            All Events
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
            {data && data.length > 0 ? (
              data.map((event) => (
                <EventCard
                  key={event.uuid}
                  eventId={event.uuid}
                  title={event.title}
                  description={event.description}
                  img={event.featured_image}
                  time={event.end_date}
                  venue={event.location}
                  targetAmount={event.target_amount}
                  raised={event.total_donation}
                  totalDonors={event.total_donor}
                  remainingPercentage={event.remaining_percentage}
                  showDetails={true}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                <div className="w-24 h-24 mb-6 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  There are currently no events available. Check back later for upcoming events!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
