import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchEstadosGenerales,
  createEstadoGeneral,
  updateEstadoGeneral,
  deleteEstadoGeneral
} from '@services/estadosGenerales';
import type { Database } from '@models/supabase';

type EstadosGenerales = Database['public']['Tables']['estados_generales']['Row'];
type EstadosGeneralesInsert = Database['public']['Tables']['estados_generales']['Insert'];
type EstadosGeneralesUpdate = Database['public']['Tables']['estados_generales']['Update'];

const EstadosGeneralesAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<EstadosGenerales, EstadosGeneralesInsert, EstadosGeneralesUpdate>
      title="Estados Generales"
      description="Gestiona los Estados Generales del sistema"
      buttonLabel="Nuevo Estado"
      
      fields={[
        {
          name: 'descripcion',
          label: 'Nombre del Estado',
          type: 'text',
          placeholder: 'Ej: Activo, Inactivo, Pendiente',
          required: true
        }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'descripcion', label: 'Estado' }
      ]}
      
      searchFields={['descripcion']}
      
      operations={{
        fetch: fetchEstadosGenerales,
        create: createEstadoGeneral,
        update: updateEstadoGeneral,
        delete: deleteEstadoGeneral
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

export default EstadosGeneralesAdmin;