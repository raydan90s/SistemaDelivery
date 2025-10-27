import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import FloatingCartButton from '../components/FloatingCartButton';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero/>
      <Categories />
      <FeaturedProducts />
      <FloatingCartButton />
    </div>
  );
};

export default Home;
