import React from 'react';
import FeaturedSection from '../../components/FeaturedSection';
import FilterBar from '../../components/FilterBar';
import FoodCategoryList from '../../components/FoodCategoryList';
import '../../assets/styles/Home.css';
import LocationSearchBar from '../../components/LocationSearchBar';
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