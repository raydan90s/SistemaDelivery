import { CreditCard } from 'lucide-react';
import DeliveryAddress from '@components/Carrito/DeliveryAddress';
import type { DireccionClienteCompleta } from '@services/direccionesCliente';
import type { MetodoPagoConEstado } from '@services/metodosPago';

interface OrderSummaryProps {
    totalItems: number;
    subtotal: number;
    ivaPercentage: number | null;
    ivaAmount: number;
    total: number;
    direcciones: DireccionClienteCompleta[];
    isLoadingDirecciones: boolean;
    selectedDireccionId?: number;
    onSelectDireccion?: (direccionId: number) => void;
    metodosPago: MetodoPagoConEstado[];
    selectedMetodoPagoId?: number;
    onSelectMetodoPago: (metodoPagoId: number) => void;
    onProceedToPayment: () => void;
    onNavigateToProfile: () => void;
}

const OrderSummary = ({
    totalItems,
    subtotal,
    ivaPercentage,
    ivaAmount,
    total,
    direcciones,
    isLoadingDirecciones,
    selectedDireccionId,
    onSelectDireccion,
    metodosPago,
    selectedMetodoPagoId,
    onSelectMetodoPago,
    onProceedToPayment,
    onNavigateToProfile
}: OrderSummaryProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>

            {/* Dirección de entrega */}
            <DeliveryAddress
                direcciones={direcciones}
                isLoading={isLoadingDirecciones}
                selectedDireccionId={selectedDireccionId}
                onSelectDireccion={onSelectDireccion}
                onNavigateToProfile={onNavigateToProfile}
            />

            {/* Selector de Método de Pago */}
            <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <CreditCard className="w-4 h-4" />
                    Método de pago
                </label>

                {metodosPago.length === 0 ? (
                    <div className="text-sm text-gray-500 bg-red-50 border border-red-200 rounded-lg p-3">
                        No hay métodos de pago disponibles
                    </div>
                ) : (
                    <select
                        value={selectedMetodoPagoId || ''}
                        onChange={(e) => onSelectMetodoPago(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                        <option value="">Selecciona un método</option>
                        {metodosPago.map((metodo) => (
                            <option key={metodo.id} value={metodo.id}>
                                {metodo.descripcion}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Desglose de precios */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>IVA ({ivaPercentage !== null ? ivaPercentage : '...'}%)</span>
                    <span>${ivaAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Botón de pago */}
            <button
                onClick={onProceedToPayment}
                disabled={isLoadingDirecciones || !selectedDireccionId || !selectedMetodoPagoId}
                className="cursor-pointer w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CreditCard className="w-5 h-5" />
                Proceder al pago
            </button>

            {/* Mensaje de ayuda */}
            {(!selectedDireccionId || !selectedMetodoPagoId) && (
                <p className="text-xs text-gray-500 text-center mt-3">
                    {!selectedDireccionId && !selectedMetodoPagoId 
                        ? 'Selecciona una dirección y método de pago'
                        : !selectedDireccionId 
                        ? 'Selecciona una dirección de entrega'
                        : 'Selecciona un método de pago'}
                </p>
            )}
        </div>
    );
};

export default OrderSummary;