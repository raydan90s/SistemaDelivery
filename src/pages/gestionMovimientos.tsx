import { useEffect, useState } from "react";
import { fetchMovimientos } from "@services/movimientos";
import MovimientosForm from "@pages/movimientosForm";
import { Plus } from "lucide-react";

const gestionMovimientos = () => {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const loadMovimientos = async () => {
    const data = await fetchMovimientos();
    setMovimientos(data);
  };

  useEffect(() => {
    loadMovimientos();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestión de Movimientos</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Registrar Movimiento
        </button>
      </div>

      <table className="w-full border border-gray-200 rounded-lg text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Bodega</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Producto</th>
            <th className="p-2 text-left">Cantidad</th>
            <th className="p-2 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.bodega?.nombre ?? "-"}</td>
              <td className="p-2">{m.tipo_movimiento?.nombre ?? "-"}</td>
              <td className="p-2">{m.producto?.nombre ?? "-"}</td>
              <td className="p-2">{m.cantidad}</td>
              <td className="p-2">{new Date(m.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <MovimientosForm
          onClose={() => {
            setOpenModal(false);
            loadMovimientos();
          }}
        />
      )}
    </div>
  );
};

export default gestionMovimientos;
