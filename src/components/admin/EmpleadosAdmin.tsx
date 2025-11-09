import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  type EmpleadoConRelaciones,
  type EmpleadoForm
} from '@services/empleados';
import { fetchTiposEmpleado } from '@services/tipoEmpleado';
type Empleado = EmpleadoConRelaciones;
type EmpleadoInsert = EmpleadoForm;
type EmpleadoUpdate = EmpleadoForm;
const EmpleadosAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Empleado, EmpleadoInsert, EmpleadoUpdate>
      title="Empleados"
      description="Gestiona los Empleados en el sistema"
      buttonLabel="Nuevo Empleado" 
      fields={[        
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'apellido', label: 'Apellido', type: 'text', required: false },
        { name: 'celular', label: 'Celular', type: 'text', required: false },
        { name: 'tipo_empleado_id', label: 'Tipo de Empleado', type: 'select', required: false, fetchOptions: async () => {
            const tipoEmpleado = await fetchTiposEmpleado();
            return tipoEmpleado.map(p => ({
              value: p.id,
              label: p.descripcion
            })); } }
      ]}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'usuarios', label: 'Nombre',
          render: (value, item) => item.usuarios?.nombre || 'N/A' },
                { key: 'usuario_id', label: 'Apellido',
          render: (value, item) => item.usuarios?.apellido || 'N/A' },
                  { key: 'tipo_empleado_id', label: 'Teléfono',
          render: (value, item) => item.usuarios?.celular || 'N/A' },
                { key: 'tipo_empleado', label: 'Tipo de Empleado', 
          render: (value, item) => item.tipo_empleado?.descripcion || 'N/A'},
        { key: 'estados_generales', label: 'Estado',
          render: (value, item) => item.estados_generales?.descripcion || 'N/A'
        }
      ]}
      searchFields={['usuarios']}      
      operations={{
        fetch: fetchEmpleados,
        create: createEmpleado,
        update: updateEmpleado,
        delete: deleteEmpleado
      }}
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        apellido: formValues.apellido || null,
        celular: formValues.celular || null,
        rol_id: formValues.rol_id ? Number(formValues.rol_id) : null,
        tipo_empleado_id: formValues.tipo_empleado_id ? Number(formValues.tipo_empleado_id) : null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null,
        usuario_id: formValues.usuario_id ? Number(formValues.usuario_id) : undefined
      })} 
      getInitialFormData={(item) => ({
        nombre: item?.usuarios?.nombre || '',
        apellido: item?.usuarios?.apellido || '',
        celular: item?.usuarios?.celular || '',
        rol_id: item?.usuarios?.rol_id || '5', 
        tipo_empleado_id: item?.tipo_empleado_id || '',
        estado_id: item?.estado_id || '1',
        usuario_id: item?.usuario_id || '' 
      })}
    />
  );
};

export default EmpleadosAdmin;