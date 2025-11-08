import React from 'react';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import {
  fetchProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '@services/productos';
import { fetchCategoriasProductoOptions } from '@services/categoriasProducto';
import { fetchUnidadesMedida } from '@services/unidadMedida';
import { fetchEstadosGenerales } from '@services/estadosGeneralesService';
import type { Database } from '@models/supabase';

type Producto = Database['public']['Tables']['productos']['Row'];
type ProductoInsert = Database['public']['Tables']['productos']['Insert'];
type ProductoUpdate = Database['public']['Tables']['productos']['Update'];

const ProductosAdmin: React.FC = () => {
  const fetchUnidadesMedidaOptions = async () => {
    const unidades = await fetchUnidadesMedida();
    return unidades.map(u => ({
      value: u.id,
      label: u.descripcion
    }));
  };

  const fetchEstadosOptions = async () => {
    const estados = await fetchEstadosGenerales();
    return estados.map(e => ({
      value: e.id,
      label: e.descripcion
    }));
  };

  return (
    <SimpleTableAdmin<any, ProductoInsert, ProductoUpdate>
      title="Productos"
      description="Gestiona los productos disponibles en el sistema (nombre, descripción, precio base, stock mínimo, etc.)"
      buttonLabel="Nuevo Producto"

      fields={[
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ej: Pizza Margherita',
          required: true
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Descripción del producto',
          required: false
        },
        {
          name: 'imagen_url',
          label: 'URL de Imagen',
          type: 'text',
          placeholder: 'https://ejemplo.com/imagen.jpg',
          required: false
        },
        {
          name: 'precio_base',
          label: 'Precio Base',
          type: 'number',
          placeholder: '0.00',
          required: true
        },
        {
          name: 'stock_minimo',
          label: 'Stock Mínimo',
          type: 'number',
          placeholder: '0',
          required: false
        },
        {
          name: 'categoria_id',
          label: 'Categoría',
          type: 'select',
          placeholder: 'Selecciona una categoría',
          required: false,
          fetchOptions: fetchCategoriasProductoOptions
        },
        {
          name: 'unidad_medida_id',
          label: 'Unidad de Medida',
          type: 'select',
          placeholder: 'Selecciona una unidad',
          required: false,
          fetchOptions: fetchUnidadesMedidaOptions
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
            <img src={value} alt="Producto" className="w-16 h-16 object-cover rounded-lg" />
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
          key: 'precio_base',
          label: 'Precio Base',
          render: (value) => `$${Number(value).toFixed(2)}`
        },
        {
          key: 'stock_minimo',
          label: 'Stock Mínimo',
          render: (value) => value ?? '-'
        },
        {
          key: 'categoria',
          label: 'Categoría',
          render: (value) => value?.nombre ?? '-',
          exportRender: (value) => value?.nombre ?? '-'
        },
        {
          key: 'unidad_medida',
          label: 'Unidad',
          render: (value) => value?.descripcion ?? '-',
          exportRender: (value) => value?.descripcion ?? '-'
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
        fetch: fetchProductos,
        create: createProducto,
        update: updateProducto,
        delete: deleteProducto
      }}

      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        descripcion: formValues.descripcion || null,
        imagen_url: formValues.imagen_url || null,
        precio_base: Number(formValues.precio_base),
        stock_minimo: formValues.stock_minimo ? Number(formValues.stock_minimo) : null,
        categoria_id: formValues.categoria_id ? Number(formValues.categoria_id) : null,
        unidad_medida_id: formValues.unidad_medida_id ? Number(formValues.unidad_medida_id) : null,
        estado_id: formValues.estado_id ? Number(formValues.estado_id) : null
      })}

      getInitialFormData={(item) => ({
        nombre: item?.nombre || '',
        descripcion: item?.descripcion || '',
        imagen_url: item?.imagen_url || '',
        precio_base: item?.precio_base || '',
        stock_minimo: item?.stock_minimo || '',
        categoria_id: item?.categoria_id || '',
        unidad_medida_id: item?.unidad_medida_id || '',
        estado_id: item?.estado_id || ''
      })}

      enableExport={true}
      exportFilename="productos"
    />
  );
};

export default ProductosAdmin;
