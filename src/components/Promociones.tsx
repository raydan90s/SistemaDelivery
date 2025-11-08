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
          {promociones.map((promocion) => (
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

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 line-through">
                      Precio normal: ${promocion.precio_normal?.toFixed(2)}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${promocion.precio_oferta?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(((promocion.precio_normal - promocion.precio_oferta) / promocion.precio_normal) * 100)}% OFF
                  </div>
                </div>

                {promocion.promocionesproductos && promocion.promocionesproductos.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Productos incluidos:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {promocion.promocionesproductos.map((pp: any, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {pp.producto?.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  <p>Válido hasta: {new Date(promocion.fecha_fin).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promociones;
