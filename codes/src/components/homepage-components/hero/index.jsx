'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import QuickDonateCard from "../quick-donate-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';


const Hero = () => {
  const quickDonateItems = [
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
      target: 1000000,
      raised: 500000,
    },
    {
      id: 3,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
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
  ];

  const [sliders, setSliders] = useState([]);
  const fetchSliders = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.SLIDERS);
      const data = response.data;
      setSliders(data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

useEffect(() => {
    fetchSliders();
  }, []);

  var settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoPlay: true,
    autoPlaySpeed: 3000,
    dots: true,
    arrows: true,
    prevArrow: (
      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-6 h-6 text-gray-800"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
    ),

    nextArrow: (
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-6 h-6 text-gray-800"
          viewBox="0 0 24 24"
        >
          <path d="M8.59 7.41L10 6l6 6-6 6-1.41-1.41L13.17 12z" />
        </svg>
      </button>
    ),
  };
  return (
    <div className="container mx-auto">

      {/* slider */}
      <Slider 
        {...settings}
      >
        {sliders.map((slider, index) => (
          <div key={index} className="relative w-full h-[600px]">
            <Image 
              src={slider.image}
              fill
              className="object-contain rounded-md"
              alt={slider.title || "Slider Image"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={index === 0}
              loader={({ src }) => src} // Add custom loader to handle S3 URLs
            />
          </div>
        ))}
        {/* <div>
          <Image src="/assets/img/hero.jpg" className="w-full h-[600px] object-cover rounded-md" width={800} height={600} alt="Donate Hero" />
          <h2 className="text-4xl font-bold absolute bottom-10 left-1/2 text-white -translate-x-1/2">Hello Slider</h2>
        </div>
        <div>
          <Image src="/assets/img/hero.jpg" className="w-full h-[600px] object-cover rounded-md" width={800} height={600} alt="Donate Hero" />
        </div>
        <div>
          <Image src="/assets/img/hero.jpg" className="w-full h-[600px] object-cover rounded-md" width={800} height={600} alt="Donate Hero" />
        </div> */}
      </Slider>
      {/* slider */}
    </div>
  );
};

export default Hero;
