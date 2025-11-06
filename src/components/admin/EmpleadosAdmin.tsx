import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
} from '@services/empleados';
import type { Database } from '@models/supabase';

type Empleado = Database['public']['Tables']['empleados']['Row'];
type EmpleadoInsert = Database['public']['Tables']['empleados']['Insert'];
type EmpleadoUpdate = Database['public']['Tables']['empleados']['Update'];

const TipoDocumentoAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Empleado, EmpleadoInsert, EmpleadoUpdate>
      title="Empleados"
      description="Gestiona los Empleados en el sistema"
      buttonLabel="Nuevo Empleado"
      
      fields={[
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'text',
          placeholder: 'Ej: Cédula, RUC, Pasaporte',
          required: true
        }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'apellido', label: 'apellido' }
      ]}
      
      searchFields={['apellido']}
      
      operations={{
        fetch: fetchEmpleados,
        create: createEmpleado,
        update: updateEmpleado,
        delete: deleteEmpleado
      }}
      
      getFormData={(formValues) => ({
        apellido: formValues.descripcion
      })}
      
      getInitialFormData={(item) => ({
        descripcion: item?.apellido || ''
      })}
    />
  );
};

export default TipoDocumentoAdmin;