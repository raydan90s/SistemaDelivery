import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Search } from 'lucide-react';
import { searchProductos } from '@services/productos';
import { useCart } from '@hooks/useCart';

const ResultadosBusqueda: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (query) {
      loadProductos();
    } else {
      setLoading(false);
    }
  }, [query]);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await searchProductos(query);
      setProductos(data);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500">Buscando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al inicio</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-text-dark">
              Resultados de búsqueda
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {query ? (
              <>
                Búsqueda: "<span className="font-semibold">{query}</span>"
                {productos.length > 0 && (
                  <span className="ml-2">
                    ({productos.length} {productos.length === 1 ? 'resultado' : 'resultados'})
                  </span>
                )}
              </>
            ) : (
              'Ingresa un término de búsqueda'
            )}
          </p>
        </div>

        {!query ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              Por favor, ingresa un término de búsqueda en la barra superior
            </p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-4">
              No se encontraron productos para "{query}"
            </p>
            <p className="text-gray-400">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300"
              >
                <div className="h-48 overflow-hidden bg-gray-200">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {producto.categoria?.nombre || 'Sin categoría'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {producto.descripcion || 'Sin descripción'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${producto.precio_base?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart({
                        id: producto.id.toString(),
                        name: producto.nombre,
                        price: producto.precio_base,
                        description: producto.descripcion,
                        image: producto.imagen_url || '',
                        category: producto.categoria?.nombre || 'Sin categoría'
                      })}
                      className="bg-primary hover:bg-primary-hover text-white p-3 rounded-full shadow-md transition-all ease-in-out duration-300 hover:scale-110"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultadosBusqueda;
