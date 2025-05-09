import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Events from "@/components/all-events";
import Hero from "@/components/homepage-components/hero";
import Operations from "@/components/homepage-components/operations";
import QuickDonate from "@/components/homepage-components/quick-donate";
import FeaturedEvents from "@/components/homepage-components/featured-events";
import FAQ from "@/components/shared/faq";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedEvents />
      {/* <QuickDonate /> */}
      <Operations />
      <Events />
      <FAQ />
    </div>
  );
};

export default Home;
