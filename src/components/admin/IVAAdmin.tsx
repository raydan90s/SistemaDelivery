import React from 'react';
import type { IVAConEstado } from '@services/IVA';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchIVA,
  createIVA,
  updateIVA,
  deleteIVA
} from '@services/IVA';
import { fetchEstadosGenerales } from '@services/estadosGeneralesService';
import type { Database } from '@models/supabase';

type IVA = IVAConEstado;
type IVAInsert = Database['public']['Tables']['iva']['Insert'];
type IVAUpdate = Database['public']['Tables']['iva']['Update'];

const IVAAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<IVA, IVAInsert, IVAUpdate>
      title="IVA"
      description="Gestión de porcentajes de IVA del sistema"
      buttonLabel="Nuevo IVA"

      fields={[
        {
          name: 'porcentaje',
          label: 'Porcentaje (%)',
          type: 'number',
          placeholder: 'Ej: 12',
          required: true
        },
        {
          name: 'fecha_aplicacion',
          label: 'Fecha de Aplicación',
          type: 'text',
          placeholder: 'Selecciona una fecha',
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
            return estados.map((e) => ({
              value: e.id,
              label: e.descripcion
            }));
          }
        }
      ]}

      columns={[
        { key: 'id', label: 'ID' },
        { key: 'porcentaje', label: 'Porcentaje (%)' },
        { key: 'fecha_aplicacion', label: 'Fecha de Aplicación' },
        {
          key: 'estados_generales', // "alias" solo para render
          label: 'Estado',
          render: (_, row) => row.estados_generales?.descripcion || 'Sin estado',
          exportRender: (_, row) => row.estados_generales?.descripcion || 'Sin estado'
        }

      ]}

      searchFields={['porcentaje']}

      operations={{
        fetch: fetchIVA,
        create: createIVA,
        update: updateIVA,
        delete: deleteIVA
      }}

      getFormData={(formValues) => ({
        porcentaje: formValues.porcentaje ? Number(formValues.porcentaje) : 0,
        fecha_aplicacion: formValues.fecha_aplicacion,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}

      getInitialFormData={(item) => ({
        porcentaje: item?.porcentaje?.toString() || '',
        fecha_aplicacion: item?.fecha_aplicacion || '',
        estado_id: item?.estado_id?.toString() || ''
      })}
    />
  );
};

export default IVAAdmin;
