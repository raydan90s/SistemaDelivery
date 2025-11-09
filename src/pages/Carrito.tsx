import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@hooks/useCart';
import { useNavigate } from "react-router-dom";
import { crearPedido } from '@services/pedido';
import { crearDetallePedido } from '@services/detallespedido';
import PaymentModal from '@components/Carrito/PaymentModal';
import { createFactura } from '@services/facturaService';
import { createDetalleFactura } from '@services/detalleFacturaService';
import { fetchIVA } from '@services/IVA';
import { fetchRepartidoresActivos } from '@services/repartidores';
import { fetchDireccionesCliente, type DireccionClienteCompleta } from '@services/direccionesCliente';
import CartItem from '@components/Carrito/CartItem';
import OrderSummary from '@components/Carrito/OrderSummary';
import type { Database } from '@models/supabase';
import { scrollToHashOnLoad, handleScrollToTop } from '@utils/scrollUtils';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

type Repartidor = Database['public']['Tables']['repartidores']['Row'];

const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
    const { user, usuarioData, clienteData } = useAuth();
    
    // Estados
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [ivaPorcentaje, setIvaPorcentaje] = useState<number | null>(null);
    const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
    const [direcciones, setDirecciones] = useState<DireccionClienteCompleta[]>([]);
    const [selectedDireccionId, setSelectedDireccionId] = useState<number | undefined>(undefined);
    const [isLoadingDirecciones, setIsLoadingDirecciones] = useState(true);

    // Efecto de scroll
    useEffect(() => {
        if (location.hash) {
            scrollToHashOnLoad();
        } else {
            window.scrollTo(0, 0);
            setTimeout(() => {
                handleScrollToTop();
            }, 0);
        }
    }, [location.pathname, location.hash]);

    // Cargar IVA
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

    // Cargar repartidores
    useEffect(() => {
        const obtenerRepartidores = async () => {
            try {
                const repartidoresActivos = await fetchRepartidoresActivos();
                setRepartidores(repartidoresActivos);
                if (repartidoresActivos.length === 0) {
                    console.warn('⚠️ No hay repartidores activos disponibles');
                }
            } catch (error) {
                console.error('❌ Error al obtener repartidores:', error);
            }
        };
        obtenerRepartidores();
    }, []);

    // Cargar direcciones del cliente
    useEffect(() => {
        const obtenerDirecciones = async () => {
            if (!clienteData) {
                setIsLoadingDirecciones(false);
                return;
            }

            try {
                setIsLoadingDirecciones(true);
                const direccionesData = await fetchDireccionesCliente(clienteData.id);
                setDirecciones(direccionesData);
                
                // Seleccionar automáticamente la primera dirección si existe
                if (direccionesData.length > 0 && !selectedDireccionId) {
                    setSelectedDireccionId(direccionesData[0].id);
                }
            } catch (error) {
                console.error('❌ Error al obtener direcciones:', error);
                setDirecciones([]);
            } finally {
                setIsLoadingDirecciones(false);
            }
        };

        obtenerDirecciones();
    }, [clienteData]);

    // Funciones auxiliares
    const seleccionarRepartidorAleatorio = (): number | null => {
        if (repartidores.length === 0) {
            console.warn('⚠️ No hay repartidores disponibles. Se creará el pedido sin repartidor asignado.');
            return null;
        }
        const indiceAleatorio = Math.floor(Math.random() * repartidores.length);
        const repartidorSeleccionado = repartidores[indiceAleatorio];
        return repartidorSeleccionado.id;
    };

    const getSubtotal = () => {
        if (ivaPorcentaje === null) return getTotalPrice();
        return getTotalPrice() / (1 + ivaPorcentaje / 100);
    };

    const getIVAAmount = () => {
        return getTotalPrice() - getSubtotal();
    };

    // Handler para seleccionar dirección
    const handleSelectDireccion = (direccionId: number) => {
        setSelectedDireccionId(direccionId);
    };

    // Handlers
    const handleProceedToPayment = () => {
        if (!user || !usuarioData) {
            alert('Debes iniciar sesión para proceder con el pago');
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        if (!clienteData) {
            alert('Solo los clientes pueden realizar pedidos');
            return;
        }

        if (direcciones.length === 0) {
            alert('Debes agregar una dirección de entrega antes de continuar');
            navigate('/cliente/perfil');
            return;
        }

        if (!selectedDireccionId) {
            alert('Por favor selecciona una dirección de entrega');
            return;
        }

        setShowPaymentModal(true);
        handleScrollToTop();
    };

    const handlePayment = async () => {
        if (!user || !usuarioData || !clienteData) {
            alert('Debes iniciar sesión como cliente para realizar el pedido');
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        if (!selectedDireccionId) {
            alert('Por favor selecciona una dirección de entrega');
            return;
        }

        setPaymentSuccess(true);

        const repartidorId = seleccionarRepartidorAleatorio();

        const nuevoPedido = {
            cliente_id: clienteData.id,
            fecha: new Date().toISOString(),
            total: getTotalPrice(),
            estado_pedido_id: 2,
            tipo_entrega_id: 1,
            repartidor_id: repartidorId,
            estado_id: 1
        };

        try {
            const pedidoCreado = await crearPedido(nuevoPedido);
            
            if (!pedidoCreado || pedidoCreado.length === 0) {
                throw new Error('No se pudo crear el pedido');
            }

            const pedidoId = pedidoCreado[0].id;

            // Crear detalles del pedido
            for (const item of cartItems) {
                const detalle = {
                    pedido_id: pedidoId,
                    producto_id: Number(item.id),
                    cantidad: item.quantity,
                    precio: item.price,
                    subtotal: item.price * item.quantity
                };

                await crearDetallePedido(detalle);
            }

            // Crear factura
            const ivaData = await fetchIVA();
            let ivaIdActivo = 1;

            if (ivaData && ivaData.length > 0) {
                const ivaActivo = ivaData.find(iva => iva.estado_id === 1);
                if (ivaActivo) {
                    ivaIdActivo = ivaActivo.id;
                } else {
                    ivaIdActivo = ivaData[ivaData.length - 1].id;
                }
            }

            const nuevaFactura = {
                cliente_id: clienteData.id,
                pedido_id: pedidoId,
                fecha: new Date().toISOString(),
                total: getTotalPrice(),
                estado_id: 1,
                metodo_pago_id: 1,
                iva_id: ivaIdActivo
            };

            const facturaCreada = await createFactura(nuevaFactura);
            const facturaId = facturaCreada.id;

            // Crear detalles de factura
            for (const item of cartItems) {
                const detalleFactura = {
                    factura_id: facturaId,
                    producto_nombre: item.name,
                    cantidad: item.quantity,
                    precio: item.price,
                    subtotal: item.price * item.quantity
                };

                await createDetalleFactura(detalleFactura);
            }

            // Limpiar carrito y redirigir
            setTimeout(() => {
                clearCart();
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                navigate('/');
            }, 2000);

        } catch (error: any) {
            console.error('❌ Error al procesar el pago:', error);

            let mensajeError = 'Hubo un error al procesar tu pedido. ';

            if (error.message && error.message.includes('pedidos_ibfk')) {
                mensajeError += 'Verifica que todos los datos sean válidos.';
            } else {
                mensajeError += 'Por favor, intenta nuevamente.';
            }

            alert(mensajeError);
            setPaymentSuccess(false);
            setShowPaymentModal(false);
        }
    };

    // Render: Carrito vacío
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
                                className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                Explorar productos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render: Carrito con productos
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continuar comprando
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Carrito</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de productos */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    quantity={item.quantity}
                                    image={item.image}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>

                        {/* Resumen del pedido */}
                        <div className="lg:col-span-1">
                            <OrderSummary
                                totalItems={getTotalItems()}
                                subtotal={getSubtotal()}
                                ivaPercentage={ivaPorcentaje}
                                ivaAmount={getIVAAmount()}
                                total={getTotalPrice()}
                                direcciones={direcciones}
                                isLoadingDirecciones={isLoadingDirecciones}
                                selectedDireccionId={selectedDireccionId}
                                onSelectDireccion={handleSelectDireccion}
                                onProceedToPayment={handleProceedToPayment}
                                onNavigateToProfile={() => navigate('/cliente/perfil')}
                            />
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