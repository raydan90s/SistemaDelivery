import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type CategoriaProducto = Database['public']['Tables']['categoriasproducto']['Row'];
type CategoriaProductoInsert = Database['public']['Tables']['categoriasproducto']['Insert'];
type CategoriaProductoUpdate = Database['public']['Tables']['categoriasproducto']['Update'];

export async function fetchCategoriasProducto() {
  const { data, error } = await supabase
    .from('categoriasproducto')
    .select(`
      *,
      estado:estados_generales(id, descripcion)
    `)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener categorías de producto:', error);
    throw error;
  }
  return data as any[];
}

export async function fetchCategoriaProductoById(id: number) {
  const { data, error } = await supabase
    .from('categoriasproducto')
    .select(`
      *,
      estado:estados_generales(id, descripcion)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener categoría de producto:', error);
    throw error;
  }
  return data;
}

export async function createCategoriaProducto(categoria: CategoriaProductoInsert) {
  const { data, error } = await supabase
    .from('categoriasproducto')
    .insert([categoria])
    .select()
    .single();

  if (error) {
    console.error('Error al crear categoría de producto:', error);
    throw error;
  }
  return data as CategoriaProducto;
}

export async function updateCategoriaProducto(id: number, categoria: CategoriaProductoUpdate) {
  const { data, error } = await supabase
    .from('categoriasproducto')
    .update(categoria)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar categoría de producto:', error);
    throw error;
  }
  return data as CategoriaProducto;
}

export async function deleteCategoriaProducto(id: number) {
  const { error } = await supabase
    .from('categoriasproducto')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar categoría de producto:', error);
    throw error;
  }
  return true;
}

// Helper para obtener opciones de select
export async function fetchCategoriasProductoOptions() {
  const categorias = await fetchCategoriasProducto();
  return categorias.map(cat => ({
    value: cat.id,
    label: cat.nombre
  }));
}
