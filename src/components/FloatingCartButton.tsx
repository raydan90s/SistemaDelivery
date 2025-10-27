import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@hooks/useCart';

const FloatingCartButton: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button className="fixed bottom-6 right-6 bg-primary hover:bg-primary-hover text-white p-4 rounded-full shadow-2xl transition-all ease-in-out duration-300 hover:scale-110 z-50">
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default FloatingCartButton;
