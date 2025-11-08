import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Producto = Database['public']['Tables']['productos']['Row'];
type ProductoInsert = Database['public']['Tables']['productos']['Insert'];
type ProductoUpdate = Database['public']['Tables']['productos']['Update'];

// IDs de estados (ajustar según tu base de datos)
const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2;

export async function fetchProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria:categoriasproducto(id, nombre),
      unidad_medida:unidadmedida(id, descripcion),
      estado:estados_generales(id, descripcion)
    `)
    .eq('estado_id', ESTADO_ACTIVO)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
  return data as any[];
}

export async function fetchProductoById(id: number) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria:categoriasproducto(id, nombre),
      unidad_medida:unidadmedida(id, descripcion),
      estado:estados_generales(id, descripcion)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
  return data;
}

export async function createProducto(producto: ProductoInsert) {
  const { data, error } = await supabase
    .from('productos')
    .insert([producto])
    .select()
    .single();

  if (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
  return data as Producto;
}

export async function updateProducto(id: number, producto: ProductoUpdate) {
  const { data, error } = await supabase
    .from('productos')
    .update(producto)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
  return data as Producto;
}

export async function deleteProducto(id: number) {
  // Soft delete: cambiar estado a inactivo
  const { error: updateError } = await supabase
    .from('productos')
    .update({ estado_id: ESTADO_INACTIVO })
    .eq('id', id);

  if (updateError) {
    console.error('Error al inactivar producto:', updateError);
    throw updateError;
  }

  // Inactivar todas las promociones que contienen este producto
  const { data: promocionesProductos, error: fetchError } = await supabase
    .from('promocionesproductos')
    .select('promocion_id')
    .eq('producto_id', id);

  if (fetchError) {
    console.error('Error al buscar promociones del producto:', fetchError);
    throw fetchError;
  }

  if (promocionesProductos && promocionesProductos.length > 0) {
    const promocionIds = promocionesProductos
      .map(pp => pp.promocion_id)
      .filter((id): id is number => id !== null);

    if (promocionIds.length > 0) {
      const { error: promoError } = await supabase
        .from('promociones')
        .update({ estado_id: ESTADO_INACTIVO })
        .in('id', promocionIds);

      if (promoError) {
        console.error('Error al inactivar promociones:', promoError);
        throw promoError;
      }
    }
  }

  return true;
}

// Obtener productos por categoría
export async function fetchProductosPorCategoria(categoriaId: number) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria:categoriasproducto(id, nombre),
      unidad_medida:unidadmedida(id, descripcion),
      estado:estados_generales(id, descripcion)
    `)
    .eq('estado_id', ESTADO_ACTIVO)
    .eq('categoria_id', categoriaId)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener productos por categoría:', error);
    throw error;
  }
  return data as any[];
}

// Buscar productos por nombre o descripción
export async function searchProductos(searchTerm: string) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria:categoriasproducto(id, nombre),
      unidad_medida:unidadmedida(id, descripcion),
      estado:estados_generales(id, descripcion)
    `)
    .eq('estado_id', ESTADO_ACTIVO)
    .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
  return data as any[];
}

// Obtener productos destacados (los primeros 8 productos activos)
export async function fetchProductosDestacados() {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria:categoriasproducto(id, nombre),
      unidad_medida:unidadmedida(id, descripcion),
      estado:estados_generales(id, descripcion)
    `)
    .eq('estado_id', ESTADO_ACTIVO)
    .order('id', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error al obtener productos destacados:', error);
    throw error;
  }
  return data as any[];
}
