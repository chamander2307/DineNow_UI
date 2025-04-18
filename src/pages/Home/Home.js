import React from 'react';
import '../../assets/styles/Home.css';

import FeaturedSection from '../../components/FeaturedSection';
import FilterBar from '../../components/basicComponents/FilterBar';
import FoodCategoryList from '../../components/basicComponents/FoodCategoryList';
import LocationSearchBar from '../../components/basicComponents/LocationSearchBar';
import RelatedArticles from '../../components/RelatedArticles';
const Home = () => {
  return (
    <div className="App">
      <LocationSearchBar/>
      <FilterBar />
      <FoodCategoryList />
      <FeaturedSection />
      <RelatedArticles />
    </div>
  );
};

export default Home;