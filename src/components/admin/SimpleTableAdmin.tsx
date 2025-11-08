import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, X } from 'lucide-react';
import NuevoButton from '@components/Botones/nuevoButton';
import ExportButtons from '@components/Botones/ExportButtons';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  options?: Array<{ value: number | string; label: string }>; 
  fetchOptions?: () => Promise<Array<{ value: number | string; label: string }>>;
}

interface CrudOperations<T, TInsert, TUpdate> {
  fetch: () => Promise<T[]>;
  create: (item: TInsert) => Promise<T>;
  update: (id: number, item: TUpdate) => Promise<T>;
  delete: (id: number) => Promise<boolean>;
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  exportRender?: (value: any, item: T) => string | number;
  excludeFromExport?: boolean;
}

interface SimpleTableAdminProps<T extends { id: number }, TInsert, TUpdate> {
  title: string;
  description: string;
  buttonLabel: string;
  fields: Field[];
  operations: CrudOperations<T, TInsert, TUpdate>;
  columns: Column<T>[];
  searchFields?: (keyof T)[];
  getFormData: (formValues: Record<string, any>) => TInsert | TUpdate;
  getInitialFormData: (item?: T) => Record<string, any>;
  enableExport?: boolean;
  exportFilename?: string;
  hideCreateButton?: boolean;
  customActions?: (item: T) => React.ReactNode;
}

function SimpleTableAdmin<T extends { id: number }, TInsert, TUpdate>({
  title,
  description,
  buttonLabel,
  fields,
  operations,
  columns,
  searchFields = [],
  getFormData,
  getInitialFormData,
  enableExport = true,
  exportFilename,
  hideCreateButton = false,
  customActions
}: SimpleTableAdminProps<T, TInsert, TUpdate>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [selectOptions, setSelectOptions] = useState<Record<string, Array<{ value: number | string; label: string }>>>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showModal) {
      loadSelectOptions();
    }
  }, [showModal]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await operations.fetch();
      setData(result);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadSelectOptions = async () => {
    const options: Record<string, Array<{ value: number | string; label: string }>> = {};
    
    for (const field of fields) {
      if (field.type === 'select') {
        if (field.fetchOptions) {
          try {
            options[field.name] = await field.fetchOptions();
          } catch (error) {
            console.error(`Error cargando opciones para ${field.name}:`, error);
            options[field.name] = [];
          }
        } else if (field.options) {
          options[field.name] = field.options;
        }
      }
    }
    
    setSelectOptions(options);
  };

  const handleOpenModal = (item?: T) => {
    if (item) {
      setEditingItem(item);
      setFormValues(getInitialFormData(item));
    } else {
      setEditingItem(null);
      setFormValues(getInitialFormData());
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormValues({});
    setSelectOptions({});
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = fields.filter(f => f.required);
    for (const field of requiredFields) {
      if (!formValues[field.name]?.toString().trim()) {
        alert(`El campo ${field.label} es requerido`);
        return;
      }
    }

    try {
      if (editingItem) {
        const payload = getFormData(formValues) as TUpdate;
        await operations.update(editingItem.id, payload);
      } else {
        const payload = getFormData(formValues) as TInsert;
        await operations.create(payload);
      }
      await loadData();
      handleCloseModal();
      alert(editingItem ? 'Actualizado exitosamente' : 'Creado exitosamente');
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return;

    try {
      await operations.delete(id);
      await loadData();
      alert('Eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar. Puede que esté en uso.');
    }
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return searchFields.some(field => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(searchLower);
    });
  });

  // Preparar columnas para exportación
  const exportColumns = columns
    .filter(col => !col.excludeFromExport)
    .map(col => ({
      key: String(col.key),
      label: col.label,
      render: col.exportRender || ((value: any, item: T) => {
        if (col.render) {
          const rendered = col.render(value, item);
          if (typeof rendered === 'string' || typeof rendered === 'number') {
            return rendered;
          }
          return String(value ?? '');
        }
        return String(value ?? '');
      })
    }));

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
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
          {enableExport && (
            <ExportButtons
              title={title}
              subtitle={description}
              filename={exportFilename || title.toLowerCase().replace(/\s+/g, '_')}
              columns={exportColumns}
              data={filteredData}
            />
          )}
          {!hideCreateButton && ( 
            <NuevoButton label={buttonLabel} onClick={() => handleOpenModal()} />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    idx === columns.length - 1 ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-gray-900">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    {customActions && customActions(item)}
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-3 transition-colors inline-block"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="cursor-pointer text-red-600 hover:text-red-800 transition-colors inline-block"
                      title="Eliminar"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingItem ? `Editar ${title.slice(0, -1)}` : `Nuevo ${title.slice(0, -1)}`}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {fields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      disabled={field.readOnly}
                    >
                      <option value="">{field.placeholder || 'Selecciona una opción'}</option>
                      {(selectOptions[field.name] || []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={field.placeholder}
                      rows={3}
                      readOnly={field.readOnly}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={field.placeholder}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      readOnly={field.readOnly}
                    />
                  )}
                </div>
              ))}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {editingItem ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleTableAdmin;