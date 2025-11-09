import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFacturaById } from "@services/facturaService";
import { ArrowLeft } from "lucide-react";

export default function DetalleFactura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const data = await fetchFacturaById(Number(id));
        setFactura(data);
      } catch (error) {
        console.error("Error al cargar factura:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarFactura();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">
              Gestión de catálogos y configuraciones del sistema
            </p>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Cargando detalle...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">
              Gestión de catálogos y configuraciones del sistema
            </p>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">No se encontró la factura.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">
            Gestión de catálogos y configuraciones del sistema
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        
        <button
          onClick={() => navigate("/admin/dashboard/facturacion", { replace: true })}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Facturas
        </button>

        <div className="bg-white rounded-xl shadow-2xl p-6 mt-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Detalle de Factura #{factura.id}
            </h2>
            <p className="text-gray-600">Información completa de la factura</p>
          </div>

          {/* Información de la factura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Cliente
              </p>
              <p className="text-base text-gray-900">
                {factura.cliente?.nombre} {factura.cliente?.apellido}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Fecha
              </p>
              <p className="text-base text-gray-900">
                {new Date(factura.fecha).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Total
              </p>
              <p className="text-xl font-bold text-green-600">${factura.total}</p>
            </div>
          </div>

          {/* Título de productos */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
          </div>

          {/* Tabla de productos */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {factura.detallefactura?.length > 0 ? (
                  factura.detallefactura.map((d: any) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {d.producto_nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {d.cantidad}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${d.precio}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                        ${d.subtotal}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No hay productos asociados a esta factura.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}