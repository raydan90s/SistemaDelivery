import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

export type Movimiento = Database['public']['Tables']['movimientos']['Row'];
export type MovimientoInsert = Database['public']['Tables']['movimientos']['Insert'];
export type MovimientoUpdate = Database['public']['Tables']['movimientos']['Update'];

export async function fetchMovimientos() {
  const { data, error } = await supabase
    .from('movimientos')
    .select(`
      id,
      fecha,
      cantidad,
      observaciones,
      bodegas: bodega_id (id, nombre, ubicacion),
      producto: producto_id (id, nombre),
      tipo: tipo_movimiento_id (id, descripcion),
      empleado: empleado_id (id, nombres, apellidos),
      estado: estado_id (id, descripcion)
    `)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMovimiento(payload: MovimientoInsert) {
  const { data, error } = await supabase.from('movimientos').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteMovimiento(id: number) {
  const { error } = await supabase.from('movimientos').delete().eq('id', id);
  if (error) throw error;
}