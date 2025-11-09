import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, X, Plus } from 'lucide-react';
import NuevoButton from '@components/Botones/nuevoButton';
import ExportButtons from '@components/Botones/ExportButtons';
import {
  fetchPromociones,
  createPromocion,
  updatePromocion,
  deletePromocion
} from '@services/promociones';
import { fetchProductos } from '@services/productos';
import { fetchEstadosGenerales } from '@services/estadosGenerales';
import {
  fetchProductosPorPromocion,
  addProductoToPromocion,
  removeProductoFromPromocion,
  clearProductosDePromocion
} from '@services/promocionesProductos';
import type { Database } from '@models/supabase';

type Promocion = Database['public']['Tables']['promociones']['Row'];
type PromocionInsert = Database['public']['Tables']['promociones']['Insert'];
type PromocionUpdate = Database['public']['Tables']['promociones']['Update'];

interface ProductoSeleccionado {
  producto_id: number;
  cantidad: number;
  nombre?: string;
  precio_base?: number;
}

const PromocionesAdminAvanzado: React.FC = () => {
  const [promociones, setPromociones] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [promosData, prodsData, estadosData] = await Promise.all([
        fetchPromociones(),
        fetchProductos(),
        fetchEstadosGenerales()
      ]);
      setPromociones(promosData);
      setProductos(prodsData);
      setEstados(estadosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (promo?: any) => {
    if (promo) {
      setEditingPromocion(promo);
      setFormValues({
        nombre: promo.nombre || '',
        descripcion: promo.descripcion || '',
        imagen_url: promo.imagen_url || '',
        descuento: promo.descuento || '',
        fecha_inicio: promo.fecha_inicio || '',
        fecha_fin: promo.fecha_fin || '',
        estado_id: promo.estado_id || ''
      });

      // Cargar productos de la promoción
      try {
        const productosPromo = await fetchProductosPorPromocion(promo.id);
        setProductosSeleccionados(productosPromo.map((pp: any) => ({
          producto_id: pp.producto_id,
          cantidad: pp.cantidad,
          nombre: pp.producto?.nombre,
          precio_base: pp.producto?.precio_base
        })));
      } catch (error) {
        console.error('Error cargando productos de la promoción:', error);
        setProductosSeleccionados([]);
      }
    } else {
      setEditingPromocion(null);
      setFormValues({
        nombre: '',
        descripcion: '',
        imagen_url: '',
        descuento: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado_id: ''
      });
      setProductosSeleccionados([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromocion(null);
    setFormValues({});
    setProductosSeleccionados([]);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAgregarProducto = () => {
    if (productos.length === 0) return;
    const nuevoProducto: ProductoSeleccionado = {
      producto_id: productos[0].id,
      cantidad: 1,
      nombre: productos[0].nombre,
      precio_base: productos[0].precio_base
    };
    setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
  };

  const handleQuitarProducto = (index: number) => {
    setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
  };

  const handleCambiarProducto = (index: number, productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index] = {
      ...nuevosProductos[index],
      producto_id: productoId,
      nombre: producto.nombre,
      precio_base: producto.precio_base
    };
    setProductosSeleccionados(nuevosProductos);
  };

  const handleCambiarCantidad = (index: number, cantidad: number) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index].cantidad = cantidad;
    setProductosSeleccionados(nuevosProductos);
  };

  const handleSubmit = async () => {
    if (!formValues.nombre?.trim()) {
      alert('El nombre es requerido');
      return;
    }

    try {
      let promocionId: number;

      if (editingPromocion) {
        const payload: PromocionUpdate = {
          nombre: formValues.nombre,
          descripcion: formValues.descripcion || null,
          imagen_url: formValues.imagen_url || null,
          descuento: formValues.descuento ? Number(formValues.descuento) : null,
          fecha_inicio: formValues.fecha_inicio || null,
          fecha_fin: formValues.fecha_fin || null,
          estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
        };
        await updatePromocion(editingPromocion.id, payload);
        promocionId = editingPromocion.id;

        // Limpiar productos existentes
        await clearProductosDePromocion(promocionId);
      } else {
        const payload: PromocionInsert = {
          nombre: formValues.nombre,
          descripcion: formValues.descripcion || null,
          imagen_url: formValues.imagen_url || null,
          descuento: formValues.descuento ? Number(formValues.descuento) : null,
          fecha_inicio: formValues.fecha_inicio || null,
          fecha_fin: formValues.fecha_fin || null,
          estado_id: formValues.estado_id ? Number(formValues.estado_id) : 1
        };
        const nuevaPromo = await createPromocion(payload);
        promocionId = nuevaPromo.id;
      }

      // Agregar productos seleccionados
      for (const prod of productosSeleccionados) {
        await addProductoToPromocion({
          promocion_id: promocionId,
          producto_id: prod.producto_id,
          cantidad: prod.cantidad
        });
      }

      await loadData();
      handleCloseModal();
      alert(editingPromocion ? 'Actualizado exitosamente' : 'Creado exitosamente');
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de inactivar esta promoción?')) return;

    try {
      await deletePromocion(id);
      await loadData();
      alert('Promoción inactivada exitosamente');
    } catch (error) {
      console.error('Error inactivando:', error);
      alert('Error al inactivar');
    }
  };

  const filteredData = promociones.filter(promo => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      promo.nombre?.toLowerCase().includes(searchLower) ||
      promo.descripcion?.toLowerCase().includes(searchLower)
    );
  });

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Promociones</h2>
        <p className="text-gray-600">Gestiona las promociones y combos con descuentos o productos agrupados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <ExportButtons
            title="Reporte de Promociones"
            subtitle="Listado de promociones activas"
            data={filteredData}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'nombre', label: 'Nombre' },
              { key: 'descripcion', label: 'Descripción' },
              { key: 'descuento', label: 'Descuento (%)' },
              { key: 'fecha_inicio', label: 'Fecha Inicio' },
              { key: 'fecha_fin', label: 'Fecha Fin' },
              {
                key: 'estado',
                label: 'Estado',
                render: (value: any) => value?.descripcion || '-'
              }
            ]}
            filename="promociones"
          />
          <NuevoButton label="Nueva Promoción" onClick={() => handleOpenModal()} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descuento</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fin</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              filteredData.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm">{promo.id}</td>
                  <td className="px-6 py-4">
                    {promo.imagen_url ? (
                      <img src={promo.imagen_url} alt={promo.nombre} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{promo.nombre}</td>
                  <td className="px-6 py-4 text-sm">{promo.descuento ? `${promo.descuento}%` : '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    {promo.fecha_inicio ? new Date(promo.fecha_inicio).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {promo.fecha_fin ? new Date(promo.fecha_fin).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(promo)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-red-600 hover:text-red-800"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingPromocion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formValues.nombre || ''}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Combo Familiar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label>
                  <input
                    type="text"
                    value={formValues.imagen_url || ''}
                    onChange={(e) => handleInputChange('imagen_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descuento (%)</label>
                  <input
                    type="number"
                    value={formValues.descuento || ''}
                    onChange={(e) => handleInputChange('descuento', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={formValues.estado_id || ''}
                    onChange={(e) => handleInputChange('estado_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un estado</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>{estado.descripcion}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formValues.fecha_inicio || ''}
                    onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="date"
                    value={formValues.fecha_fin || ''}
                    onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formValues.descripcion || ''}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción de la promoción"
                  rows={3}
                />
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Productos en la Promoción</h4>
                  <button
                    onClick={handleAgregarProducto}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </button>
                </div>

                {productosSeleccionados.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay productos agregados</p>
                ) : (
                  <div className="space-y-3">
                    {productosSeleccionados.map((prod, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <select
                          value={prod.producto_id}
                          onChange={(e) => handleCambiarProducto(index, Number(e.target.value))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} - ${p.precio_base}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={prod.cantidad}
                          onChange={(e) => handleCambiarCantidad(index, Number(e.target.value))}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Cant."
                          min="1"
                        />
                        <button
                          onClick={() => handleQuitarProducto(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPromocion ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromocionesAdminAvanzado;
