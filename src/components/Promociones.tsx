import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { fetchPromocionesConProductos } from '@services/promociones';

const Promociones: React.FC = () => {
  const [promociones, setPromociones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromociones();
  }, []);

  const loadPromociones = async () => {
    try {
      const data = await fetchPromocionesConProductos();
      setPromociones(data);
    } catch (error) {
      console.error('Error al cargar promociones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular el precio total de los productos en la promoción
  const calcularPrecioNormal = (promocion: any) => {
    if (!promocion.promocionesproductos || promocion.promocionesproductos.length === 0) {
      return 0;
    }
    return promocion.promocionesproductos.reduce((total: number, pp: any) => {
      const precio = pp.producto?.precio_base || 0;
      const cantidad = pp.cantidad || 1;
      return total + (precio * cantidad);
    }, 0);
  };

  // Función para calcular el precio con descuento
  const calcularPrecioOferta = (precioNormal: number, descuento: number) => {
    if (!descuento) return precioNormal;
    return precioNormal * (1 - descuento / 100);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
            Promociones Activas
          </h2>
          <div className="text-center text-gray-500">Cargando promociones...</div>
        </div>
      </section>
    );
  }

  if (promociones.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
          Promociones Activas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.map((promocion) => {
            const precioNormal = calcularPrecioNormal(promocion);
            const precioOferta = calcularPrecioOferta(precioNormal, promocion.descuento || 0);
            const descuento = promocion.descuento || 0;

            return (
              <div
                key={promocion.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300"
              >
                <div className="bg-primary text-white p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    <h3 className="text-xl font-bold">{promocion.nombre}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{promocion.descripcion}</p>

                  {precioNormal > 0 && (
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500 line-through">
                          Precio normal: ${precioNormal.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          ${precioOferta.toFixed(2)}
                        </p>
                      </div>
                      {descuento > 0 && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {Math.round(descuento)}% OFF
                        </div>
                      )}
                    </div>
                  )}

                  {promocion.promocionesproductos && promocion.promocionesproductos.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Productos incluidos:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {promocion.promocionesproductos.map((pp: any) => (
                          <li key={pp.id} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            {pp.producto?.nombre} {pp.cantidad > 1 && `(x${pp.cantidad})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {promocion.fecha_fin && (
                    <div className="mt-4 text-xs text-gray-500">
                      <p>Válido hasta: {new Date(promocion.fecha_fin).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Promociones;
