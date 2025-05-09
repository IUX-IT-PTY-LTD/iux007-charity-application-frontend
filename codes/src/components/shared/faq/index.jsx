"use client";
import Image from "next/image";
import React from "react";

const FAQ = () => {
  const handleAccordion = (e) => {
    const accordion = e.target.closest("[role='accordion']");
    // hide all other accordions
    const accordions = document.querySelectorAll("[role='accordion']");
    accordions.forEach((acc) => {
      if (acc !== accordion) {
        const content = acc.querySelector("div");
        const minus = acc.querySelector(".minus");
        const plus = acc.querySelector(".plus");
        content.classList.add("hidden");
        minus.classList.add("hidden");
        plus.classList.remove("hidden");
      }
    });
    const content = accordion.querySelector("div");
    const minus = accordion.querySelector(".minus");
    const plus = accordion.querySelector(".plus");
    content.classList.toggle("hidden");
    minus.classList.toggle("hidden");
    plus.classList.toggle("hidden");
  };

  const faqData = [
    {
      id: 1,
      question: "Have you weighed the potential risks and benefits?",
      answer:
        "When deciding which charity to donate to, it's important to do your search.",
    },
    {
      id: 2,
      question: "How will you gather feedback from stakeholders",
      answer:
        "When deciding which charity to donate to, it's important to do your search.",
    },
    {
      id: 3,
      question: "There any sustainability or ethical to take into account?",
      answer:
        "When deciding which charity to donate to, it's important to do your search.",
    },
    {
      id: 4,
      question: "There any sustainability or ethical to take into account?",
      answer:
        "When deciding which charity to donate to, it's important to do your search.",
    },
    {
      id: 5,
      question: "There any sustainability or ethical to take into account?",
      answer:
        "When deciding which charity to donate to, it's important to do your search.",
    },
    {
      id: 6,
      question: "There any sustainability or ethical to take into account?",
      answer:
        "When deciding which charity to donate to, it's important to do your search.",
    },
  ];
  return (
    <div className="rounded-lg container mx-auto py-16">
      <div className="mb-8">
        <h2 className="sm:text-4xl text-2xl font-bold text-primary">
          FAQ
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-20">
        <div className="grid-item divide-y ">
          {faqData.map((faq) => (
            <div key={faq.id} role="accordion">
              <button
                type="button"
                className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
                onClick={handleAccordion}
              >
                <span className="mr-4">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 fill-current ml-auto shrink-0 minus hidden"
                  viewBox="0 0 124 124"
                >
                  <path
                    d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                    data-original="#000000"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 fill-current ml-auto shrink-0 plus"
                  viewBox="0 0 42 42"
                >
                  <path
                    d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                    data-original="#000000"
                  />
                </svg>
              </button>
              <div className="py-4 hidden">
                <p className="text-sm text-gray-800">{faq.answer}</p>
              </div>
            </div>
          ))}
          {/* <div role="accordion">
            <button
              type="button"
              className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
              onClick={handleAccordion}
            >
              <span className="mr-4">
                Are there any special discounts or promotions available during
                the event.
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 minus "
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 plus hidden"
                viewBox="0 0 42 42"
              >
                <path
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <div className="py-4">
              <p className="text-sm text-gray-800">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                auctor auctor arcu, at fermentum dui. Maecenas vestibulum a
                turpis in lacinia. Proin aliquam turpis at erat venenatis
                malesuada. Sed semper, justo vitae consequat fermentum, felis
                diam posuere ante, sed fermentum quam justo in dui. Nulla
                facilisi. Nulla aliquam auctor purus, vitae dictum dolor
                sollicitudin vitae. Sed bibendum purus in efficitur consequat.
                Fusce et tincidunt arcu. Curabitur ac lacus lectus. Morbi congue
                facilisis sapien, a semper orci facilisis in.
              </p>
            </div>
          </div>
          <div role="accordion">
            <button
              onClick={handleAccordion}
              type="button"
              className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
            >
              <span className="mr-4">
                What are the dates and locations for the product launch events?
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 minus hidden"
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 plus"
                viewBox="0 0 42 42"
              >
                <path
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <div className="hidden py-4">
              <p className="text-sm text-gray-800">Content</p>
            </div>
          </div>
          <div role="accordion">
            <button
              type="button"
              onClick={handleAccordion}
              className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
            >
              <span className="mr-4">
                Can I bring a guest with me to the product launch event?
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 minus hidden"
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 plus"
                viewBox="0 0 42 42"
              >
                <path
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <div className="hidden py-4">
              <p className="text-sm text-gray-800">Content</p>
            </div>
          </div>
          <div role="accordion">
            <button
              onClick={handleAccordion}
              type="button"
              className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
            >
              <span className="mr-4">How can I register for the event?</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 minus hidden"
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 plus"
                viewBox="0 0 42 42"
              >
                <path
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <div className="hidden py-4">
              <p className="text-sm text-gray-800">Content</p>
            </div>
          </div>
          <div role="accordion">
            <button
              type="button"
              onClick={handleAccordion}
              className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
            >
              <span className="mr-4">
                Is there parking available at the venue?
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 minus hidden"
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 plus"
                viewBox="0 0 42 42"
              >
                <path
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <div className="hidden py-4">
              <p className="text-sm text-gray-800">Content</p>
            </div>
          </div>
          <div role="accordion">
            <button
              type="button"
              onClick={handleAccordion}
              className="w-full text-base text-left font-semibold py-6 text-gray-800 flex items-center"
            >
              <span className="mr-4">
                How can I contact the event organizers?
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 minus hidden"
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 fill-current ml-auto shrink-0 plus"
                viewBox="0 0 42 42"
              >
                <path
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <div className="hidden py-4">
              <p className="text-sm text-gray-800">Content</p>
            </div>
          </div> */}
        </div>
        <div className="grid-item">
          <Image
            src={"/assets/img/donation-faq.jpg"}
            width={800}
            height={600}
            className="rounded-md w-full h-full object-cover lg:w-4/5 z-50 relative"
            alt="Donate Hero"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
