import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchUnidadesMedida,
  createUnidadMedida,
  updateUnidadMedida,
  deleteUnidadMedida
} from '@services/unidadMedida';
import type { Database } from '@models/supabase';

type UnidadMedida = Database['public']['Tables']['unidadmedida']['Row'];
type UnidadMedidaInsert = Database['public']['Tables']['unidadmedida']['Insert'];
type UnidadMedidaUpdate = Database['public']['Tables']['unidadmedida']['Update'];

const UnidadMedidaAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<UnidadMedida, UnidadMedidaInsert, UnidadMedidaUpdate>
      title="Unidades de Medida"
      description="Gestiona las unidades de medida disponibles en el sistema"
      buttonLabel="Nueva Unidad de Medida"
      
      fields={[
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'text',
          placeholder: 'Ej: Kilogramo, Litro, Unidad',
          required: true
        }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'descripcion', label: 'Descripción' }
      ]}
      
      searchFields={['descripcion']}
      
      operations={{
        fetch: fetchUnidadesMedida,
        create: createUnidadMedida,
        update: updateUnidadMedida,
        delete: deleteUnidadMedida
      }}
      
      getFormData={(formValues) => ({
        descripcion: formValues.descripcion
      })}
      
      getInitialFormData={(item) => ({
        descripcion: item?.descripcion || ''
      })}
    />
  );
};

export default UnidadMedidaAdmin;