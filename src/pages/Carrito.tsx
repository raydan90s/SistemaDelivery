import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '@hooks/useCart';
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = () => {
        // Aquí puedes agregar tu lógica de pago
        setPaymentSuccess(true);
        setTimeout(() => {
            clearCart();
            setShowPaymentModal(false);
            setPaymentSuccess(false);
            // Aquí puedes redirigir o mostrar un mensaje de éxito
        }, 2000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">

                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-600 mb-6">Agrega algunos productos para comenzar</p>
                            <button 
                            onClick={()=> navigate('/')}
                            className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors">
                                Explorar productos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
                        <ArrowLeft className="w-5 h-5" />
                        Continuar comprando
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Carrito</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-orange-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({getTotalItems()} items)</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className="text-green-600">Gratis</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-orange-600">${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="cursor-pointer w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Proceder al pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        {!paymentSuccess ? (
                            <>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Pago</h3>
                                <p className="text-gray-600 mb-6">
                                    ¿Estás seguro que deseas proceder con el pago de <span className="font-bold text-orange-600">${getTotalPrice().toFixed(2)}</span>?
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Total de productos:</span>
                                        <span className="font-semibold">{getTotalItems()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Monto total:</span>
                                        <span className="font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handlePayment}
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
            )}
        </div>
    );
};

export default CartPage;