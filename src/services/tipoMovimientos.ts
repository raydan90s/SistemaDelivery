import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

export type TipoMovimiento = Database['public']['Tables']['tipomovimiento']['Row'];
export type TipoMovimientoInsert = Database['public']['Tables']['tipomovimiento']['Insert'];
export type TipoMovimientoUpdate = Database['public']['Tables']['tipomovimiento']['Update'];

export async function fetchTipoMovimientos() {
  const { data, error } = await supabase
    .from('tipomovimiento')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTipoMovimiento(payload: TipoMovimientoInsert) {
  const { data, error } = await supabase
    .from('tipomovimiento')
    .insert(payload)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTipoMovimiento(id: number, payload: TipoMovimientoUpdate) {
  const { data, error } = await supabase
    .from('tipomovimiento')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTipoMovimiento(id: number) {
  const { error } = await supabase
    .from('tipomovimiento')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}