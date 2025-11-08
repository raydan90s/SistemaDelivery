import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchMetodoPago,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago,
  type MetodoPagoConEstado
} from '@services/metodosPago';
import { fetchEstadosGenerales } from '@services/estadosGenerales';
import type { Database } from '@models/supabase';

type MetodoPagoInsert = Database['public']['Tables']['metodopago']['Insert'];
type MetodoPagoUpdate = Database['public']['Tables']['metodopago']['Update'];

const MetodosPagoAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<MetodoPagoConEstado, MetodoPagoInsert, MetodoPagoUpdate>
      title="Métodos de pago"
      description="Gestiona los métodos de pago del sistema"
      buttonLabel="Nuevo método de pago"
      enableExport={true}
      exportFilename="metodos_de_pago"
      
      fields={[
        {
          name: 'descripcion',
          label: 'Nombre del Método de Pago',
          type: 'text',
          placeholder: 'Ej: Tarjeta de Crédito, Transferencia, Efectivo',
          required: true
        },
        {
          name: 'estado_id',
          label: 'Estado',
          type: 'select',
          placeholder: 'Selecciona un estado',
          required: true,
          fetchOptions: async () => {
            const estados = await fetchEstadosGenerales();
            return estados.map(p => ({
              value: p.id,
              label: p.descripcion
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
          key: 'descripcion', 
          label: 'Metodo de Pago',
          exportRender: (value) => value
        },
        { 
          key: 'estados_generales', 
          label: 'Estado',
          render: (value) => (value as { descripcion: string })?.descripcion || 'Sin estado',
          exportRender: (value) => (value as { descripcion: string })?.descripcion || 'Sin estado'
        }
      ]}
      
      searchFields={['descripcion']}
      
      operations={{
        fetch: fetchMetodoPago,
        create: createMetodoPago,
        update: updateMetodoPago,
        delete: deleteMetodoPago
      }}
      
      getFormData={(formValues) => ({
        descripcion: formValues.descripcion,
        estado_id: formValues.estado_id ? Number(formValues.provincia_id) : null
      })}
      
      getInitialFormData={(item) => ({
        descripcion: item?.descripcion || '',
        estado_id: item?.estado_id?.toString() || ''
      })}
    />
  );
};

export default MetodosPagoAdmin;