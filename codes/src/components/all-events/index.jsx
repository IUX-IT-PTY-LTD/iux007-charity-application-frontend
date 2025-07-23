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
                  showDetails={true}
                  // raised={event.raised}
                />
              ))
            ) : (
              // Demo events when no events are found
              [
                {
                  uuid: 'demo-1',
                  title: 'demo-1',
                  description: 'Support education for underprivileged children',
                  featured_image: fallbackImage,
                  end_date: '2024-12-31',
                  location: 'Multiple Locations',
                  target_amount: 50000
                },
                {
                  uuid: 'demo-2',
                  title: 'demo-2',
                  description: 'Providing meals to those in need',
                  featured_image: fallbackImage,
                  end_date: '2024-12-31',
                  location: 'Nationwide',
                  target_amount: 25000
                },
                {
                  uuid: 'demo-3',
                  title: 'demo-3',
                  description: 'Supporting medical treatments for the underprivileged',
                  featured_image: fallbackImage,
                  end_date: '2024-12-31',
                  location: 'Various Hospitals',
                  target_amount: 100000
                }
              ].map((demoEvent) => (
                <EventCard
                  key={demoEvent.uuid}
                  eventId={demoEvent.uuid}
                  title={demoEvent.title}
                  description={demoEvent.description}
                  img={demoEvent.featured_image}
                  time={demoEvent.end_date}
                  venue={demoEvent.location}
                  targetAmount={demoEvent.target_amount}
                  showDetails={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
