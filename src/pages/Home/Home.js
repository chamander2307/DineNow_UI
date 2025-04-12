import React from 'react';
import Banner from '../../components/Banner';
import RestaurantSearch from '../Search/RestaurantSearch';
import FeaturedSection from '../../components/FeaturedSection';

import '../../assets/styles/Home.css';

const Home = () => {
  return (
    <div className="App">
      <Banner />
      <RestaurantSearch />
      <FeaturedSection />
    </div>
  );
};

export default Home;