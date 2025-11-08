import React, { useState, useEffect, useCallback } from "react";
import { Truck, Plus, Trash2, Eye, User, Phone, Car } from "lucide-react";
import RepartidorSelector from "@components/RepartidorSelector";
import {
  fetchRepartidores,
  createRepartidor,
  deleteRepartidor,
} from "@services/repartidores";
import { seedTipoVehiculos } from "@services/tipoVehiculo";
import type { Database } from "@models/supabase";

type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"];

type RepartidorExtended = Repartidor & {
  tipovehiculo?: { descripcion: string };
  estados_generales?: { descripcion: string };
};

const RepartidoresDemo: React.FC = () => {
  const [repartidores, setRepartidores] = useState<RepartidorExtended[]>([]);
  const [selectedRepartidorId, setSelectedRepartidorId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeData = useCallback(async () => {
    try {
      // Seed vehicle types if needed
      await seedTipoVehiculos();

      // Create sample repartidores if none exist
      const existingRepartidores = await fetchRepartidores();
      if (existingRepartidores.length === 0) {
        const sampleRepartidores = [
          {
            nombre: "Carlos",
            apellido: "Rodríguez",
            telefono: "0987654321",
            tipo_vehiculo_id: 1,
            estado_id: 1,
          },
          {
            nombre: "María",
            apellido: "González",
            telefono: "0976543210",
            tipo_vehiculo_id: 2,
            estado_id: 1,
          },
          {
            nombre: "Juan",
            apellido: "Pérez",
            telefono: "0965432109",
            tipo_vehiculo_id: 1,
            estado_id: 1,
          },
        ];

        for (const repartidor of sampleRepartidores) {
          try {
            await createRepartidor(repartidor);
          } catch (error) {
            console.log("Sample repartidor might already exist:", error);
          }
        }
        await loadData();
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
    initializeData();
  }, [initializeData]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRepartidores();
      setRepartidores(data);
    } catch (err) {
      console.error("Error loading repartidores:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSample = async () => {
    try {
      const newRepartidor = {
        nombre: "Nuevo",
        apellido: "Repartidor",
        telefono: "0912345678",
        tipo_vehiculo_id: 1,
        estado_id: 1,
      };

      await createRepartidor(newRepartidor);
      await loadData();
      alert("Repartidor creado exitosamente");
    } catch (error) {
      console.error("Error creating repartidor:", error);
      alert("Error al crear repartidor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este repartidor?")) return;

    try {
      await deleteRepartidor(id);
      await loadData();
      alert("Repartidor eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting repartidor:", error);
      alert("Error al eliminar repartidor");
    }
  };

  const formatRepartidorName = (repartidor: RepartidorExtended) => {
    return `${repartidor.nombre}${repartidor.apellido ? ` ${repartidor.apellido}` : ""}`;
  };

  const getVehicleType = (repartidor: RepartidorExtended) => {
    return repartidor.tipovehiculo?.descripcion || "Sin vehículo";
  };

  const getStatus = (repartidor: RepartidorExtended) => {
    const estado = repartidor.estados_generales;
    if (!estado) return "Sin estado";

    const badgeColor =
      estado.descripcion === "Activo"
        ? "bg-green-100 text-green-800"
        : estado.descripcion === "Inactivo"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
      >
        {estado.descripcion}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Demo Repartidores
                </h1>
                <p className="text-gray-600 mt-1">
                  Prueba las funcionalidades del módulo de repartidores
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateSample}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Repartidor de Prueba
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Repartidor Selector Demo */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selector de Repartidores
            </h2>
            <p className="text-gray-600 mb-6">
              Componente para asignar repartidores a pedidos
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Repartidor
                </label>
                <RepartidorSelector
                  selectedRepartidorId={selectedRepartidorId}
                  onRepartidorChange={setSelectedRepartidorId}
                  required={true}
                />
              </div>

              {selectedRepartidorId && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Repartidor Seleccionado:
                  </h3>
                  <p className="text-blue-800">ID: {selectedRepartidorId}</p>
                  {(() => {
                    const selectedRep = repartidores.find(
                      (r) => r.id === selectedRepartidorId,
                    );
                    return selectedRep ? (
                      <p className="text-blue-800">
                        Nombre: {formatRepartidorName(selectedRep)}
                      </p>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Estadísticas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Truck className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {repartidores.length}
                    </p>
                    <p className="text-blue-700 text-sm">Total Repartidores</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">
                      {
                        repartidores.filter(
                          (r) => r.estados_generales?.descripcion === "Activo",
                        ).length
                      }
                    </p>
                    <p className="text-green-700 text-sm">Activos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repartidores List */}
        <div className="bg-white rounded-xl shadow-md mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Lista de Repartidores
            </h2>
            <p className="text-gray-600 mt-1">
              Todos los repartidores registrados en el sistema
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadData}
                className="mt-2 text-red-600 hover:text-red-800 underline cursor-pointer"
              >
                Recargar
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repartidores.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No hay repartidores registrados
                    </td>
                  </tr>
                ) : (
                  repartidores.map((repartidor) => (
                    <tr key={repartidor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {repartidor.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatRepartidorName(repartidor)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {repartidor.telefono && (
                            <>
                              <Phone className="w-4 h-4 text-gray-400 mr-2" />
                              {repartidor.telefono}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          {getVehicleType(repartidor)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatus(repartidor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedRepartidorId(repartidor.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                          title="Seleccionar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(repartidor.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Cómo usar el módulo de Repartidores
          </h3>
          <div className="space-y-2 text-blue-800">
            <p>
              • <strong>Admin Dashboard:</strong> Ve a /admin/dashboard y busca
              el módulo "Repartidores"
            </p>
            <p>
              • <strong>Gestión completa:</strong> Crear, editar, eliminar y
              buscar repartidores
            </p>
            <p>
              • <strong>Tipos de vehículo:</strong> Asigna motocicletas,
              bicicletas, automóviles, etc.
            </p>
            <p>
              • <strong>Estados:</strong> Controla si están activos, inactivos o
              eliminados
            </p>
            <p>
              • <strong>Exportación:</strong> Descarga datos en PDF o Excel
            </p>
            <p>
              • <strong>Selector:</strong> Componente reutilizable para asignar
              repartidores a pedidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepartidoresDemo;
