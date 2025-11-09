import React from 'react';
import Hero from '@components/Hero';
import Categories from '@components/Categories';
import Promociones from '@components/Promociones';
import FeaturedProducts from '@components/FeaturedProducts';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <Promociones />
      <FeaturedProducts />
    </div>
  );
};

export default Home;