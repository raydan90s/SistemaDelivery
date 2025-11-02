import React, { useEffect, useState } from 'react';
import { eliminarPedido, obtenerPedidos } from '../services/pedido'; // Llamada al servicio
import type { Pedido } from '../types/pedidosTypes'; // Tipo de datos de Pedido
import EditarPedido from '../components/EditarPedido';

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const pedidosData = await obtenerPedidos();
    setPedidos(pedidosData);
  };

  const handleEliminar = async (id: number) => {
    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) {
      return;
    }

    const resultado = await eliminarPedido(id);
    
    if (resultado !== null) {
      // Actualizar la lista sin el pedido eliminado
      setPedidos(pedidos.filter(pedido => pedido.id !== id));
      alert('Pedido eliminado correctamente');
    } else {
      alert('Error al eliminar el pedido');
    }
  };

  const handleEditar = (pedido: any) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  const PedidoRow = ({ pedido }: { pedido: Pedido }) => {
    return (
      <tr>
        <td className="px-6 py-2 text-center">{pedido.id}</td>
        <td className="px-6 py-2 text-center" >{pedido.cliente_id}</td>
        <td className="px-6 py-2 text-center">{pedido.clientes?.celular}</td>
        <td className="px-6 py-2 text-center">{pedido.clientes?.direccionescliente?.[0]?.direccion}</td>
        <td className="px-6 py-2 text-center">{pedido.fecha}</td>
        <td className="px-6 py-2 text-center">{pedido.estadospedido?.descripcion}</td>
        <td className="px-6 py-2 text-center">{pedido.tipoentrega?.descripcion}</td>
        <td className="px-6 py-2 text-center">${pedido.total}</td>
        <td className="px-6 py-2 text-center">
          <button className="px-6 py-2 text-center">Ver</button>
          <button className="px-6 py-2 text-center" onClick={() => handleEditar(pedido)}>Editar</button>
          <button className="px-6 py-2 text-center" onClick={() => handleEliminar(pedido.id)}>Eliminar</button>
        </td>
      </tr>
    );
  };

  return (
    <div className="text-left">
      <h1 className='m-6 text-3xl font-semibold'>Gestión de Pedidos</h1>
      <p className='m-6 text-lg '>Aquí puedes ver, editar y eliminar los pedidos realizados por los clientes.</p>
      <input  className='m-3 rounded bg-rose-100 w-72 h-8 text-center '  type="text" placeholder="Buscar por número, cliente o teléfono..." />
      <table className="table-auto w-full border-collapse border border-gray-700 mt-7 mb-12">
        <thead className="bg-gray-200 text-sm text-left">
          <tr>
            <th className="px-6 py-2 text-center">Número</th>
            <th className="px-6 py-2 text-center">Cliente</th>
            <th className="px-6 py-2 text-center">Teléfono</th>
            <th className="px-6 py-2 text-center">Dirección</th>
            <th className="px-6 py-2 text-center">Fecha</th>
            <th className="px-6 py-2 text-center">Estado</th>
            <th className="px-6 py-2 text-center">Tipo Entrega</th>
            <th className="px-6 py-2 text-center">Total</th>
            <th className="px-6 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <PedidoRow key={pedido.id} pedido={pedido} />
          ))}
        </tbody>
      </table>
      {modalAbierto && pedidoSeleccionado && (
        <EditarPedido
          pedido={pedidoSeleccionado}
          isOpen={modalAbierto}
          onClose={handleCerrarModal}
          onUpdate={fetchPedidos}
        />
      )}
    </div>
  );
};

export default PedidosPage;