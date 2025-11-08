import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { updateCliente } from '@services/clientes';

interface ClienteData {
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;
  telefono: string;
}

const PerfilTab: React.FC = () => {
  const { clienteData, session, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClienteData>({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
  });

  useEffect(() => {
    if (clienteData && clienteData.usuario) {
      setFormData({
        nombre: clienteData.usuario.nombre || '',
        apellido: clienteData.usuario.apellido || '',
        email: session?.user?.email || '',
        cedula: clienteData.numero_documento || '',
        telefono: clienteData.usuario.celular || '',
      });
    }
  }, [clienteData, session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando datos...</div>
      </div>
    );
  }

  if (!clienteData || !clienteData.usuario) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No se pudieron cargar los datos del cliente</p>
          <p className="text-gray-400 text-sm">Por favor, inicia sesión como cliente</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!clienteData || !clienteData.usuario) {
      alert('No se pudieron cargar los datos del cliente');
      return;
    }

    setLoading(true);
    try {
      await updateCliente(clienteData.id, {
        nombre: formData.nombre,
        apellido: formData.apellido || null,
        celular: formData.telefono || null,
        numero_documento: formData.cedula || null,
      } as any);

      alert('Datos actualizados exitosamente');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      alert('Error al actualizar los datos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (clienteData && clienteData.usuario) {
      setFormData({
        nombre: clienteData.usuario.nombre || '',
        apellido: clienteData.usuario.apellido || '',
        email: session?.user?.email || '',
        cedula: clienteData.numero_documento || '',
        telefono: clienteData.usuario.celular || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-dark mb-1">
            Información Personal
          </h2>
          <p className="text-gray-600 text-sm">
            Actualiza tus datos personales
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`
                w-full px-4 py-3 border rounded-lg transition-colors
                ${
                  isEditing
                    ? 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }
              `}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true}
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
          </div>

          <div>
            <label
              htmlFor="cedula"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Cédula
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`
                w-full px-4 py-3 border rounded-lg transition-colors
                ${
                  isEditing
                    ? 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }
              `}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`
                w-full px-4 py-3 border rounded-lg transition-colors
                ${
                  isEditing
                    ? 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }
              `}
            />
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`
                w-full px-4 py-3 border rounded-lg transition-colors
                ${
                  isEditing
                    ? 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }
              `}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PerfilTab;

