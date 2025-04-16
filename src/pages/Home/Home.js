import React from 'react';
import '../../assets/styles/Home.css';

import FeaturedSection from '../../components/FeaturedSection';
import FilterBar from '../../components/FilterBar';
import FoodCategoryList from '../../components/FoodCategoryList';
import LocationSearchBar from '../../components/LocationSearchBar';

const Home = () => {
  return (
    <div className="App">
      <LocationSearchBar/>
      <FilterBar />
      <FoodCategoryList />
      <FeaturedSection />
    </div>
  );
};

export default Home;