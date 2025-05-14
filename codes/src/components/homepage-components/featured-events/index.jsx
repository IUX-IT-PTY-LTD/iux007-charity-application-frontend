'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import FeaturedEventsCard from '../event-cards/featured-events';
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedEvents = ({ data }) => {
  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 text-center">
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
          {data.map((event) => (
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
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedEvents;
