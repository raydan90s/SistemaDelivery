import React from 'react';
import { Plus } from 'lucide-react';
import { products } from '@data/products';
import { useCart } from '@hooks/useCart';

const FeaturedProducts: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-color-text-dark mb-12">
          Productos Destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-color-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-primary hover:bg-primary-hover text-white p-3 rounded-full shadow-md transition-all ease-in-out duration-300 hover:scale-110"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
