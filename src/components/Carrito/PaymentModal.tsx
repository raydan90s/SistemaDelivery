interface PaymentModalProps {
    isOpen: boolean;
    paymentSuccess: boolean;
    totalPrice: number;
    totalItems: number;
    onClose: () => void;
    onConfirm: () => void;
}

const PaymentModal = ({ 
    isOpen, 
    paymentSuccess, 
    totalPrice, 
    totalItems, 
    onClose, 
    onConfirm 
}: PaymentModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                {!paymentSuccess ? (
                    <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Pago</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro que deseas proceder con el pago de{' '}
                            <span className="font-bold text-orange-600">${totalPrice.toFixed(2)}</span>?
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Total de productos:</span>
                                <span className="font-semibold">{totalItems}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Monto total:</span>
                                <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirm}
                                className="cursor-pointer flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold"
                            >
                                Confirmar Pago
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h3>
                        <p className="text-gray-600">Procesando tu pedido...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;