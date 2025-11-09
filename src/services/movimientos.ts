import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

export type Movimiento = Database['public']['Tables']['movimientos']['Row'];
export type MovimientoInsert = Database['public']['Tables']['movimientos']['Insert'];
export type MovimientoUpdate = Database['public']['Tables']['movimientos']['Update'];

export type MovimientoConRelaciones = Movimiento & {
  bodega?: { id: number; nombre: string; ubicacion: string | null } | null;
  producto?: { id: number; nombre: string } | null;
  tipo_movimiento?: { id: number; descripcion: string } | null;
  empleado?: { id: number; nombres?: string; apellidos?: string } | null;
  estado?: { id: number; descripcion: string } | null;
};

export async function fetchMovimientos(): Promise<MovimientoConRelaciones[]> {
  const { data, error } = await supabase
    .from('movimientos')
    .select(`
      *,
      bodega:bodega_id (id, nombre, ubicacion),
      producto:producto_id (id, nombre),
      tipo_movimiento:tipo_movimiento_id (id, descripcion),
      empleado:empleado_id (id),
      estado:estado_id (id, descripcion)
    `)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data as MovimientoConRelaciones[];
}

export async function createMovimiento(payload: MovimientoInsert) {
  const { data, error } = await supabase
    .from('movimientos')
    .insert(payload)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateMovimiento(id: number, payload: MovimientoUpdate) {
  const { data, error } = await supabase
    .from('movimientos')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteMovimiento(id: number) {
  const { error } = await supabase
    .from('movimientos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function fetchMovimientosByTipo(tipoMovimientoId: number): Promise<MovimientoConRelaciones[]> {
  const { data, error } = await supabase
    .from('movimientos')
    .select(`
      *,
      bodega:bodega_id (id, nombre, ubicacion),
      producto:producto_id (id, nombre),
      tipo_movimiento:tipo_movimiento_id (id, descripcion),
      empleado:empleado_id (id),
      estado:estado_id (id, descripcion)
    `)
    .eq('tipo_movimiento_id', tipoMovimientoId)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data as MovimientoConRelaciones[];
}