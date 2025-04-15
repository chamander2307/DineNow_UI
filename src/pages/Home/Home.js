import React from 'react';

import FeaturedSection from '../../components/FeaturedSection';
import FilterBar from '../../components/FilterBar';
import FoodCategoryList from '../../components/FoodCategoryList';
import LocationSearchBar from '../../components/LocationSearchBar';
import Banner from '../../components/Banner';
import RelatedArticles from '../../components/RelatedArticles';

import '../../assets/styles/Home.css';
const Home = () => {
  return (
    <div className="App">
      <Banner />
      <LocationSearchBar />
      <FilterBar />
      <FeaturedSection />
      <RelatedArticles />
    </div>
  );
};

export default Home;