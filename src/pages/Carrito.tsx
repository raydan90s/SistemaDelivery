import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '@hooks/useCart';
import { useNavigate } from "react-router-dom";
import { crearPedido } from '@services/pedido';
import { crearDetallePedido } from '@services/detallespedido';
import PaymentModal from '@components/PaymentModal';
import { fetchIVA } from '@services/IVA';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [ivaPorcentaje, setIvaPorcentaje] = useState<number | null>(null);

    useEffect(() => {
        const obtenerIVA = async () => {
            try {
                const ivaData = await fetchIVA();
                if (ivaData && ivaData.length > 0) {
                    const ivaActivo = ivaData.find(iva => iva.estado_id === 1);
                    if (ivaActivo) {
                        setIvaPorcentaje(ivaActivo.porcentaje);
                    } else {
                        setIvaPorcentaje(ivaData[ivaData.length - 1].porcentaje);
                    }
                }
            } catch (error) {
                console.error('Error al obtener IVA:', error);
                setIvaPorcentaje(15); 
            }
        };
        obtenerIVA();
    }, []);

    const getSubtotal = () => {
        if (ivaPorcentaje === null) return getTotalPrice();
        return getTotalPrice() / (1 + ivaPorcentaje / 100);
    };

    const getIVAAmount = () => {
        return getTotalPrice() - getSubtotal();
    };

    const handlePayment = async () => {
        setPaymentSuccess(true);
        
        const nuevoPedido = {
            cliente_id: 1, //Reemplazar con cliente context
            fecha: new Date().toISOString(),
            total: getTotalPrice(),
            estado_pedido_id: 2, //En preparacion
            tipo_entrega_id: 1, //delivery
            repartidor_id: null,
            estado_id: 1 //Activo
        };

        try {
            const pedidoCreado = await crearPedido(nuevoPedido);

            if (!pedidoCreado || pedidoCreado.length === 0) {
                throw new Error('No se pudo crear el pedido');
            }

            const pedidoId = pedidoCreado[0].id;
            console.log('Pedido creado con ID:', pedidoId);

            for (const item of cartItems) {
                const detalle = {
                    pedido_id: pedidoId,
                    producto_id: Number(item.id),
                    cantidad: item.quantity,
                    precio: item.price,
                    subtotal: item.price * item.quantity
                };
                
                const detalleCreado = await crearDetallePedido(detalle);
                
                if (!detalleCreado) {
                    console.error('Error al crear detalle para producto:', item.id);
                }
            }

            console.log('Pedido y detalles creados exitosamente');

            setTimeout(() => {
                clearCart();
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
            setPaymentSuccess(false);
            setShowPaymentModal(false);
        }
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
                                onClick={() => navigate('/')}
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
                        {/* Lista de productos */}
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
                                        <span>${getSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>IVA ({ivaPorcentaje !== null ? ivaPorcentaje : '...'}%)</span>
                                        <span>${getIVAAmount().toFixed(2)}</span>
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

            <PaymentModal
                isOpen={showPaymentModal}
                paymentSuccess={paymentSuccess}
                totalPrice={getTotalPrice()}
                totalItems={getTotalItems()}
                onClose={() => setShowPaymentModal(false)}
                onConfirm={handlePayment}
            />
        </div>
    );
};

export default CartPage;