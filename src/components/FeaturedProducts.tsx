import React, { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { fetchProductosDestacados } from '@services/productos';
import { useCart } from '@hooks/useCart';

const FeaturedProducts: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  // Función para obtener la cantidad de un producto en el carrito
  const getProductQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await fetchProductosDestacados();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
            Productos Destacados
          </h2>
          <div className="text-center text-gray-500">Cargando productos...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
          Productos Destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300"
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
                <p className="text-sm text-gray-600 mb-4">{producto.descripcion || 'Sin descripción'}</p>
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
      </div>
    </section>
  );
};

export default FeaturedProducts;
