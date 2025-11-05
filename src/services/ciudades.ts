import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Ciudad = Database['public']['Tables']['ciudades']['Row'];
type CiudadInsert = Database['public']['Tables']['ciudades']['Insert'];
type CiudadUpdate = Database['public']['Tables']['ciudades']['Update'];

export type CiudadConProvincia = Ciudad & {
  provincias?: {
    nombre: string;
  };
};

export async function fetchCiudades() {
  const { data, error } = await supabase
    .from('ciudades')
    .select(`
      *,
      provincias (
        nombre
      )
    `)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener ciudades:', error);
    throw error;
  }
  return data as CiudadConProvincia[];
}

export async function fetchCiudadById(id: number) {
  const { data, error } = await supabase
    .from('ciudades')
    .select(`
      *,
      provincias (
        nombre
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener ciudad:', error);
    throw error;
  }
  return data as CiudadConProvincia;
}

export async function createCiudad(ciudad: CiudadInsert) {
  const { data, error } = await supabase
    .from('ciudades')
    .insert([ciudad])
    .select(`
      *,
      provincias (
        nombre
      )
    `)
    .single();

  if (error) {
    console.error('Error al crear ciudad:', error);
    throw error;
  }
  return data as CiudadConProvincia;
}

export async function updateCiudad(id: number, ciudad: CiudadUpdate) {
  const { data, error } = await supabase
    .from('ciudades')
    .update(ciudad)
    .eq('id', id)
    .select(`
      *,
      provincias (
        nombre
      )
    `)
    .single();

  if (error) {
    console.error('Error al actualizar ciudad:', error);
    throw error;
  }
  return data as CiudadConProvincia;
}

export async function deleteCiudad(id: number) {
  const { error } = await supabase
    .from('ciudades')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar ciudad:', error);
    throw error;
  }
  return true;
}

export async function fetchCiudadesByProvincia(provinciaId: number) {
  const { data, error } = await supabase
    .from('ciudades')
    .select('*')
    .eq('provincia_id', provinciaId)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener ciudades por provincia:', error);
    throw error;
  }
  return data as Ciudad[];
}