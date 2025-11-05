import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchTipoDocumentos,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento
} from '@services/tipoDocumento';
import type { Database } from '@models/supabase';

type TipoDocumento = Database['public']['Tables']['tipodocumento']['Row'];
type TipoDocumentoInsert = Database['public']['Tables']['tipodocumento']['Insert'];
type TipoDocumentoUpdate = Database['public']['Tables']['tipodocumento']['Update'];

const TipoDocumentoAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<TipoDocumento, TipoDocumentoInsert, TipoDocumentoUpdate>
      title="Tipos de Documento"
      description="Gestiona los tipos de documento disponibles en el sistema"
      buttonLabel="Nuevo Documento"
      
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
        { key: 'descripcion', label: 'Descripción' }
      ]}
      
      searchFields={['descripcion']}
      
      operations={{
        fetch: fetchTipoDocumentos,
        create: createTipoDocumento,
        update: updateTipoDocumento,
        delete: deleteTipoDocumento
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

export default TipoDocumentoAdmin;