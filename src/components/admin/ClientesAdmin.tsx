import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  type ClienteConRelaciones
} from '@services/clientes';
import { fetchTipoDocumentos } from '@services/tipoDocumento';
import { fetchTipoClientes } from '@services/tipoCliente';
import type { Database } from '@models/supabase';

type Cliente = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

const ClientesAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<ClienteConRelaciones, ClienteInsert, ClienteUpdate>
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
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Ej: juan.perez@example.com',
          required: true
        },
        {
          name: 'password',
          label: 'Contraseña',
          type: 'password',
          placeholder: 'Ingresa la contraseña para el cliente',
          required: true
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
          key: 'usuario' as any, 
          label: 'Nombre',
          render: (_, item) => item.usuario?.nombre || '-',
          exportRender: (_, item) => item.usuario?.nombre || '-'
        },
        { 
          key: 'usuario' as any, 
          label: 'Apellido',
          render: (_, item) => item.usuario?.apellido || '-',
          exportRender: (_, item) => item.usuario?.apellido || '-'
        },
        { 
          key: 'usuario' as any, 
          label: 'Celular',
          render: (_, item) => item.usuario?.celular || '-',
          exportRender: (_, item) => item.usuario?.celular || '-'
        },
        { 
          key: 'numero_documento', 
          label: 'N° Documento',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        },
        { 
          key: 'tipo_documento' as any, 
          label: 'Tipo Documento',
          render: (_, item) => item.tipo_documento?.descripcion || '-',
          exportRender: (_, item) => item.tipo_documento?.descripcion || '-'
        },
        { 
          key: 'tipo_cliente' as any, 
          label: 'Tipo Cliente',
          render: (_, item) => item.tipo_cliente?.descripcion || '-',
          exportRender: (_, item) => item.tipo_cliente?.descripcion || '-'
        }
      ]}
      
      searchFields={['numero_documento', 'usuario'] as any}
      
      operations={{
        fetch: fetchClientes,
        create: createCliente,
        update: updateCliente,
        delete: deleteCliente
      }}
      
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        apellido: formValues.apellido || null,
        celular: formValues.celular || null,
        email: formValues.email,
        password: formValues.password || null,
        numero_documento: formValues.numero_documento || null,
        tipo_documento_id: formValues.tipo_documento_id ? Number(formValues.tipo_documento_id) : null,
        tipo_cliente_id: formValues.tipo_cliente_id ? Number(formValues.tipo_cliente_id) : null
      } as any)}
      
      getInitialFormData={(item) => ({
        nombre: item?.usuario?.nombre || '',
        apellido: item?.usuario?.apellido || '',
        celular: item?.usuario?.celular || '',
        email: '',
        password: '',
        numero_documento: item?.numero_documento || '',
        tipo_documento_id: item?.tipo_documento_id?.toString() || '',
        tipo_cliente_id: item?.tipo_cliente_id?.toString() || ''
      })}
    />
  );
};

export default ClientesAdmin;


