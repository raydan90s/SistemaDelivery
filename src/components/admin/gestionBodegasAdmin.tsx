import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchBodegas,
  createBodega,
  updateBodega,
  deleteBodega
} from '@services/bodegas';
import { fetchEstadosGenerales } from '@services/estadosGenerales';
import type { Database } from '@models/supabase';

type Bodega = Database['public']['Tables']['bodegas']['Row'];
type BodegaInsert = Database['public']['Tables']['bodegas']['Insert'];
type BodegaUpdate = Database['public']['Tables']['bodegas']['Update'];

const BodegasAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Bodega, BodegaInsert, BodegaUpdate>
      title="Bodegas"
      description="Gestiona las bodegas del sistema"
      buttonLabel="Nueva Bodega"
      enableExport={true}
      exportFilename="bodegas"
      
      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ej: Bodega Principal',
          required: true
        },
        {
          name: 'ubicacion',
          label: 'Ubicación',
          type: 'text',
          placeholder: 'Ej: Av. Principal 123',
          required: false
        },
        {
          name: 'estado_id',
          label: 'Estado',
          type: 'select',
          placeholder: 'Selecciona un estado',
          required: true,
          fetchOptions: async () => {
            const estados = await fetchEstadosGenerales();
            return estados.map(e => ({
              value: e.id,
              label: e.descripcion
            }));
          }
        }
      ]}
      
      columns={[
        { 
          key: 'id', 
          label: 'ID',
          exportRender: (value) => value
        },
        { 
          key: 'nombre', 
          label: 'Nombre',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        },
        { 
          key: 'ubicacion', 
          label: 'Ubicación',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        },
        { 
          key: 'estado_id', 
          label: 'Estado',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        }
      ]}
      
      searchFields={['nombre', 'ubicacion']}
      
      operations={{
        fetch: fetchBodegas,
        create: createBodega,
        update: updateBodega,
        delete: async (id: number) => {
          await deleteBodega(id);
          return true;
        }
      }}
      
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        ubicacion: formValues.ubicacion || null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}
      
      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        ubicacion: item?.ubicacion || '',
        estado_id: item?.estado_id?.toString() || '1'
      })}
    />
  );
};

export default BodegasAdmin;