import React, { useEffect, useState } from 'react'
import { fetchBodegas, createBodega, updateBodega, deleteBodega } from '@services/bodegas'
import { fetchEstadosGenerales } from '@services/estadosGenerales'
import ExportButtons from "@components/Botones/ExportButtons";
import NuevoButton from "@components/Botones/nuevoButton";

export default function BodegasPage() {
  type Bodega = { id: number; nombre: string; ubicacion: string | null; estado_id: number | null }
  type Estado = { id: number; descripcion: string }

  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [form, setForm] = useState<{ nombre: string; ubicacion: string; estado_id: number }>({ nombre: '', ubicacion: '', estado_id: 1 })
  const [editingId, setEditingId] = useState<number | null>(null)

  async function loadData() {
    const b = await fetchBodegas()
    const e = await fetchEstadosGenerales()
    setBodegas(b)
    setEstados(e)
  }

  useEffect(() => { loadData() }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (editingId) {
      await updateBodega(editingId, form)
    } else {
      await createBodega(form)
    }
    setForm({ nombre: '', ubicacion: '', estado_id: 1 })
    setEditingId(null)
    loadData()
  }

  function handleEdit(b: Bodega) {
    setEditingId(b.id)
    setForm({ nombre: b.nombre, ubicacion: b.ubicacion ?? '', estado_id: b.estado_id ?? 1 })
  }

  async function handleDelete(id: number) {
    if (confirm('¿Eliminar bodega?')) {
      await deleteBodega(id)
      loadData()
    }
  }

 return (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-semibold">Gestión de Bodegas</h1>

      <div className="space-x-2">
        <div className="text-white px-4 py-2 rounded hover:bg-blue-700">
          <NuevoButton
            label="Nuevo"
            onClick={() => {
              setEditingId(null)
              setForm({ nombre: '', ubicacion: '', estado_id: 1 })
            }}
          />
        </div>

        <ExportButtons
          data={bodegas}
          filename="bodegas_export" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          title="Bodegas"
          columns={[
            { label: 'ID', key: 'id' },
            { label: 'Nombre', key: 'nombre' },
            { label: 'Ubicación', key: 'ubicacion' },
            { label: 'Estado', key: 'estado_id' }
          ]}
        />
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-3 mb-6 bg-white p-4 rounded shadow">
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full" />
      <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="border p-2 w-full" />
      <select name="estado_id" value={form.estado_id} onChange={handleChange} className="border p-2 w-full">
        {estados.map(e => <option key={e.id} value={e.id}>{e.descripcion}</option>)}
      </select>
      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">
        {editingId ? 'Actualizar' : 'Crear'}
      </button>
    </form>

    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 border">ID</th>
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">Ubicación</th>
          <th className="p-2 border">Estado</th>
          <th className="p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {bodegas.map(b => (
          <tr key={b.id}>
            <td className="p-2 border">{b.id}</td>
            <td className="p-2 border">{b.nombre}</td>
            <td className="p-2 border">{b.ubicacion}</td>
            <td className="p-2 border">{b.estado_id}</td>
            <td className="p-2 border space-x-2">
              <button onClick={() => handleEdit(b)} className="text-blue-600 hover:underline">Editar</button>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
}

