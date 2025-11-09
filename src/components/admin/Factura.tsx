import { useEffect, useState } from "react";
import { fetchFacturas, deleteFactura } from "@services/facturaService";
import ExportButtons from "@components/Botones/ExportButtons";
import { useNavigate } from "react-router-dom";
import { Trash2, Search, Eye } from "lucide-react";

export default function Factura() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const handleInactivar = async (id: number) => {
    if (!confirm("¿Deseas inactivar esta factura?")) return;
    await deleteFactura(id);
    setFacturas((prev) => prev.filter((f) => f.id !== id));
  };

  const facturasFiltradas = facturas.filter((f) =>
    `${f.cliente?.nombre ?? ""} ${f.cliente?.apellido ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Columnas para exportar
  const columnasReporte = [
    { key: "id", label: "ID" },
    {
      key: "cliente",
      label: "Cliente",
      render: (v: any, i: any) =>
        `${i.cliente?.nombre ?? ""} ${i.cliente?.apellido ?? ""}`,
    },
    { key: "total", label: "Total", render: (v: any) => `$${v}` },
    {
      key: "fecha",
      label: "Fecha",
      render: (v: any) => new Date(v).toLocaleDateString(),
    },
  ];

  const datosReporte = facturasFiltradas.map((f) => ({
    id: f.id,
    cliente: f.cliente
      ? `${f.cliente.nombre} ${f.cliente.apellido}`
      : "Sin cliente",
    total: f.total,
    fecha: f.fecha,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Facturas</h2>
        <p className="text-gray-600">
          Gestiona las facturas generadas en el sistema
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <ExportButtons
            title="Listado de Facturas"
            subtitle="Reporte general de facturación"
            filename="reporte_facturas"
            columns={columnasReporte}
            data={datosReporte}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {facturasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay facturas registradas.
                </td>
              </tr>
            ) : (
              facturasFiltradas.map((factura) => (
                <tr
                  key={factura.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {factura.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {factura.cliente
                      ? `${factura.cliente.nombre} ${factura.cliente.apellido}`
                      : "Sin cliente"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    ${factura.total}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(factura.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        navigate(`/admin/dashboard/facturacion/${factura.id}`, { replace: true })
                      }
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-3 transition-colors inline-block"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleInactivar(factura.id)}
                      className="cursor-pointer text-red-600 hover:text-red-800 transition-colors inline-block"
                      title="Inactivar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}