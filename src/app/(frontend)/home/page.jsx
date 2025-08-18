'use client';
import { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Events from '@/components/all-events';
import Hero from '@/components/homepage-components/hero';
import FeaturedEvents from '@/components/homepage-components/featured-events';
import Operations from '@/components/homepage-components/operations';
import FAQ from '@/components/shared/faq';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [featuredEventsData, setFeaturedEventsData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [hero, featured, events] = await Promise.all([
          apiService.get(ENDPOINTS.COMMON.SLIDERS),
          apiService.get(ENDPOINTS.EVENTS.FEATURED),
          apiService.get(ENDPOINTS.EVENTS.LIST),
        ]);

        setHeroData(hero.data);
        setFeaturedEventsData(featured.data);
        setEventsData(events.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Hero data={heroData} />
      <FeaturedEvents data={featuredEventsData} />
      {/* <Operations /> */}
      <Events data={eventsData} />
      <FAQ />
    </div>
  );
};

export default Home;
