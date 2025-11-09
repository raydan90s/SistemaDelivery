import React, { useState, useEffect, useRef } from 'react';
import { UtensilsCrossed, Search, User, ShoppingCart, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '@hooks/useCart';
import { useAuth } from '@context/AuthContext';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, usuarioData, signOut } = useAuth(); 

  const isAdmin = usuarioData?.rol?.nombre === 'Administrador' || usuarioData?.rol?.nombre === 'Super Administrador';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [usuarioData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
            <span className="text-2xl font-bold">DeliciousExpress</span>
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
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="cursor-pointer flex items-center gap-2 text-white hover:bg-primary-hover px-3 py-2 rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">
                      {usuarioData ? `Hola, ${usuarioData.nombre}` : 'Cargando...'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                      <Link
                        to="/cliente/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>Mi Cuenta</span>
                      </Link>
                      
                      {isAdmin && (
                        <>
                          <hr className="my-1" />
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                        </>
                      )}
                      
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="cursor-pointer text-white hover:bg-primary-hover p-2 rounded-lg transition-all"
                >
                  <User className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={() => navigate('/carrito')}
                className="cursor-pointer text-white hover:bg-primary-hover p-2 rounded-lg transition-all relative"
              >
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