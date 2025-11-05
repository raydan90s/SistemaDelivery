import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type EstadoGeneral = Database['public']['Tables']['estados_generales']['Row'];
type EstadoGeneralInsert = Database['public']['Tables']['estados_generales']['Insert'];
type EstadoGeneralUpdate = Database['public']['Tables']['estados_generales']['Update'];

export async function fetchEstadosGenerales() {
  const { data, error } = await supabase
    .from('estados_generales')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener estados generales:', error);
    throw error;
  }
  return data as EstadoGeneral[];
}

export async function fetchEstadoGeneralById(id: number) {
  const { data, error } = await supabase
    .from('estados_generales')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener estado general:', error);
    throw error;
  }
  return data as EstadoGeneral;
}

export async function createEstadoGeneral(estado: EstadoGeneralInsert) {
  const { data, error } = await supabase
    .from('estados_generales')
    .insert([estado])
    .select()
    .single();

  if (error) {
    console.error('Error al crear estado general:', error);
    throw error;
  }
  return data as EstadoGeneral;
}

export async function updateEstadoGeneral(id: number, estado: EstadoGeneralUpdate) {
  const { data, error } = await supabase
    .from('estados_generales')
    .update(estado)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar estado general:', error);
    throw error;
  }
  return data as EstadoGeneral;
}

export async function deleteEstadoGeneral(id: number) {
  const { error } = await supabase
    .from('estados_generales')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar estado general:', error);
    throw error;
  }
  return true;
}