import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Provincia = Database['public']['Tables']['provincias']['Row'];
type ProvinciaInsert = Database['public']['Tables']['provincias']['Insert'];
type ProvinciaUpdate = Database['public']['Tables']['provincias']['Update'];

export async function fetchProvincias() {
  const { data, error } = await supabase
    .from('provincias')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener provincias:', error);
    throw error;
  }
  return data as Provincia[];
}

export async function fetchProvinciaById(id: number) {
  const { data, error } = await supabase
    .from('provincias')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener provincia:', error);
    throw error;
  }
  return data as Provincia;
}

export async function createProvincia(provincia: ProvinciaInsert) {
  const { data, error } = await supabase
    .from('provincias')
    .insert([provincia])
    .select()
    .single();

  if (error) {
    console.error('Error al crear provincia:', error);
    throw error;
  }
  return data as Provincia;
}

export async function updateProvincia(id: number, provincia: ProvinciaUpdate) {
  const { data, error } = await supabase
    .from('provincias')
    .update(provincia)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar provincia:', error);
    throw error;
  }
  return data as Provincia;
}

export async function deleteProvincia(id: number) {
  const { error } = await supabase
    .from('provincias')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar provincia:', error);
    throw error;
  }
  return true;
}