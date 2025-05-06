'use client'
import Image from "next/image";
import React from "react";
import QuickDonateCard from "../quick-donate-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


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
      <Slider {...settings}>
        <div className="relative">
          <Image src="/assets/img/hero.jpg" className="w-full h-[600px] object-cover rounded-md" width={800} height={600} alt="Donate Hero" />
          <h2 className="text-4xl font-bold absolute bottom-10 left-1/2 text-white -translate-x-1/2">Hello Slider</h2>
        </div>
        <div>
          <Image src="/assets/img/hero.jpg" className="w-full h-[600px] object-cover rounded-md" width={800} height={600} alt="Donate Hero" />
        </div>
        <div>
          <Image src="/assets/img/hero.jpg" className="w-full h-[600px] object-cover rounded-md" width={800} height={600} alt="Donate Hero" />
        </div>
      </Slider>
      {/* slider */}

      {/* <div className="grid md:grid-cols-2 items-center md:gap-8 gap-6">
        <div className="max-md:order-1 max-md:text-center z-50 relative">
          <h2 className="text-gray-800 lg:text-6xl md:text-4xl text-2xl font-extrabold mb-4 md:!leading-[56px]">
            <span className="text-primary">Charity:</span> Changing{" "}
            <span className="text-primary">Lives</span> with Generous Hearts
          </h2>
          <p className="text-gray-600 mt-6 text-base leading-relaxed">
            Charity connects kind hearts with meaningful causes, empowering
            positive change. Together, we make a difference, one donation at a
            time.
          </p>

          <button
            type="button"
            className="mt-6 bg-primary hover:bg-transparent hover:text-primary border-2 border-primary transition-all text-white font-semibold text-sm tracking-wide rounded-md px-6 py-2.5"
          >
            Get Started
          </button>

          <div className="mt-12">
            <div className="grid sm:grid-cols-3 gap-4 items-center">
              <div className="flex flex-col items-center text-center">
                <h5 className="text-gray-800 font-bold text-xl mb-2">10+</h5>
                <p className="text-gray-600">Years Experience</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h5 className="text-gray-800 font-bold text-xl mb-2">
                  1,00,000+
                </h5>
                <p className="text-gray-600">Donation Done</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h5 className="text-gray-800 font-bold text-xl mb-2">250</h5>
                <p className="text-gray-600">Different Events</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:h-[550px] md:h-[550px] flex items-center relative max-md:before:hidden before:absolute before:bg-[#DEE2E5] before:h-[120%] before:w-[120%] before:right-0 before:z-0">
          <Image
            src="/assets/img/donate-hero.jpg"
            width={800}
            height={600}
            className="rounded-md lg:w-4/5 z-50 relative"
            alt="Donate Hero"
            unoptimized
          />
        </div>
      </div> */}

      {/* <div className="grid md:grid-cols-3 gap-4 z-50 relative md:px-4 max-md:mt-12 mb-12">
        <div className="bg-white p-6 shadow rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-11 h-11 mb-4 inline-block bg-blue-100 p-3 rounded-md"
            viewBox="0 0 32 32"
          >
            <path
              d="M28.068 12h-.128a.934.934 0 0 1-.864-.6.924.924 0 0 1 .2-1.01l.091-.091a2.938 2.938 0 0 0 0-4.147l-1.511-1.51a2.935 2.935 0 0 0-4.146 0l-.091.091A.956.956 0 0 1 20 4.061v-.129A2.935 2.935 0 0 0 17.068 1h-2.136A2.935 2.935 0 0 0 12 3.932v.129a.956.956 0 0 1-1.614.668l-.086-.091a2.935 2.935 0 0 0-4.146 0l-1.516 1.51a2.938 2.938 0 0 0 0 4.147l.091.091a.935.935 0 0 1 .185 1.035.924.924 0 0 1-.854.579h-.128A2.935 2.935 0 0 0 1 14.932v2.136A2.935 2.935 0 0 0 3.932 20h.128a.934.934 0 0 1 .864.6.924.924 0 0 1-.2 1.01l-.091.091a2.938 2.938 0 0 0 0 4.147l1.51 1.509a2.934 2.934 0 0 0 4.147 0l.091-.091a.936.936 0 0 1 1.035-.185.922.922 0 0 1 .579.853v.129A2.935 2.935 0 0 0 14.932 31h2.136A2.935 2.935 0 0 0 20 28.068v-.129a.956.956 0 0 1 1.614-.668l.091.091a2.935 2.935 0 0 0 4.146 0l1.511-1.509a2.938 2.938 0 0 0 0-4.147l-.091-.091a.935.935 0 0 1-.185-1.035.924.924 0 0 1 .854-.58h.128A2.935 2.935 0 0 0 31 17.068v-2.136A2.935 2.935 0 0 0 28.068 12ZM29 17.068a.933.933 0 0 1-.932.932h-.128a2.956 2.956 0 0 0-2.083 5.028l.09.091a.934.934 0 0 1 0 1.319l-1.511 1.509a.932.932 0 0 1-1.318 0l-.09-.091A2.957 2.957 0 0 0 18 27.939v.129a.933.933 0 0 1-.932.932h-2.136a.933.933 0 0 1-.932-.932v-.129a2.951 2.951 0 0 0-5.028-2.082l-.091.091a.934.934 0 0 1-1.318 0l-1.51-1.509a.934.934 0 0 1 0-1.319l.091-.091A2.956 2.956 0 0 0 4.06 18h-.128A.933.933 0 0 1 3 17.068v-2.136A.933.933 0 0 1 3.932 14h.128a2.956 2.956 0 0 0 2.083-5.028l-.09-.091a.933.933 0 0 1 0-1.318l1.51-1.511a.932.932 0 0 1 1.318 0l.09.091A2.957 2.957 0 0 0 14 4.061v-.129A.933.933 0 0 1 14.932 3h2.136a.933.933 0 0 1 .932.932v.129a2.956 2.956 0 0 0 5.028 2.082l.091-.091a.932.932 0 0 1 1.318 0l1.51 1.511a.933.933 0 0 1 0 1.318l-.091.091A2.956 2.956 0 0 0 27.94 14h.128a.933.933 0 0 1 .932.932Z"
              data-original="#000000"
            />
            <path
              d="M16 9a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7Zm0 12a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z"
              data-original="#000000"
            />
          </svg>
          <h3 className="text-gray-800 text-xl font-bold mb-2">
            Donation
          </h3>
          <p className="text-sm text-gray-600">
            Make a donation to support a cause you care about.
          </p>
          <a
            href="javascript:void(0);"
            className="text-primary font-bold inline-block text-sm hover:underline mt-4"
          >
            Learn more
          </a>
        </div>
        <div className="bg-white p-6 shadow rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-11 h-11 mb-4 inline-block bg-blue-100 p-3 rounded-md"
            viewBox="0 0 512.001 512.001"
          >
            <path
              d="M271.029 0c-33.091 0-61 27.909-61 61s27.909 61 61 61 60-27.909 60-61-26.909-61-60-61zm66.592 122c-16.485 18.279-40.096 30-66.592 30-26.496 0-51.107-11.721-67.592-30-14.392 15.959-23.408 36.866-23.408 60v15c0 8.291 6.709 15 15 15h151c8.291 0 15-6.709 15-15v-15c0-23.134-9.016-44.041-23.408-60zM144.946 460.404 68.505 307.149c-7.381-14.799-25.345-20.834-40.162-13.493l-19.979 9.897c-7.439 3.689-10.466 12.73-6.753 20.156l90 180c3.701 7.423 12.704 10.377 20.083 6.738l19.722-9.771c14.875-7.368 20.938-25.417 13.53-40.272zM499.73 247.7c-12.301-9-29.401-7.2-39.6 3.9l-82 100.8c-5.7 6-16.5 9.6-22.2 9.6h-69.901c-8.401 0-15-6.599-15-15s6.599-15 15-15h60c16.5 0 30-13.5 30-30s-13.5-30-30-30h-78.6c-7.476 0-11.204-4.741-17.1-9.901-23.209-20.885-57.949-30.947-93.119-22.795-19.528 4.526-32.697 12.415-46.053 22.993l-.445-.361-21.696 19.094L174.28 452h171.749c28.2 0 55.201-13.5 72.001-36l87.999-126c9.9-13.201 7.2-32.399-6.299-42.3z"
              data-original="#000000"
            />
          </svg>
          <h3 className="text-gray-800 text-xl font-bold mb-2">Support</h3>
          <p className="text-sm text-gray-600">
            Support people to create love
          </p>
          <a
            href="javascript:void(0);"
            className="text-primary font-bold inline-block text-sm hover:underline mt-4"
          >
            Learn more
          </a>
        </div>
        <div className="bg-white p-6 shadow rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-11 h-11 mb-4 inline-block bg-blue-100 p-3 rounded-md"
            viewBox="0 0 24 24"
          >
            <g fill-rule="evenodd" clip-rule="evenodd">
              <path
                d="M17.03 8.97a.75.75 0 0 1 0 1.06l-4.2 4.2a.75.75 0 0 1-1.154-.114l-1.093-1.639L8.03 15.03a.75.75 0 0 1-1.06-1.06l3.2-3.2a.75.75 0 0 1 1.154.114l1.093 1.639L15.97 8.97a.75.75 0 0 1 1.06 0z"
                data-original="#000000"
              />
              <path
                d="M13.75 9.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-1.25H14.5a.75.75 0 0 1-.75-.75z"
                data-original="#000000"
              />
              <path
                d="M3.095 3.095C4.429 1.76 6.426 1.25 9 1.25h6c2.574 0 4.57.51 5.905 1.845C22.24 4.429 22.75 6.426 22.75 9v6c0 2.574-.51 4.57-1.845 5.905C19.571 22.24 17.574 22.75 15 22.75H9c-2.574 0-4.57-.51-5.905-1.845C1.76 19.571 1.25 17.574 1.25 15V9c0-2.574.51-4.57 1.845-5.905zm1.06 1.06C3.24 5.071 2.75 6.574 2.75 9v6c0 2.426.49 3.93 1.405 4.845.916.915 2.419 1.405 4.845 1.405h6c2.426 0 3.93-.49 4.845-1.405.915-.916 1.405-2.419 1.405-4.845V9c0-2.426-.49-3.93-1.405-4.845C18.929 3.24 17.426 2.75 15 2.75H9c-2.426 0-3.93.49-4.845 1.405z"
                data-original="#000000"
              />
            </g>
          </svg>
          <h3 className="text-gray-800 text-xl font-bold mb-2">
            Experience
          </h3>
          <p className="text-sm text-gray-600">
           Experience many events and make a difference.
          </p>
          <a
            href="javascript:void(0);"
            className="text-primary font-bold inline-block text-sm hover:underline mt-4"
          >
            Learn more
          </a>
        </div>
      </div> */}

      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 z-50 relative mt-2 max-md:mt-12 mb-12">
        {quickDonateItems.map((event) => (
          <QuickDonateCard
            key={event.id}
            title={event.title}
            description={event.description}
            img={event.image}
            time={event.date}
            venue={event.venue}
            target={event.target}
            raised={event.raised}
            showDetails={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
