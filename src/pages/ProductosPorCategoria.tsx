import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { fetchProductosPorCategoria } from '@services/productos';
import { fetchCategoriaProductoById } from '@services/categoriasProducto';
import { useCart } from '@hooks/useCart';

const ProductosPorCategoria: React.FC = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  const [productos, setProductos] = useState<any[]>([]);
  const [categoria, setCategoria] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener la cantidad de un producto en el carrito
  const getProductQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (categoriaId) {
      loadData();
    }
  }, [categoriaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, categoriaData] = await Promise.all([
        fetchProductosPorCategoria(Number(categoriaId)),
        fetchCategoriaProductoById(Number(categoriaId))
      ]);
      setProductos(productosData);
      setCategoria(categoriaData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500">Cargando productos...</div>
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
          <h1 className="text-4xl font-bold text-text-dark mb-2">
            {categoria?.nombre || 'Categoría'}
          </h1>
          {categoria?.descripcion && (
            <p className="text-gray-600">{categoria.descripcion}</p>
          )}
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              No hay productos disponibles en esta categoría
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

                    {getProductQuantity(producto.id.toString()) === 0 ? (
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
                    ) : (
                      <div className="flex items-center gap-2 bg-primary rounded-full px-2 py-1">
                        <button
                          onClick={() => {
                            const quantity = getProductQuantity(producto.id.toString());
                            if (quantity === 1) {
                              removeFromCart(producto.id.toString());
                            } else {
                              updateQuantity(producto.id.toString(), quantity - 1);
                            }
                          }}
                          className="text-white hover:bg-primary-hover p-2 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-bold min-w-[20px] text-center">
                          {getProductQuantity(producto.id.toString())}
                        </span>
                        <button
                          onClick={() => updateQuantity(producto.id.toString(), getProductQuantity(producto.id.toString()) + 1)}
                          className="text-white hover:bg-primary-hover p-2 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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

export default ProductosPorCategoria;
