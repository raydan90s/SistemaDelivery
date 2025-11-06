import React from 'react';
import { MapPin, Plus } from 'lucide-react';

const DireccionesTab: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-dark mb-1">
            Mis Direcciones
          </h2>
          <p className="text-gray-600 text-sm">
            Gestiona tus direcciones de entrega
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
          <Plus className="w-4 h-4" />
          <span>Agregar Dirección</span>
        </button>
      </div>

      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-2">No tienes direcciones guardadas</p>
        <p className="text-gray-400 text-sm">
          Agrega una dirección para facilitar tus pedidos
        </p>
      </div>
    </div>
  );
};

export default DireccionesTab;

