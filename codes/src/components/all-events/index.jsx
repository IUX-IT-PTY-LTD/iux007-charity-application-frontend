'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EventCard from '../homepage-components/event-cards/events';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';

const Events = ({ data }) => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <div className="mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 text-center">
            All Events
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
            {data.map((event) => (
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
