import React, { useState } from 'react';
import { User, MapPin, ShoppingBag } from 'lucide-react';
import PerfilTab from '@components/cliente/PerfilTab';
import DireccionesTab from '@components/cliente/DireccionesTab';
import PedidosTab from '@components/cliente/PedidosTab';

type TabType = 'perfil' | 'direcciones' | 'pedidos';

const ClientePerfil: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('perfil');

  const tabs = [
    {
      id: 'perfil' as TabType,
      label: 'Perfil',
      icon: User,
    },
    {
      id: 'direcciones' as TabType,
      label: 'Direcciones',
      icon: MapPin,
    },
    {
      id: 'pedidos' as TabType,
      label: 'Pedidos',
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Mi Cuenta</h1>
          <p className="text-gray-600 text-lg">
            Gestiona tu información personal y pedidos
          </p>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-all cursor-pointer
                    ${
                      isActive
                        ? 'text-primary border-b-2 border-primary bg-white'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'perfil' && <PerfilTab />}
          {activeTab === 'direcciones' && <DireccionesTab />}
          {activeTab === 'pedidos' && <PedidosTab />}
        </div>
      </div>
    </div>
  );
};

export default ClientePerfil;

