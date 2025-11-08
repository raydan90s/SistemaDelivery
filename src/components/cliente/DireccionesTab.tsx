import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Trash2 } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { fetchDireccionesCliente, createDireccionCliente, deleteDireccionCliente } from '@services/direccionesCliente';
import { fetchProvincias } from '@services/provincia';
import { fetchCiudadesByProvincia } from '@services/ciudades';
import type { DireccionClienteCompleta } from '@services/direccionesCliente';

const DireccionesTab: React.FC = () => {
  const { clienteData, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [direcciones, setDirecciones] = useState<DireccionClienteCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [provincias, setProvincias] = useState<Array<{ id: number; nombre: string }>>([]);
  const [ciudades, setCiudades] = useState<Array<{ id: number; nombre: string }>>([]);
  const [formData, setFormData] = useState({
    direccion: '',
    provincia_id: '',
    ciudad_id: '',
    codigo_postal: '',
    referencias: ''
  });

  useEffect(() => {
    if (clienteData) {
      loadDirecciones();
      loadProvincias();
    }
  }, [clienteData]);

  const loadDirecciones = async () => {
    if (!clienteData?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchDireccionesCliente(clienteData.id);
      setDirecciones(data);
    } catch (error) {
      console.error('Error cargando direcciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProvincias = async () => {
    try {
      const data = await fetchProvincias();
      setProvincias(data.map(p => ({ id: p.id, nombre: p.nombre })));
    } catch (error) {
      console.error('Error cargando provincias:', error);
    }
  };

  const handleProvinciaChange = async (provinciaId: string) => {
    setFormData(prev => ({ ...prev, provincia_id: provinciaId, ciudad_id: '' }));
    if (provinciaId) {
      try {
        const data = await fetchCiudadesByProvincia(Number(provinciaId));
        setCiudades(data.map(c => ({ id: c.id, nombre: c.nombre })));
      } catch (error) {
        console.error('Error cargando ciudades:', error);
        setCiudades([]);
      }
    } else {
      setCiudades([]);
    }
  };

  const handleSubmit = async () => {
    if (!clienteData?.id) {
      alert('No se pudieron cargar los datos del cliente');
      return;
    }

    if (!formData.direccion.trim()) {
      alert('La dirección es requerida');
      return;
    }

    try {
      await createDireccionCliente({
        cliente_id: clienteData.id,
        direccion: formData.direccion,
        provincia_id: formData.provincia_id ? Number(formData.provincia_id) : null,
        ciudad_id: formData.ciudad_id ? Number(formData.ciudad_id) : null,
        codigo_postal: formData.codigo_postal || null,
        referencias: formData.referencias || null
      });
      await loadDirecciones();
      handleCloseModal();
      alert('Dirección agregada exitosamente');
    } catch (error) {
      console.error('Error guardando dirección:', error);
      alert('Error al guardar la dirección');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta dirección?')) return;

    try {
      await deleteDireccionCliente(id);
      await loadDirecciones();
      alert('Dirección eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      alert('Error al eliminar la dirección');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      direccion: '',
      provincia_id: '',
      ciudad_id: '',
      codigo_postal: '',
      referencias: ''
    });
    setCiudades([]);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!clienteData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No se pudieron cargar los datos del cliente</p>
          <p className="text-gray-400 text-sm">Por favor, inicia sesión como cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-dark mb-1">
            Mis Direcciones
          </h2>
          <p className="text-gray-600 text-sm">
            Gestiona tus direcciones de entrega
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Dirección</span>
        </button>
      </div>

      {direcciones.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No tienes direcciones guardadas</p>
          <p className="text-gray-400 text-sm">
            Agrega una dirección para facilitar tus pedidos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {direcciones.map((direccion) => (
            <div key={direccion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-text-dark mb-2">{direccion.direccion}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    {direccion.provincias && (
                      <p>Provincia: {direccion.provincias.nombre}</p>
                    )}
                    {direccion.ciudades && (
                      <p>Ciudad: {direccion.ciudades.nombre}</p>
                    )}
                    {direccion.codigo_postal && (
                      <p>Código Postal: {direccion.codigo_postal}</p>
                    )}
                    {direccion.referencias && (
                      <p className="text-gray-500 italic">Referencias: {direccion.referencias}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(direccion.id)}
                  className="text-red-600 hover:text-red-800 transition-colors cursor-pointer ml-4"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-800">
                Agregar Dirección
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Av. Principal 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia
                  </label>
                  <select
                    value={formData.provincia_id}
                    onChange={(e) => handleProvinciaChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="">Selecciona una provincia</option>
                    {provincias.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <select
                    value={formData.ciudad_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, ciudad_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    disabled={!formData.provincia_id}
                  >
                    <option value="">Selecciona una ciudad</option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.codigo_postal}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo_postal: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: 170101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencias
                  </label>
                  <textarea
                    value={formData.referencias}
                    onChange={(e) => setFormData(prev => ({ ...prev, referencias: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Casa blanca, portón negro"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t flex-shrink-0">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DireccionesTab;

