import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  type MovimientoConRelaciones
} from '@services/movimientos';
import { fetchBodegas } from '@services/bodegas';
import { fetchTipoMovimientos } from '@services/tipoMovimientos';
import { fetchProductos } from '@services/productos';
import type { Database } from '@models/supabase';

type MovimientoInsert = Database['public']['Tables']['movimientos']['Insert'];
type MovimientoUpdate = Database['public']['Tables']['movimientos']['Update'];

const MovimientosAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<MovimientoConRelaciones, MovimientoInsert, MovimientoUpdate>
      title="Movimientos"
      description="Gestiona los movimientos de inventario del sistema"
      buttonLabel="Registrar Movimiento"
      enableExport={true}
      exportFilename="movimientos"
      
      fields={[
        {
          name: 'bodega_id',
          label: 'Bodega',
          type: 'select',
          placeholder: 'Selecciona una bodega',
          required: true,
          fetchOptions: async () => {
            const bodegas = await fetchBodegas();
            return bodegas.map(b => ({
              value: b.id,
              label: b.nombre
            }));
          }
        },
        {
          name: 'tipo_movimiento_id',
          label: 'Tipo de Movimiento',
          type: 'select',
          placeholder: 'Selecciona un tipo',
          required: true,
          fetchOptions: async () => {
            const tipos = await fetchTipoMovimientos();
            return tipos.map(t => ({
              value: t.id,
              label: t.descripcion // Cambiado de 'nombre' a 'descripcion'
            }));
          }
        },
        {
          name: 'producto_id',
          label: 'Producto',
          type: 'select',
          placeholder: 'Selecciona un producto',
          required: true,
          fetchOptions: async () => {
            const productos = await fetchProductos();
            return productos.map(p => ({
              value: p.id,
              label: p.nombre
            }));
          }
        },
        {
          name: 'cantidad',
          label: 'Cantidad',
          type: 'number',
          placeholder: 'Ej: 10',
          required: true
        },
        {
          name: 'fecha',
          label: 'Fecha',
          type: 'text', // Cambiado de 'datetime-local' a 'text'
          placeholder: 'YYYY-MM-DD HH:MM',
          required: true
        },
        {
          name: 'observaciones',
          label: 'Observaciones',
          type: 'textarea',
          placeholder: 'Observaciones adicionales (opcional)',
          required: false
        }
      ]}
      
      columns={[
        { 
          key: 'id', 
          label: 'ID',
          exportRender: (value) => value
        },
        { 
          key: 'bodega' as any, 
          label: 'Bodega',
          render: (_, item) => item.bodega?.nombre || '-',
          exportRender: (_, item) => item.bodega?.nombre || '-'
        },
        { 
          key: 'tipo_movimiento' as any, 
          label: 'Tipo',
          render: (_, item) => item.tipo_movimiento?.descripcion || '-', // Cambiado de 'nombre' a 'descripcion'
          exportRender: (_, item) => item.tipo_movimiento?.descripcion || '-' // Cambiado de 'nombre' a 'descripcion'
        },
        { 
          key: 'producto' as any, 
          label: 'Producto',
          render: (_, item) => item.producto?.nombre || '-',
          exportRender: (_, item) => item.producto?.nombre || '-'
        },
        { 
          key: 'cantidad', 
          label: 'Cantidad',
          render: (value) => value || 0,
          exportRender: (value) => value || 0
        },
        { 
          key: 'fecha', 
          label: 'Fecha',
          render: (value) => value ? new Date(value).toLocaleString('es-EC', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) : '-',
          exportRender: (value) => value ? new Date(value).toLocaleString('es-EC') : '-'
        },
        { 
          key: 'observaciones', 
          label: 'Observaciones',
          render: (value) => value || '-',
          exportRender: (value) => value || '-'
        }
      ]}
      
      searchFields={['observaciones', 'producto', 'bodega'] as any}
      
      operations={{
        fetch: fetchMovimientos,
        create: createMovimiento,
        update: updateMovimiento,
        delete: async (id: number) => {
          await deleteMovimiento(id);
          return true;
        }
      }}
      
      getFormData={(formValues) => ({
        bodega_id: formValues.bodega_id ? Number(formValues.bodega_id) : null,
        tipo_movimiento_id: formValues.tipo_movimiento_id ? Number(formValues.tipo_movimiento_id) : null,
        producto_id: formValues.producto_id ? Number(formValues.producto_id) : null,
        cantidad: formValues.cantidad ? Number(formValues.cantidad) : 0, // Cambiado de null a 0
        fecha: formValues.fecha || new Date().toISOString(),
        observaciones: formValues.observaciones || null
      })}
      
      getInitialFormData={(item) => {
        const now = new Date();
        const localDateTime = now.toISOString().slice(0, 16).replace('T', ' ');
        
        return {
          bodega_id: item?.bodega_id?.toString() || '',
          tipo_movimiento_id: item?.tipo_movimiento_id?.toString() || '',
          producto_id: item?.producto_id?.toString() || '',
          cantidad: item?.cantidad?.toString() || '',
          fecha: item?.fecha ? new Date(item.fecha).toISOString().slice(0, 16).replace('T', ' ') : localDateTime,
          observaciones: item?.observaciones || ''
        };
      }}
    />
  );
};

export default MovimientosAdmin;