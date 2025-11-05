import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchCiudades,
  createCiudad,
  updateCiudad,
  deleteCiudad,
  type CiudadConProvincia
} from '@services/ciudades';
import { fetchProvincias } from '@services/provincia';
import type { Database } from '@models/supabase';

type CiudadInsert = Database['public']['Tables']['ciudades']['Insert'];
type CiudadUpdate = Database['public']['Tables']['ciudades']['Update'];

const CiudadesAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<CiudadConProvincia, CiudadInsert, CiudadUpdate>
      title="Ciudades"
      description="Gestiona las ciudades del Ecuador por provincia"
      buttonLabel="Nueva Ciudad"
      
      fields={[
        {
          name: 'nombre',
          label: 'Nombre de la Ciudad',
          type: 'text',
          placeholder: 'Ej: Quito, Guayaquil, Cuenca',
          required: true
        },
        {
          name: 'provincia_id',
          label: 'Provincia',
          type: 'select',
          placeholder: 'Selecciona una provincia',
          required: true,
          fetchOptions: async () => {
            const provincias = await fetchProvincias();
            return provincias.map(p => ({
              value: p.id,
              label: p.nombre
            }));
          }
        }
      ]}
      
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Ciudad' },
        { 
          key: 'provincias', 
          label: 'Provincia',
          render: (value) => (value as { nombre: string })?.nombre || 'Sin provincia'
        }
      ]}
      
      searchFields={['nombre']}
      
      operations={{
        fetch: fetchCiudades,
        create: createCiudad,
        update: updateCiudad,
        delete: deleteCiudad
      }}
      
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        provincia_id: formValues.provincia_id ? Number(formValues.provincia_id) : null
      })}
      
      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        provincia_id: item?.provincia_id?.toString() || ''
      })}
    />
  );
};

export default CiudadesAdmin;