import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type PromocionProducto = Database['public']['Tables']['promocionesproductos']['Row'];
type PromocionProductoInsert = Database['public']['Tables']['promocionesproductos']['Insert'];

export async function fetchProductosPorPromocion(promocionId: number) {
  const { data, error } = await supabase
    .from('promocionesproductos')
    .select(`
      *,
      producto:productos(id, nombre, precio_base, imagen_url)
    `)
    .eq('promocion_id', promocionId);

  if (error) {
    console.error('Error al obtener productos de la promoción:', error);
    throw error;
  }
  return data as any[];
}

export async function addProductoToPromocion(promocionProducto: PromocionProductoInsert) {
  const { data, error } = await supabase
    .from('promocionesproductos')
    .insert([promocionProducto])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar producto a la promoción:', error);
    throw error;
  }
  return data as PromocionProducto;
}

export async function removeProductoFromPromocion(id: number) {
  const { error } = await supabase
    .from('promocionesproductos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar producto de la promoción:', error);
    throw error;
  }
  return true;
}

export async function updateProductoEnPromocion(id: number, cantidad: number) {
  const { data, error } = await supabase
    .from('promocionesproductos')
    .update({ cantidad })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar cantidad:', error);
    throw error;
  }
  return data as PromocionProducto;
}

export async function clearProductosDePromocion(promocionId: number) {
  const { error } = await supabase
    .from('promocionesproductos')
    .delete()
    .eq('promocion_id', promocionId);

  if (error) {
    console.error('Error al limpiar productos de la promoción:', error);
    throw error;
  }
  return true;
}
