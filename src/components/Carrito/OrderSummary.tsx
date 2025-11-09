import { CreditCard } from 'lucide-react';
import DeliveryAddress from '@components/Carrito/DeliveryAddress';
import type { DireccionClienteCompleta } from '@services/direccionesCliente';

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
                disabled={isLoadingDirecciones}
                className="cursor-pointer w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CreditCard className="w-5 h-5" />
                Proceder al pago
            </button>
        </div>
    );
};

export default OrderSummary;