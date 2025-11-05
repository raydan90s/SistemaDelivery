import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchProvincias,
  createProvincia,
  updateProvincia,
  deleteProvincia
} from '@services/provincia';
import type { Database } from '@models/supabase';

type Provincia = Database['public']['Tables']['provincias']['Row'];
type ProvinciaInsert = Database['public']['Tables']['provincias']['Insert'];
type ProvinciaUpdate = Database['public']['Tables']['provincias']['Update'];

const ProvinciasAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Provincia, ProvinciaInsert, ProvinciaUpdate>
      title="Provincias"
      description="Gestiona las provincias del Ecuador"
      buttonLabel="Nueva Provincia"
      
      fields={[
        {
          name: 'nombre',
          label: 'Nombre de la Provincia',
          type: 'text',
          placeholder: 'Ej: Pichincha, Guayas, Azuay',
          required: true
        }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Provincia' }
      ]}
      
      searchFields={['nombre']}
      
      operations={{
        fetch: fetchProvincias,
        create: createProvincia,
        update: updateProvincia,
        delete: deleteProvincia
      }}
      
      getFormData={(formValues) => ({
        nombre: formValues.nombre
      })}
      
      getInitialFormData={(item) => ({
        nombre: item?.nombre || ''
      })}
    />
  );
};

export default ProvinciasAdmin;