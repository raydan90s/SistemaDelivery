import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchPromociones,
  createPromocion,
  updatePromocion,
  deletePromocion
} from '@services/promociones';
import { fetchEstadosGenerales } from '@services/estadosGeneralesService';
import type { Database } from '@models/supabase';

type Promocion = Database['public']['Tables']['promociones']['Row'];
type PromocionInsert = Database['public']['Tables']['promociones']['Insert'];
type PromocionUpdate = Database['public']['Tables']['promociones']['Update'];

const PromocionesAdmin: React.FC = () => {
  const fetchEstadosOptions = async () => {
    const estados = await fetchEstadosGenerales();
    return estados.map(e => ({
      value: e.id,
      label: e.descripcion
    }));
  };

  return (
    <SimpleTableAdmin<any, PromocionInsert, PromocionUpdate>
      title="Promociones"
      description="Gestiona las promociones y combos con descuentos o productos agrupados"
      buttonLabel="Nueva Promoción"

      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ej: Combo Familiar, Promo 2x1',
          required: true
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Descripción de la promoción',
          required: false
        },
        {
          name: 'imagen_url',
          label: 'URL de Imagen',
          type: 'text',
          placeholder: 'https://ejemplo.com/promo.jpg',
          required: false
        },
        {
          name: 'descuento',
          label: 'Descuento (%)',
          type: 'number',
          placeholder: '0',
          required: false
        },
        {
          name: 'fecha_inicio',
          label: 'Fecha Inicio',
          type: 'text',
          placeholder: 'YYYY-MM-DD',
          required: false
        },
        {
          name: 'fecha_fin',
          label: 'Fecha Fin',
          type: 'text',
          placeholder: 'YYYY-MM-DD',
          required: false
        },
        {
          name: 'estado_id',
          label: 'Estado',
          type: 'select',
          placeholder: 'Selecciona un estado',
          required: false,
          fetchOptions: fetchEstadosOptions
        }
      ]}

      columns={[
        { key: 'id', label: 'ID' },
        {
          key: 'imagen_url',
          label: 'Imagen',
          render: (value) => value ? (
            <img src={value} alt="Promoción" className="w-16 h-16 object-cover rounded-lg" />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              Sin imagen
            </div>
          ),
          excludeFromExport: true
        },
        { key: 'nombre', label: 'Nombre' },
        {
          key: 'descripcion',
          label: 'Descripción',
          render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
        },
        {
          key: 'descuento',
          label: 'Descuento',
          render: (value) => value ? `${Number(value)}%` : '-'
        },
        {
          key: 'fecha_inicio',
          label: 'Inicio',
          render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
          key: 'fecha_fin',
          label: 'Fin',
          render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
          key: 'estado',
          label: 'Estado',
          render: (value) => value?.descripcion ?? '-',
          exportRender: (value) => value?.descripcion ?? '-'
        }
      ]}

      searchFields={['nombre', 'descripcion']}

      operations={{
        fetch: fetchPromociones,
        create: createPromocion,
        update: updatePromocion,
        delete: deletePromocion
      }}

      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        descripcion: formValues.descripcion || null,
        imagen_url: formValues.imagen_url || null,
        descuento: formValues.descuento ? Number(formValues.descuento) : null,
        fecha_inicio: formValues.fecha_inicio || null,
        fecha_fin: formValues.fecha_fin || null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}

      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        descripcion: item?.descripcion || '',
        imagen_url: item?.imagen_url || '',
        descuento: item?.descuento || '',
        fecha_inicio: item?.fecha_inicio || '',
        fecha_fin: item?.fecha_fin || '',
        estado_id: item?.estado_id || ''
      })}

      enableExport={true}
      exportFilename="promociones"
    />
  );
};

export default PromocionesAdmin;
