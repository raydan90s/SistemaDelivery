import React from 'react';
import { Pizza, Beef, Cake, Coffee } from 'lucide-react';

const Categories: React.FC = () => {
  const categories = [
    { name: 'Pizzas', icon: Pizza, color: 'bg-gray-200' },
    { name: 'Hamburguesas', icon: Beef, color: 'bg-gray-200' },
    { name: 'Postres', icon: Cake, color: 'bg-gray-200' },
    { name: 'Bebidas', icon: Coffee, color: 'bg-gray-200' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
          Nuestras Categorías
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className={`${category.color} p-8 rounded-2xl shadow-lg hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer`}
              >
                <div className="flex flex-col items-center gap-4">
                  <IconComponent className="w-16 h-16 text-primary" />
                  <h3 className="text-xl font-semibold text-text-dark">
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
