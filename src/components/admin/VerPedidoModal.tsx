import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { obtenerPedidoPorId } from '@services/pedido';
import type { PedidoConRelaciones } from '../../types/pedidosTypes';

interface VerPedidoModalProps {
    pedidoId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

const VerPedidoModal: React.FC<VerPedidoModalProps> = ({ pedidoId, isOpen, onClose }) => {
    const [pedido, setPedido] = useState<PedidoConRelaciones | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && pedidoId !== null) {
            loadPedido();
        }
    }, [isOpen, pedidoId]);

    const loadPedido = async () => {
        if (pedidoId === null) return;
        try {
            setLoading(true);
            const data = await obtenerPedidoPorId(pedidoId);
            setPedido(data);
        } catch (error) {
            console.error('Error al cargar el pedido;', error);
            alert('Error al cargar el pedido');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-EC', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    if (!isOpen || pedidoId === null) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Detalles del Pedido #{pedido?.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="text-lg text-gray-600"> Cargando detalles del pedido...</div>
                    </div>
                ) : pedido ? (
                    <div className="p-6 space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Información del Cliente</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nombre</p>
                                    <p className="font-medium text-gray-900">
                                        {pedido.clientes?.nombre} {pedido.clientes?.apellido}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Teléfono</p>
                                    <p className="font-medium text-gray-900">{pedido.clientes?.celular || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Dirección</p>
                                    <p className="font-medium text-gray-900">
                                        {pedido.clientes?.direccionescliente?.[0]?.direccion || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Detalle del Pedido</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Fecha</p>
                                    <p className="font-medium text-gray-900">{formatDate(pedido.fecha)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Estado</p>
                                    <p className="font-medium text-gray-900">{pedido.estadospedido?.descripcion || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tipo de Entrega</p>
                                    <p className="font-medium text-gray-900">{pedido.tipoentrega?.descripcion || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="font-medium text-gray-900 text-xl">{formatCurrency(pedido.total)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Productos del Pedido</h3>
                            <div className="space-y-3">
                                {pedido.detallepedido && pedido.detallepedido.length > 0 ? (
                                    pedido.detallepedido.map((detalle) => (
                                        <div
                                            key={detalle.id}
                                            className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
                                        >
                                            {detalle.productos?.imagen_url && (
                                                <img
                                                    src={detalle.productos.imagen_url}
                                                    alt={detalle.productos.nombre || 'Producto'}
                                                    className="w-20 h-20 object-cover rounded"
                                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/80?text=Sin+Imagen')}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    {detalle.productos?.nombre || 'Producto sin nombre'}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {detalle.productos?.descripcion || 'Sin descripción'}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Cantidad:</span> {detalle.cantidad}
                                                        <span className="mx-2">•</span>
                                                        <span className="font-medium">Precio unitario:</span>{' '}
                                                        {formatCurrency(detalle.precio)}
                                                    </div>
                                                    <div className="font-semibold text-gray-900">
                                                        Subtotal: {formatCurrency(detalle.subtotal)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-red-600">No hay productos en este pedido</div>
                                )}

                                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-red-600">No se encontró el pedido</div>
                )}
            </div>
        </div>
    );
};

export default VerPedidoModal;
            