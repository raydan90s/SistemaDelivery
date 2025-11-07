import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  fetchProductos,
  fetchProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "@services/productos";

const gestionProductos: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio_base: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadProductos = async () => {
    setLoading(true);
    const data = await fetchProductos();
    setProductos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId !== null) {
      await updateProducto(editingId, { ...form, precio_base: Number(form.precio_base) });
    } else {
      await createProducto({ ...form, precio_base: Number(form.precio_base) });
    }
    setForm({ nombre: "", descripcion: "", precio_base: "" });
    setIsEditing(false);
    setEditingId(null);
    loadProductos();
  };

  const startEdit = async (id: number) => {
    const p = await fetchProductoById(id);
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio_base: p.precio_base?.toString() ?? "" });
    setEditingId(id);
    setIsEditing(true);
  };

  const remove = async (id: number) => {
    if (!confirm("¿Confirmar eliminación?")) return;
    await deleteProducto(id);
    loadProductos();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Productos</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.precio_base}
          onChange={(e) => setForm({ ...form, precio_base: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} /> {isEditing ? "Guardar Cambios" : "Agregar Producto"}
        </button>
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Descripción</th>
              <th className="p-2 text-left">Precio</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.descripcion}</td>
                <td className="p-2">${p.precio}</td>
                <td className="p-2 flex justify-center gap-3">
                  <button onClick={() => startEdit(p.id)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => remove(p.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default gestionProductos;

