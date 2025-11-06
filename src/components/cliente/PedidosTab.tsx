import React from 'react';
import { ShoppingBag } from 'lucide-react';

const PedidosTab: React.FC = () => {
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

      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-2">No tienes pedidos realizados</p>
        <p className="text-gray-400 text-sm">
          Tus pedidos aparecerán aquí una vez que realices tu primera compra
        </p>
      </div>
    </div>
  );
};

export default PedidosTab;

