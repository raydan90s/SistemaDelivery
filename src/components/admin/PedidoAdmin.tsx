import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import SimpleTableAdmin from './SimpleTableAdmin';
import VerPedidoModal from './VerPedidoModal';
import { obtenerPedidos, actualizarPedido, eliminarPedido } from '../../services/pedido';
import { obtenerEstadosPedidoParaSelect } from '@services/estadoPedido';
import { obtenerTiposEntregaParaSelect } from '@services/tipoEntrega';
import type { PedidoConRelaciones } from '../../types/pedidosTypes';

const PedidoAdmin: React.FC = () => {
  const [viewingPedidoId, setViewingPedidoId] = useState<number | null>(null);

  return (
    <>
      <SimpleTableAdmin<PedidoConRelaciones, any, any>
        title="Gestión de Pedidos"
        description="Administra los pedidos realizados por los clientes"
        buttonLabel="Nuevo Pedido"
        hideCreateButton={true}
        fields={[
          {
            name: 'estado_pedido_id',
            label: 'Estado del Pedido',
            type: 'select',
            required: true,
            fetchOptions: obtenerEstadosPedidoParaSelect,
          },
          {
            name: 'tipo_entrega_id',
            label: 'Tipo de Entrega',
            type: 'select',
            required: true,
            fetchOptions: obtenerTiposEntregaParaSelect,
          }
        ]}

        columns={[
          { 
            key: 'id', 
            label: 'Número',
            exportRender: (value) => value
          },
          { 
            key: 'cliente_id',
            label: 'Cliente',
            render: (_, item) => {
              const usuario = item.clientes?.usuarios;
              return `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || 'N/A';
            },
            exportRender: (_, item) => {
              const usuario = item.clientes?.usuarios;
              return `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || 'N/A';
            }
          },
          { 
            key: 'cliente_id',
            label: 'Teléfono',
            render: (_, item) => item.clientes?.usuarios?.celular || 'N/A', 
            exportRender: (_, item) => item.clientes?.usuarios?.celular || 'N/A',
          },
          { 
            key: 'cliente_id',
            label: 'Dirección',
            render: (_, item) => item.clientes?.direccionescliente?.[0]?.direccion || 'N/A',
            exportRender: (_, item) => item.clientes?.direccionescliente?.[0]?.direccion || 'N/A',
          },
          { 
            key: 'fecha',
            label: 'Fecha',
            render: (value) => new Date(value).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            exportRender: (value) => new Date(value).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          },
          { 
            key: 'estado_pedido_id',
            label: 'Estado del Pedido',
            render: (_, item) => item.estadospedido?.descripcion || 'N/A',
            exportRender: (_, item) => item.estadospedido?.descripcion || 'N/A',
          },
          { 
            key: 'tipo_entrega_id',
            label: 'Tipo de Entrega',
            render: (_, item) => item.tipoentrega?.descripcion || 'N/A',
            exportRender: (_, item) => item.tipoentrega?.descripcion || 'N/A',
          },
          { 
            key: 'total',
            label: 'Total',
            render: (value) => `$${Number(value).toFixed(2)}`,
            exportRender: (value) => Number(value).toFixed(2)
          }
        ]}

        searchFields={['id']}

        operations={{
          fetch: obtenerPedidos,
          create: async () => { 
            throw new Error('La creación de pedidos no está permitida desde el panel de administración.'); 
          },
          update: actualizarPedido,
          delete: eliminarPedido,
        }}

        getFormData={(formValues) => ({
          estado_pedido_id: Number(formValues.estado_pedido_id),
          tipo_entrega_id: Number(formValues.tipo_entrega_id),
        })}

        getInitialFormData={(item) => ({
          estado_pedido_id: item?.estado_pedido_id || '',
          tipo_entrega_id: item?.tipo_entrega_id || '',
        })}

        enableExport={true}
        exportFilename="pedidos"

        customActions={(item) => (
          <button
            onClick={() => setViewingPedidoId(item.id)}
            className="cursor-pointer text-green-600 hover:text-green-800 mr-3 transition-colors inline-block"
            title="Ver detalles"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}
      /> 
     
      {viewingPedidoId !== null && (
        <VerPedidoModal
          pedidoId={viewingPedidoId}
          isOpen={true}
          onClose={() => setViewingPedidoId(null)}
        />
      )}
    </>
  );
};

export default PedidoAdmin;

