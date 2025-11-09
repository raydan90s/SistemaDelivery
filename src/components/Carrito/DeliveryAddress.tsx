import { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import type { DireccionClienteCompleta } from '@services/direccionesCliente';

interface DeliveryAddressProps {
    direcciones: DireccionClienteCompleta[];
    isLoading: boolean;
    selectedDireccionId?: number;
    onSelectDireccion?: (direccionId: number) => void;
    onNavigateToProfile: () => void;
}

const DeliveryAddress = ({ 
    direcciones, 
    isLoading, 
    selectedDireccionId,
    onSelectDireccion,
    onNavigateToProfile 
}: DeliveryAddressProps) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const formatearDireccion = (direccion: DireccionClienteCompleta) => {
        const partes = [direccion.direccion];
        
        if (direccion.ciudades?.nombre) {
            partes.push(direccion.ciudades.nombre);
        }
        
        if (direccion.provincias?.nombre) {
            partes.push(direccion.provincias.nombre);
        }
        
        if (direccion.codigo_postal) {
            partes.push(direccion.codigo_postal);
        }
        
        return partes.join(', ');
    };

    // Obtener la dirección seleccionada o la primera por defecto
    const direccionActual = selectedDireccionId 
        ? direcciones.find(d => d.id === selectedDireccionId) 
        : direcciones[0];

    const handleSelectDireccion = (direccionId: number) => {
        if (onSelectDireccion) {
            onSelectDireccion(direccionId);
        }
        setShowDropdown(false);
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-800">Dirección de entrega</h3>
                </div>
            </div>
            
            {isLoading ? (
                <p className="text-gray-500 text-sm mb-3 ml-7">Cargando direcciones...</p>
            ) : direcciones.length > 0 && direccionActual ? (
                <>
                    {/* Dirección seleccionada */}
                    <div className="ml-7 mb-3">
                        <p className="text-gray-700 text-sm">
                            {formatearDireccion(direccionActual)}
                        </p>
                        {direccionActual.referencias && (
                            <p className="text-gray-500 text-xs mt-1 italic">
                                Ref: {direccionActual.referencias}
                            </p>
                        )}
                    </div>

                    {/* Selector de direcciones (solo si hay más de una) */}
                    {direcciones.length > 1 && (
                        <div className="mb-3 relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="cursor-pointer w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-3 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between"
                            >
                                <span>Seleccionar otra dirección ({direcciones.length} disponibles)</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown de direcciones */}
                            {showDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {direcciones.map((direccion) => (
                                        <button
                                            key={direccion.id}
                                            onClick={() => handleSelectDireccion(direccion.id)}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                                direccion.id === direccionActual.id ? 'bg-orange-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-700 font-medium">
                                                        {formatearDireccion(direccion)}
                                                    </p>
                                                    {direccion.referencias && (
                                                        <p className="text-xs text-gray-500 mt-1 italic">
                                                            Ref: {direccion.referencias}
                                                        </p>
                                                    )}
                                                </div>
                                                {direccion.id === direccionActual.id && (
                                                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botón para gestionar direcciones */}
                    <button
                        onClick={onNavigateToProfile}
                        className="cursor-pointer w-full text-sm text-orange-600 hover:text-orange-700 font-medium py-2 px-3 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        {direcciones.length > 1 ? 'Gestionar direcciones' : 'Cambiar dirección'}
                    </button>
                </>
            ) : (
                <>
                    <p className="text-red-600 text-sm mb-3 ml-7">No tienes una dirección registrada</p>
                    <button
                        onClick={onNavigateToProfile}
                        className="cursor-pointer w-full text-sm bg-orange-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Agregar dirección
                    </button>
                </>
            )}
        </div>
    );
};

export default DeliveryAddress;