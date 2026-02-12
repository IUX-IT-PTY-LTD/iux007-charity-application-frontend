'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const Hero = ({ data }) => {
  const [sliderHeight, setSliderHeight] = useState('h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]');
  let silderFallbackImage = 'https://iux007-charity-application.s3.ap-southeast-2.amazonaws.com/staging/assets/fallback_images/slider_fallback_image.jpg';

  useEffect(() => {
    const updateSliderHeight = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      if (vw < 640) { // Mobile
        setSliderHeight('h-[300px] sm:h-[350px]');
      } else if (vw < 768) { // Small tablet
        setSliderHeight('h-[400px]');
      } else if (vw < 1024) { // Medium tablet/small desktop
        setSliderHeight('h-[60vh] min-h-[400px] max-h-[500px]');
      } else if (vw < 1280) { // Desktop
        setSliderHeight('h-[65vh] min-h-[500px] max-h-[600px]');
      } else { // Large desktop
        setSliderHeight('h-[70vh] min-h-[600px] max-h-[700px]');
      }
    };

    updateSliderHeight();
    window.addEventListener('resize', updateSliderHeight);
    
    return () => window.removeEventListener('resize', updateSliderHeight);
  }, []);
  var settings = {
    infinite: data?.length > 1, // Only enable infinite loop if there are multiple images
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: data?.length > 1, // Only enable autoplay if there are multiple images
    autoplaySpeed: 3000,
    dots: data?.length > 1, // Only show dots if there are multiple images
    arrows: data?.length > 1, // Only show arrows if there are multiple images
  };

  return (
    <div className="container mx-auto">
      {/* slider */}
      <Slider {...settings}>
        {data && data.length > 0 ? (
          data.map((slider, index) => (
            <div key={index} className={`relative w-full ${sliderHeight} overflow-hidden`}>
              <Image
                src={slider.image || silderFallbackImage} // Fallback image if slider.image is not available
                fill
                className="object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                alt={slider.title || 'Slider Image'}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={index === 0}
                loader={({ src }) => src} // Add custom loader to handle S3 URLs
                onError={(e) => {
                  e.target.src = silderFallbackImage; // Fallback image if image fails to load
                }}
              />
            </div>
          ))
        ) : (
          <div className={`relative w-full ${sliderHeight} overflow-hidden`}>
            <Image
              src={silderFallbackImage}
              fill
              className="object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              alt="Fallback Slider Image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
              loader={({ src }) => src}
            />
          </div>
        )}
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
