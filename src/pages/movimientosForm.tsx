import React, { useEffect, useState } from "react";
import { fetchBodegas } from "@services/bodegas";
import { fetchProductos } from "@services/productos";
import { fetchMovimientos, createMovimiento } from "@services/movimientos";

type Bodega = {
  id: number;
  nombre: string;
  ubicacion: string | null;
  estado_id: number | null;
};

type Producto = {
  id: number;
  nombre: string;
  [key: string]: any;
};

type TipoMovimiento = {
  id: number;
  nombre: string;
  [key: string]: any;
};

type FormState = {
  bodega_id: string;
  tipo_movimiento_id: string;
  producto_id: string;
  cantidad: string;
  observaciones: string;
};

const MovimientosForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipos, setTipos] = useState<TipoMovimiento[]>([]);
  const [form, setForm] = useState<FormState>({
    bodega_id: "",
    tipo_movimiento_id: "",
    producto_id: "",
    cantidad: "",
    observaciones: "",
  });

  const loadData = async () => {
    setBodegas(await fetchBodegas());
    setProductos(await fetchProductos());
    // setTipos(await fetchTiposMovimientos()); // Remove or replace with correct function
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.bodega_id || !form.tipo_movimiento_id || !form.producto_id || !form.cantidad) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    if (Number(form.cantidad) <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    await createMovimiento({
      ...form,
      bodega_id: Number(form.bodega_id),
      tipo_movimiento_id: Number(form.tipo_movimiento_id),
      producto_id: Number(form.producto_id),
      cantidad: Number(form.cantidad),
      fecha: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Registrar Movimiento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Bodega</label>
            <select
              name="bodega_id"
              value={form.bodega_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione</option>
              {bodegas.map((b) => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Tipo Movimiento</label>
            <select
              name="tipo_movimiento_id"
              value={form.tipo_movimiento_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Producto</label>
            <select
              name="producto_id"
              value={form.producto_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              min="1"
            />
          </div>

          <div>
            <label className="block mb-1">Observaciones (opcional)</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >Cancelar</button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimientosForm;