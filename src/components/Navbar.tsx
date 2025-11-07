import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navItems = ['Inicio', 'Menú', 'Ofertas', 'Contacto', 'Pedidos'];

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <UtensilsCrossed className="w-8 h-8" />
            <span className="text-2xl font-bold">FoodExpress</span>
          </div>

          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'Pedidos' ? '/pedidos' : '/'}
                className="cursor-pointer text-white font-medium hover:bg-primary-hover px-4 py-2 rounded-lg transition-all ease-in-out duration-300"
              >
                {item}
              </Link>
            ))}
          </div>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
