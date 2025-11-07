import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

export type Producto = Database['public']['Tables']['productos']['Row'];
export type ProductoInsert = Database['public']['Tables']['productos']['Insert'];
export type ProductoUpdate = Database['public']['Tables']['productos']['Update'];

export async function fetchProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      unidadmedida ( nombre ),
      estados_generales ( nombre )
    `)
    .order('nombre', { ascending: true });

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
      unidadmedida ( nombre ),
      estados_generales ( nombre )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
  return data as any;
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
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
  return true;
}
