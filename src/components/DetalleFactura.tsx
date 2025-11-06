import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchFacturaById,
} from "@services/facturaService";
import {
  fetchDetallesFactura,
} from "@services/detalleFacturaService";

export default function DetalleFactura() {
  const { facturaId } = useParams();
  const [factura, setFactura] = useState<any | null>(null);
  const [detalles, setDetalles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!facturaId) return;
        const facturaData = await fetchFacturaById(Number(facturaId));
        const detallesData = await fetchDetallesFactura(Number(facturaId));
        setFactura(facturaData);
        setDetalles(detallesData);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      }
    };

    cargarDatos();
  }, [facturaId]);

  if (!factura) return <p className="p-6">Cargando factura...</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Factura #{factura.id}
      </h1>

      <p><strong>Cliente:</strong> {factura.cliente?.nombre} {factura.cliente?.apellido}</p>
      <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${factura.total}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Detalles</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle) => (
            <tr key={detalle.id} className="text-center hover:bg-gray-50">
              <td className="border p-2">{detalle.producto_nombre}</td>
              <td className="border p-2">{detalle.cantidad}</td>
              <td className="border p-2">${detalle.precio}</td>
              <td className="border p-2">${detalle.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
