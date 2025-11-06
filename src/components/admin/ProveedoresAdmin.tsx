import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from '@services/proveedores';

import type { ProveedorConRelaciones } from '@services/proveedores';
import { fetchProvincias } from '@services/provincia';
import { fetchEstadosGenerales } from '@services/estadosGeneralesService';
import type { Database } from '@models/supabase';

type Proveedor = ProveedorConRelaciones; // Extendido con relaciones
type ProveedorInsert = Database['public']['Tables']['proveedores']['Insert'];
type ProveedorUpdate = Database['public']['Tables']['proveedores']['Update'];

const ProveedoresAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Proveedor, ProveedorInsert, ProveedorUpdate>
      title="Proveedores"
      description="Gestiona los proveedores registrados en el sistema"
      buttonLabel="Nuevo Proveedor"
      
      fields={[
        { name: 'nombre', label: 'Nombre del Proveedor', type: 'text', placeholder: 'Ej: Distribuidora Los Andes', required: true },
        { name: 'contacto', label: 'Persona de Contacto', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
        { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ej: 0999999999', required: false },
        { name: 'correo', label: 'Correo electrónico', type: 'text', placeholder: 'Ej: contacto@proveedor.com', required: false },
        { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ej: Av. América y Colón', required: false },
        {
          name: 'provincia_id',
          label: 'Provincia',
          type: 'select',
          placeholder: 'Selecciona una provincia',
          required: true,
          fetchOptions: async () => {
            const provincias = await fetchProvincias();
            return provincias.map(p => ({ value: p.id, label: p.nombre }));
          }
        },
        {
          name: 'estado_id',
          label: 'Estado',
          type: 'select',
          placeholder: 'Selecciona un estado',
          required: true,
          fetchOptions: async () => {
            const estados = await fetchEstadosGenerales();
            return estados.map(e => ({ value: e.id, label: e.descripcion }));
          }
        }
      ]}

      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Proveedor' },
        { key: 'contacto', label: 'Contacto' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'correo', label: 'Correo' },
        { key: 'direccion', label: 'Dirección' },
        { 
          key: 'provincias', // "alias" para render
          label: 'Provincia',
          render: (_, row) => row.provincias?.nombre || 'Sin provincia',
          exportRender: (_, row) => row.provincias?.nombre || 'Sin provincia'
        },
        { 
          key: 'estados_generales', // "alias" para render
          label: 'Estado',
          render: (_, row) => row.estados_generales?.descripcion || 'Sin estado',
          exportRender: (_, row) => row.estados_generales?.descripcion || 'Sin estado'
        }
      ]}

      searchFields={['nombre', 'correo', 'contacto']}

      operations={{
        fetch: fetchProveedores,
        create: createProveedor,
        update: updateProveedor,
        delete: deleteProveedor
      }}

      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        contacto: formValues.contacto,
        telefono: formValues.telefono,
        correo: formValues.correo,
        direccion: formValues.direccion,
        provincia_id: formValues.provincia_id ? Number(formValues.provincia_id) : null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}

      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        contacto: item?.contacto || '',
        telefono: item?.telefono || '',
        correo: item?.correo || '',
        direccion: item?.direccion || '',
        provincia_id: item?.provincia_id?.toString() || '',
        estado_id: item?.estado_id?.toString() || ''
      })}
    />
  );
};

export default ProveedoresAdmin;
