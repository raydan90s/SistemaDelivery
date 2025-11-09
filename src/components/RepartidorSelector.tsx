import React, { useState, useEffect } from "react";
import { Truck, ChevronDown, User, Phone, Car } from "lucide-react";
import { fetchRepartidoresActivos } from "@services/repartidores";
import type { Database } from "@models/supabase";

type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"];

type RepartidorExtended = Repartidor & {
  tipovehiculo?: { descripcion: string };
};

interface RepartidorSelectorProps {
  selectedRepartidorId?: number | null;
  onRepartidorChange: (repartidorId: number | null) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const RepartidorSelector: React.FC<RepartidorSelectorProps> = ({
  selectedRepartidorId,
  onRepartidorChange,
  disabled = false,
  required = false,
  className = "",
}) => {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedRepartidor = repartidores.find(
    (r) => r.id === selectedRepartidorId,
  );

  useEffect(() => {
    loadRepartidores();
  }, []);

  const loadRepartidores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRepartidoresActivos();
      setRepartidores(data);
    } catch (err) {
      console.error("Error loading repartidores:", err);
      setError("Error al cargar los repartidores");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (repartidor: Repartidor | null) => {
    onRepartidorChange(repartidor?.id || null);
    setIsOpen(false);
  };

  const formatRepartidorName = (repartidor: Repartidor) => {
    const fullName = `${repartidor.nombre}${repartidor.apellido ? ` ${repartidor.apellido}` : ""}`;
    return fullName;
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50 ${className}`}
      >
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">
          Cargando repartidores...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center p-3 border border-red-300 rounded-lg bg-red-50 ${className}`}
      >
        <span className="text-sm text-red-600">{error}</span>
        <button
          onClick={loadRepartidores}
          className="ml-2 text-sm text-red-800 hover:text-red-900 underline cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed"
              : "bg-white border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          } ${required && !selectedRepartidorId ? "border-red-300" : ""}`}
        >
          <div className="flex items-center min-w-0">
            <Truck className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            {selectedRepartidor ? (
              <div className="flex items-center min-w-0">
                <span className="font-medium text-gray-900 truncate">
                  {formatRepartidorName(selectedRepartidor)}
                </span>
                {selectedRepartidor.telefono && (
                  <span className="ml-2 text-sm text-gray-500 flex-shrink-0">
                    • {selectedRepartidor.telefono}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-500">
                {required
                  ? "Selecciona un repartidor *"
                  : "Selecciona un repartidor"}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {!required && (
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
              >
                <span className="text-gray-500">Sin asignar</span>
              </button>
            )}

            {repartidores.length === 0 ? (
              <div className="px-4 py-3 text-center text-gray-500">
                No hay repartidores disponibles
              </div>
            ) : (
              repartidores.map((repartidor) => (
                <button
                  key={repartidor.id}
                  type="button"
                  onClick={() => handleSelect(repartidor)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 transition-colors cursor-pointer ${
                    selectedRepartidorId === repartidor.id
                      ? "bg-blue-50 border-r-2 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {formatRepartidorName(repartidor)}
                        </div>
                        {repartidor.telefono && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {repartidor.telefono}
                          </div>
                        )}
                      </div>
                    </div>
                    {(repartidor as RepartidorExtended).tipovehiculo && (
                      <div className="flex items-center text-xs text-gray-500 ml-2">
                        <Car className="w-3 h-3 mr-1" />
                        {
                          (repartidor as RepartidorExtended).tipovehiculo
                            ?.descripcion
                        }
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Validation message */}
      {required && !selectedRepartidorId && (
        <p className="mt-1 text-sm text-red-600">Este campo es requerido</p>
      )}
    </div>
  );
};

export default RepartidorSelector;
