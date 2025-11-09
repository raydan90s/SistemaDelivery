import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchCategoriasProducto,
  createCategoriaProducto,
  updateCategoriaProducto,
  deleteCategoriaProducto
} from '@services/categoriasProducto';
import { fetchEstadosGenerales } from '@services/estadosGenerales';
import type { Database } from '@models/supabase';

type CategoriaProducto = Database['public']['Tables']['categoriasproducto']['Row'];
type CategoriaProductoInsert = Database['public']['Tables']['categoriasproducto']['Insert'];
type CategoriaProductoUpdate = Database['public']['Tables']['categoriasproducto']['Update'];

const CategoriasProductoAdmin: React.FC = () => {
  const fetchEstadosOptions = async () => {
    const estados = await fetchEstadosGenerales();
    return estados.map(e => ({
      value: e.id,
      label: e.descripcion
    }));
  };

  return (
    <SimpleTableAdmin<any, CategoriaProductoInsert, CategoriaProductoUpdate>
      title="Categorías de Producto"
      description="Gestiona las categorías de productos disponibles (Bebidas, Platos fuertes, Entradas, Postres, etc.)"
      buttonLabel="Nueva Categoría"

      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ej: Bebidas, Platos Fuertes, Postres',
          required: true
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Descripción de la categoría',
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
        { key: 'nombre', label: 'Nombre' },
        {
          key: 'descripcion',
          label: 'Descripción',
          render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
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
        fetch: fetchCategoriasProducto,
        create: createCategoriaProducto,
        update: updateCategoriaProducto,
        delete: deleteCategoriaProducto
      }}

      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        descripcion: formValues.descripcion || null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}

      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        descripcion: item?.descripcion || '',
        estado_id: item?.estado_id || ''
      })}

      enableExport={true}
      exportFilename="categorias_producto"
    />
  );
};

export default CategoriasProductoAdmin;
