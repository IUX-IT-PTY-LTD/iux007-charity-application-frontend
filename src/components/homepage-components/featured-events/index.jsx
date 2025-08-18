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
            [1, 2, 3, 4].map((index) => (
              <SwiperSlide key={`demo-${index}`}>
                <div className="transform transition duration-300 hover:scale-105">
                  <FeaturedEventsCard
                    eventId="demo-event"
                    title="Demo Event"
                    description="This is a sample event description. Join us for an amazing experience!"
                    img={fallbackImage}
                    time={new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    venue="Sample Location"
                    fixedDonation={true}
                    donationAmount={50}
                    showDetails={false}
                  />
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedEvents;
