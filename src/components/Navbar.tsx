import React from 'react';
import { UtensilsCrossed, ShoppingCart, User, MoreVertical } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { label: 'Menú', path: '/' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Mi Cuenta', path: '/cliente/perfil' },
  ];

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to='/'
            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
          >
            <UtensilsCrossed className="w-8 h-8" />
            <span className="text-2xl font-bold">DeliciousExpress</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium px-4 py-2 rounded-lg transition-all ease-in-out duration-300 ${
                  location.pathname === item.path
                    ? 'text-white bg-primary-hover'
                    : 'text-white hover:bg-primary-hover'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <button className="text-white hover:opacity-80 transition-opacity">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="text-white hover:opacity-80 transition-opacity">
                <User className="w-5 h-5" />
              </button>
              <button className="text-white hover:opacity-80 transition-opacity">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
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
