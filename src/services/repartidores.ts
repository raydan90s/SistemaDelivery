import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Repartidor = Database['public']['Tables']['repartidores']['Row'];
type RepartidorInsert = Database['public']['Tables']['repartidores']['Insert'];
type RepartidorUpdate = Database['public']['Tables']['repartidores']['Update'];

export async function fetchRepartidores(): Promise<Repartidor[]> {
  const { data, error } = await supabase
    .from('repartidores')
    .select(`
      *,
      tipovehiculo:tipo_vehiculo_id(id, descripcion),
      estados_generales:estado_id(id, descripcion)
    `)
    .order('nombre');

  if (error) {
    console.error('Error al obtener repartidores:', error);
    throw new Error(`Error al cargar repartidores: ${error.message}`);
  }

  return data || [];
}

export async function createRepartidor(repartidor: RepartidorInsert): Promise<Repartidor> {
  const { data, error } = await supabase
    .from('repartidores')
    .insert(repartidor)
    .select(`
      *,
      tipovehiculo:tipo_vehiculo_id(id, descripcion),
      estados_generales:estado_id(id, descripcion)
    `)
    .single();

  if (error) {
    console.error('Error al crear repartidor:', error);
    throw new Error(`Error al crear repartidor: ${error.message}`);
  }

  return data;
}

export async function updateRepartidor(id: number, repartidor: RepartidorUpdate): Promise<Repartidor> {
  const { data, error } = await supabase
    .from('repartidores')
    .update(repartidor)
    .eq('id', id)
    .select(`
      *,
      tipovehiculo:tipo_vehiculo_id(id, descripcion),
      estados_generales:estado_id(id, descripcion)
    `)
    .single();

  if (error) {
    console.error('Error al actualizar repartidor:', error);
    throw new Error(`Error al actualizar repartidor: ${error.message}`);
  }

  return data;
}

export async function deleteRepartidor(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('repartidores')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar repartidor:', error);
    throw new Error(`Error al eliminar repartidor: ${error.message}`);
  }

  return true;
}

export async function fetchRepartidorById(id: number): Promise<Repartidor | null> {
  const { data, error } = await supabase
    .from('repartidores')
    .select(`
      *,
      tipovehiculo:tipo_vehiculo_id(id, descripcion),
      estados_generales:estado_id(id, descripcion)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener repartidor:', error);
    return null;
  }

  return data;
}

export async function fetchRepartidoresActivos(): Promise<Repartidor[]> {
  const { data, error } = await supabase
    .from('repartidores')
    .select(`
      *,
      tipovehiculo:tipo_vehiculo_id(id, descripcion),
      estados_generales:estado_id(id, descripcion)
    `)
    .eq('estado_id', 1) // Assuming 1 is 'Active' status
    .order('nombre');

  if (error) {
    console.error('Error al obtener repartidores activos:', error);
    throw new Error(`Error al cargar repartidores activos: ${error.message}`);
  }

  return data || [];
}
