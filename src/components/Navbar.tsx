import React, { useState } from 'react';
import { UtensilsCrossed, Search, User, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '@hooks/useCart';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to='/'
            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <UtensilsCrossed className="w-8 h-8" />
            <span className="text-2xl font-bold">FoodExpress</span>
          </Link>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-white/50 focus:outline-none bg-white"
              />
            </form>

            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => navigate('/login')}
                className="cursor-pointer text-white hover:bg-primary-hover p-2 rounded-lg transition-all" >
                <User className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigate('/carrito')}
                className="cursor-pointer text-white hover:bg-primary-hover p-2 rounded-lg transition-all relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
