import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Events from "@/components/events";
import Blogs from "@/components/homepage-components/blogs";
import Hero from "@/components/homepage-components/hero";
// import Operations from "@/components/homepage-components/operations";
import QuickDonate from "@/components/homepage-components/quick-donate";
import FAQ from "@/components/shared/faq";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <QuickDonate />
      {/* <Operations /> */}
      <Events />
      <FAQ />
      <Blogs />
    </div>
  );
};

export default Home;
