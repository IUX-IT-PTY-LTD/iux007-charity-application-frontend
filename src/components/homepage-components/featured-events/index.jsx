'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import FeaturedEventsCard from '../event-cards/featured-events';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedEvents = ({ data }) => {
  let fallbackImage = 'https://iux007-charity-application.s3.ap-southeast-2.amazonaws.com/staging/assets/fallback_images/slider_fallback_image.jpg'
  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 text-center">
          Featured Events
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="z-50 relative"
        >
          {data && data.length > 0 ? (
            data.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="transform transition duration-300 hover:scale-105">
                  <FeaturedEventsCard
                    eventId={event.uuid}
                    title={event.title}
                    description={event.description}
                    img={event.featured_image}
                    time={new Date(event.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    venue={event.location}
                    fixedDonation={event.is_fixed_donation}
                    donationAmount={event.price}
                    showDetails={false}
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-24 h-24 mb-6 text-gray-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
              <p className="text-gray-500 text-center max-w-md">
                There are currently no featured events available. Check back later for upcoming events!
              </p>
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedEvents;
