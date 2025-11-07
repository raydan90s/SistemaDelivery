import React, { useEffect } from 'react';
import Hero from '@components/Hero';
import Categories from '@components/Categories';
import FeaturedProducts from '@components/FeaturedProducts';
import FloatingCartButton from '@components/FloatingCartButton';
import { fetchBodegas, seedBodegas } from '@services/bodegas';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  useEffect(() => {
    fetchBodegas();
    seedBodegas();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Secciones originales del sistema */}
      <Hero />
      <Categories />
      <FeaturedProducts />

      {/* ==== Zona para tu módulo de INVENTARIO ==== */}
      <section className="mt-10 px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Gestión de Inventario
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <Link
            to="/pages/gestionProductos"
            className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <h3 className="font-semibold text-lg">Productos</h3>
            <p className="text-sm text-gray-500">Ver / Crear / Editar</p>
          </Link>

          <Link
            to="/pages/gestionBodegas"
            className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <h3 className="font-semibold text-lg">Bodegas</h3>
            <p className="text-sm text-gray-500">Administrar Bodegas</p>
          </Link>

          <Link
            to="/pages/gestionMovimientos"
            className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <h3 className="font-semibold text-lg">Movimientos</h3>
            <p className="text-sm text-gray-500">Entradas / Salidas</p>
          </Link>

        </div>
      </section>
      {/* ==== Fin módulo Inventario ==== */}

      <FloatingCartButton />
    </div>
  );
};

export default Home;