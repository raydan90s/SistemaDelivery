import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type TipoDocumento = Database['public']['Tables']['tipodocumento']['Row'];
type TipoDocumentoInsert = Database['public']['Tables']['tipodocumento']['Insert'];
type TipoDocumentoUpdate = Database['public']['Tables']['tipodocumento']['Update'];

export async function fetchTipoDocumentos() {
  const { data, error } = await supabase
    .from('tipodocumento')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener tipos de documento:', error);
    throw error;
  }
  return data as TipoDocumento[];
}

export async function fetchTipoDocumentoById(id: number) {
  const { data, error } = await supabase
    .from('tipodocumento')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener tipo de documento:', error);
    throw error;
  }
  return data as TipoDocumento;
}

export async function createTipoDocumento(tipoDocumento: TipoDocumentoInsert) {
  const { data, error } = await supabase
    .from('tipodocumento')
    .insert([tipoDocumento])
    .select()
    .single();

  if (error) {
    console.error('Error al crear tipo de documento:', error);
    throw error;
  }
  return data as TipoDocumento;
}

export async function updateTipoDocumento(id: number, tipoDocumento: TipoDocumentoUpdate) {
  const { data, error } = await supabase
    .from('tipodocumento')
    .update(tipoDocumento)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar tipo de documento:', error);
    throw error;
  }
  return data as TipoDocumento;
}

export async function deleteTipoDocumento(id: number) {
  const { error } = await supabase
    .from('tipodocumento')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar tipo de documento:', error);
    throw error;
  }
  return true;
}