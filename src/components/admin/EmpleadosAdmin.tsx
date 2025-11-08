import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  type EmpleadoConRelaciones
} from '@services/empleados';
import { fetchTiposEmpleado } from '@services/tipoEmpleado';
import {fetchEstadosGenerales} from '@services/estadosGenerales';
import type { Database } from '@models/supabase';

type Empleado = EmpleadoConRelaciones;
type EmpleadoInsert = Database['public']['Tables']['empleados']['Insert'];
type EmpleadoUpdate = Database['public']['Tables']['empleados']['Update'];

const TipoDocumentoAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Empleado, EmpleadoInsert, EmpleadoUpdate>
      title="Empleados"
      description="Gestiona los Empleados en el sistema"
      buttonLabel="Nuevo Empleado"
      
      fields={[
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'apellido', label: 'Apellido', type: 'text', required: false },
        { name: 'correo', label: 'Correo Electrónico', type: 'text', required: false },
        { name: 'celular', label: 'Celular', type: 'text', required: false },
        { name: 'tipo_empleado_id', label: 'Tipo de Empleado', type: 'select', required: false, fetchOptions: async () => {
                    const tipoEmpleado = await fetchTiposEmpleado();
                    return tipoEmpleado.map(p => ({
                      value: p.id,
                      label: p.descripcion
                    })); } },
        { name: 'estado_id', label: 'Estado', type: 'select', required: false, fetchOptions: async () => {
                    const Estado = await fetchEstadosGenerales();
                    return Estado.map(p => ({
                      value: p.id,
                      label: p.descripcion
                    })); } }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido'},
        { key: 'correo', label: 'Email'},
        { key: 'celular', label: 'Teléfono'},
        { key: 'tipo_empleado', label: 'Tipo de Empleado', 
          render: (value,item) => item.tipo_empleado?.descripcion || 'N/A'},
        { key: 'estado_id', label: 'Estado',
          render: (value,item) => item.estados_generales?.descripcion || 'N/A'
        }

      ]}
      
      searchFields={['apellido']}
      
      operations={{
        fetch: fetchEmpleados,
        create: createEmpleado,
        update: updateEmpleado,
        delete: deleteEmpleado
      }}
      
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        apellido: formValues.apellido || null,
        correo: formValues.correo || null,
        celular: formValues.celular || null,
        tipo_empleado_id: formValues.tipo_empleado_id ? Number(formValues.tipo_empleado_id) : null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}
      
      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        apellido: item?.apellido || '',
        correo: item?.correo || '',
        celular: item?.celular || '',
        tipo_empleado_id: item?.tipo_empleado_id || '',
        estado_id: item?.estado_id || ''
      })}
    />
  );
};

export default TipoDocumentoAdmin;