import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type UnidadMedida = Database['public']['Tables']['unidadmedida']['Row'];
type UnidadMedidaInsert = Database['public']['Tables']['unidadmedida']['Insert'];
type UnidadMedidaUpdate = Database['public']['Tables']['unidadmedida']['Update'];

export async function fetchUnidadesMedida() {
  const { data, error } = await supabase
    .from('unidadmedida')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener unidades de medida:', error);
    throw error;
  }
  return data as UnidadMedida[];
}

export async function fetchUnidadMedidaById(id: number) {
  const { data, error } = await supabase
    .from('unidadmedida')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener unidad de medida:', error);
    throw error;
  }
  return data as UnidadMedida;
}

export async function createUnidadMedida(unidadMedida: UnidadMedidaInsert) {
  const { data, error } = await supabase
    .from('unidadmedida')
    .insert([unidadMedida])
    .select()
    .single();

  if (error) {
    console.error('Error al crear unidad de medida:', error);
    throw error;
  }
  return data as UnidadMedida;
}

export async function updateUnidadMedida(id: number, unidadMedida: UnidadMedidaUpdate) {
  const { data, error } = await supabase
    .from('unidadmedida')
    .update(unidadMedida)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar unidad de medida:', error);
    throw error;
  }
  return data as UnidadMedida;
}

export async function deleteUnidadMedida(id: number) {
  const { error } = await supabase
    .from('unidadmedida')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar unidad de medida:', error);
    throw error;
  }
  return true;
}