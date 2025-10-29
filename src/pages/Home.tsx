import React, { useEffect } from 'react';
import Hero from '@components/Hero';
import Categories from '@components/Categories';
import FeaturedProducts from '@components/FeaturedProducts';
import FloatingCartButton from '@components/FloatingCartButton';
import { fetchBodegas, seedBodegas } from '@services/bodegas';

const Home: React.FC = () => {
  useEffect(() => {
    fetchBodegas();
    seedBodegas();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FloatingCartButton />
    </div>
  );
};

export default Home;
