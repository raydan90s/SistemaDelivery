import { useEffect, useState } from "react";
import {
  fetchFacturas,
  deleteFactura,
} from "@services/facturaService";
import { useNavigate } from "react-router-dom";

export default function Factura() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const data = await fetchFacturas();
        setFacturas(data);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarFacturas();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas inactivar esta factura?")) return;
    await deleteFactura(id);
    setFacturas(facturas.filter((f) => f.id !== id));
  };

  if (loading) return <p className="p-6">Cargando facturas...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listado de Facturas</h1>

      {facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{factura.id}</td>
                <td className="border p-2">
                  {factura.cliente?.nombre} {factura.cliente?.apellido}
                </td>
                <td className="border p-2">${factura.total}</td>
                <td className="border p-2">
                  {new Date(factura.fecha).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/detalle-factura/${factura.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleDelete(factura.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
