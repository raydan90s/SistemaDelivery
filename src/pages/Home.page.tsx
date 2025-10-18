// src/pages/Home.page.tsx
import React from "react";
import { Hero } from "@components/Hero/Hero";
import { FeaturedCategories } from "@components/Categorias/FeaturedCategories";
import { HowItWorks } from "@components/ComoFunciona/HowItWorks";

const HomePage: React.FC = () => {
  return (
    <main className="font-inter bg-background text-text-dark">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* How It Works */}
      <HowItWorks />
    </main>
  );
};

export default HomePage;
