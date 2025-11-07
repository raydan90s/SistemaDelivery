import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchTiposEmpleado,
  createTipoEmpleado,
  updateTipoEmpleado,
  deleteTipoEmpleado,
  type TipoEmpleadoConRelaciones
} from '@services/tipoEmpleado';
import {fetchEstadosGenerales} from '@services/estadosGeneralesService';
import type { Database } from '@models/supabase';

type TipoEmpleadoRow = TipoEmpleadoConRelaciones;
type TipoEmpleadoInsert = Database['public']['Tables']['tipoempleado']['Insert'];
type TipoEmpleadoUpdate = Database['public']['Tables']['tipoempleado']['Update'];

const TipoEmpleadoAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<TipoEmpleadoRow, TipoEmpleadoInsert, TipoEmpleadoUpdate>
      title="Tipos de Empleado"
      description="Gestiona los roles o tipos de empleado (ej: Administrador, Bodeguero)"
      buttonLabel="Nuevo Tipo de Empleado"
      
      fields={[
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'text',
          placeholder: 'Ej: Administrador, Bodeguero',
          required: true
        },
        { name: 'estado_id', label: 'Estado', type: 'select', required: false, fetchOptions: async () => {
                            const Estado = await fetchEstadosGenerales();
                            return Estado.map(p => ({
                              value: p.id,
                              label: p.descripcion
                            })); } }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'descripcion', label: 'Descripción' },
        { 
          key: 'estados_generales',
          label: 'Estado',
          render: (value,item) => item.estados_generales?.descripcion || 'N/A'
        }
      ]}
      
      searchFields={['descripcion']}
      
      operations={{
        fetch: fetchTiposEmpleado,
        create: createTipoEmpleado,
        update: updateTipoEmpleado,
        delete: deleteTipoEmpleado
      }}
      
      getFormData={(formValues) => ({
        descripcion: formValues.descripcion,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}
      
      getInitialFormData={(item) => ({
        descripcion: item?.descripcion || '',
        estado_id: item?.estado_id || ''
      })}
    />
  );
};

export default TipoEmpleadoAdmin;