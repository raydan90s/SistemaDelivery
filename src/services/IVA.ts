// @services/iva.ts
import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';


type IVA = Database['public']['Tables']['iva']['Row'];
type IVAInsert = Database['public']['Tables']['iva']['Insert'];
type IVAUpdate = Database['public']['Tables']['iva']['Update'];

export type IVAConEstado = Database['public']['Tables']['iva']['Row'] & {
  estados_generales?: { id: number; descripcion: string } | null;
};

export async function fetchIVA(): Promise<IVAConEstado[]> {
  const { data, error } = await supabase
    .from('iva')
    .select(`
      id,
      porcentaje,
      fecha_aplicacion,
      estado_id,
      estados_generales (id, descripcion)
    `)
    .order('id', { ascending: true });

  if (error) throw error;
  return data as IVAConEstado[];
}

export async function createIVA(item: IVAInsert) {
  const { data, error } = await supabase
    .from('iva')
    .insert([item])
    .select(`
      *,
      estados_generales:estado_id ( descripcion )
    `)
    .single();

  if (error) {
    console.error('Error al crear IVA:', error);
    throw error;
  }
  return data as IVAConEstado;
}

export async function updateIVA(id: number, item: IVAUpdate) {
  const { data, error } = await supabase
    .from('iva')
    .update(item)
    .eq('id', id)
    .select(`
      *,
      estados_generales:estado_id ( descripcion )
    `)
    .single();

  if (error) {
    console.error('Error al actualizar IVA:', error);
    throw error;
  }
  return data as IVAConEstado;
}

export async function deleteIVA(id: number) {
  const { error } = await supabase
    .from('iva')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar IVA:', error);
    throw error;
  }
  return true;
}
