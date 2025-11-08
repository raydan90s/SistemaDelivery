import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '@services/clientes';
import { fetchTipoDocumentos } from '@services/tipoDocumento';
import { fetchEstadosGenerales } from '@services/estadosGenerales';
import { fetchTipoClientes } from '@services/tipoCliente';
import type { Database } from '@models/supabase';

type Cliente = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

const ClientesAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Cliente, ClienteInsert, ClienteUpdate>
      title="Clientes"
      description="Gestiona los clientes registrados en el sistema"
      buttonLabel="Nuevo Cliente"
      enableExport={true}
      exportFilename="clientes"
      
      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ej: Juan',
          required: true
        },
        {
          name: 'apellido',
          label: 'Apellido',
          type: 'text',
          placeholder: 'Ej: Pérez',
          required: false
        },
        {
          name: 'correo',
          label: 'Correo Electrónico',
          type: 'text',
          placeholder: 'Ej: juan@example.com',
          required: false
        },
        {
          name: 'celular',
          label: 'Celular',
          type: 'text',
          placeholder: 'Ej: 0991234567',
          required: false
        },
        {
          name: 'numero_documento',
          label: 'Número de Documento',
          type: 'text',
          placeholder: 'Ej: 1234567890',
          required: false
        },
        {
          name: 'tipo_documento_id',
          label: 'Tipo de Documento',
          type: 'select',
          placeholder: 'Selecciona un tipo de documento',
          required: false,
          fetchOptions: async () => {
            const tipos = await fetchTipoDocumentos();
            return tipos.map(t => ({
              value: t.id,
              label: t.descripcion
            }));
          }
        },
        {
          name: 'tipo_cliente_id',
          label: 'Tipo de Cliente',
          type: 'select',
          placeholder: 'Selecciona un tipo de cliente',
          required: false,
          fetchOptions: async () => {
            const tipos = await fetchTipoClientes();
            return tipos.map(t => ({
              value: t.id,
              label: t.descripcion
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
          exportRender: (value) => value
        },
        { 
          key: 'apellido', 
          label: 'Apellido',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        },
        { 
          key: 'correo', 
          label: 'Correo',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        },
        { 
          key: 'celular', 
          label: 'Celular',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        },
        { 
          key: 'numero_documento', 
          label: 'N° Documento',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        }
      ]}
      
      searchFields={['nombre', 'apellido', 'correo', 'celular', 'numero_documento']}
      
      operations={{
        fetch: fetchClientes,
        create: createCliente,
        update: updateCliente,
        delete: deleteCliente
      }}
      
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        apellido: formValues.apellido || null,
        correo: formValues.correo || null,
        celular: formValues.celular || null,
        numero_documento: formValues.numero_documento || null,
        tipo_documento_id: formValues.tipo_documento_id ? Number(formValues.tipo_documento_id) : null,
        tipo_cliente_id: formValues.tipo_cliente_id ? Number(formValues.tipo_cliente_id) : null
      })}
      
      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        apellido: item?.apellido || '',
        correo: item?.correo || '',
        celular: item?.celular || '',
        numero_documento: item?.numero_documento || '',
        tipo_documento_id: item?.tipo_documento_id?.toString() || '',
        tipo_cliente_id: item?.tipo_cliente_id?.toString() || ''
      })}
    />
  );
};

export default ClientesAdmin;


