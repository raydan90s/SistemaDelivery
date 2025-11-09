import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { obtenerPedidosPorClienteId } from '@services/pedido';
import type { PedidoConRelaciones, DetallePedido } from '../../types/pedidosTypes';

const PedidosTab: React.FC = () => {
  const { clienteData, isLoading } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoConRelaciones[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clienteData && !isLoading) {
      loadPedidos();
    }
  }, [clienteData, isLoading]);

  const loadPedidos = async () => {
    if (!clienteData?.id) {
      console.log('No hay clienteData o clienteData.id');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Cargando pedidos para cliente:', clienteData.id);
      const data = await obtenerPedidosPorClienteId(clienteData.id);
      console.log('Pedidos cargados:', data);
      setPedidos(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      alert('Error al cargar los pedidos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando datos del cliente...</div>
      </div>
    );
  }

  if (!clienteData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No se pudieron cargar los datos del cliente</p>
          <p className="text-gray-400 text-sm">Por favor, inicia sesión como cliente</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-dark mb-1">
          Mis Pedidos
        </h2>
        <p className="text-gray-600 text-sm">
          Revisa el historial de tus pedidos
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No tienes pedidos realizados</p>
          <p className="text-gray-400 text-sm">
            Tus pedidos aparecerán aquí una vez que realices tu primera compra
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-text-dark">
                      Pedido #{pedido.id}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(pedido.fecha)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-text-dark">{formatCurrency(pedido.total)}</span>
                    </div>
                    {pedido.estadospedido && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {pedido.estadospedido.descripcion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {pedido.detallepedido && pedido.detallepedido.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-text-dark mb-2">Productos:</h4>
                  <div className="space-y-2">
                    {pedido.detallepedido.map((detalle: DetallePedido) => (
                      <div key={detalle.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {detalle.productos?.imagen_url && (
                            <img 
                              src={detalle.productos.imagen_url} 
                              alt={detalle.productos.nombre || ''}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-text-dark">
                              {detalle.productos?.nombre || 'Producto'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Cantidad: {detalle.cantidad} × {formatCurrency(detalle.precio)}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-text-dark">
                          {formatCurrency(detalle.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pedido.tipoentrega && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Tipo de entrega: {pedido.tipoentrega.descripcion}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosTab;

