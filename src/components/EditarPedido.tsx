import React, { useState, useEffect } from 'react';
import { actualizarPedido } from '../services/pedido';
import { obtenerEstadosPedido} from '../services/estadopedido'; 
import { obtenerTiposEntrega } from '../services/tipoentrega'; 


interface EditarPedidoModalProps {
  pedido: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditarPedidoModal: React.FC<EditarPedidoModalProps> = ({ 
  pedido, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    estado_pedido_id: pedido.estado_pedido_id || '',
    tipo_entrega_id: pedido.tipo_entrega_id || '',
  });

  const [estadosOptions, setEstadosOptions] = useState<any[]>([]);
  const [tiposEntregaOptions, setTiposEntregaOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar opciones cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  const cargarOpciones = async () => {
    const estados = await obtenerEstadosPedido();
    const tipos = await obtenerTiposEntrega();
    setEstadosOptions(estados);
    setTiposEntregaOptions(tipos);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await actualizarPedido(pedido.id, {
        estado_pedido_id: Number(formData.estado_pedido_id),
        tipo_entrega_id: Number(formData.tipo_entrega_id),
      });
      
      alert('Pedido actualizado correctamente');
      onUpdate(); 
      onClose(); 
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[600px] p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6">Editar Pedido</h2>

        <form onSubmit={handleSubmit}>
          {/* Fila 1: Número y Fecha */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Número de Pedido</label>
              <input
                type="text"
                value={`PED-${String(pedido.id).padStart(3, '0')}`}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input
                type="text"
                value={new Date(pedido.fecha).toLocaleString()}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Fila 2: Cliente y Teléfono */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cliente</label>
              <input
                type="text"
                value={`${pedido.clientes?.nombre} ${pedido.clientes?.apellido}`}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <input
                type="text"
                value={pedido.clientes?.celular || 'N/A'}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Fila 3: Dirección */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Dirección</label>
            <input
              type="text"
              value={pedido.clientes?.direccionescliente?.[0]?.direccion || 'N/A'}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Fila 4: Tipo de Entrega y Estado (EDITABLES) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Entrega</label>
              <select
                value={formData.tipo_entrega_id}
                onChange={(e) => setFormData({ ...formData, tipo_entrega_id: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccionar...</option>
                {tiposEntregaOptions.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={formData.estado_pedido_id}
                onChange={(e) => setFormData({ ...formData, estado_pedido_id: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccionar...</option>
                {estadosOptions.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? 'Actualizando...' : 'Actualizar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPedidoModal;