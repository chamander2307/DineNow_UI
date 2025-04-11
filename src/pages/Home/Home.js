import React from 'react';
import Header from '../../components/Header';
import Banner from '../../components/Banner';
import RestaurantList from '../../components/RestaurantList';
import RestaurantSearch from '../Search/RestaurantSearch';
import Footer from '../../components/Footer';
import '../../assets/styles/Home.css';

const Home = () => {
  return (
    <div className="App">
      <Banner />
      <RestaurantSearch />
    </div>
  );
};

export default Home;