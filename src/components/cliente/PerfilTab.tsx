import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

interface ClienteData {
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;
  telefono: string;
  fechaNacimiento: string;
}

const PerfilTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClienteData>({
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    cedula: '1234567890',
    telefono: '+593 99 123 4567',
    fechaNacimiento: '15/05/1990',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('Guardando datos:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
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
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
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

          <div>
            <label
              htmlFor="fechaNacimiento"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Fecha de Nacimiento
            </label>
            <input
              type="text"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="DD/MM/YYYY"
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

