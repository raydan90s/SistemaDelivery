import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Promocion = Database['public']['Tables']['promociones']['Row'];
type PromocionInsert = Database['public']['Tables']['promociones']['Insert'];
type PromocionUpdate = Database['public']['Tables']['promociones']['Update'];

// IDs de estados (ajustar según tu base de datos)
const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2;

export async function fetchPromociones() {
  const { data, error } = await supabase
    .from('promociones')
    .select(`
      *,
      estado:estados_generales(id, descripcion)
    `)
    .eq('estado_id', ESTADO_ACTIVO)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener promociones:', error);
    throw error;
  }
  return data as any[];
}

export async function fetchPromocionById(id: number) {
  const { data, error } = await supabase
    .from('promociones')
    .select(`
      *,
      estado:estados_generales(id, descripcion)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener promoción:', error);
    throw error;
  }
  return data;
}

export async function createPromocion(promocion: PromocionInsert) {
  const { data, error } = await supabase
    .from('promociones')
    .insert([promocion])
    .select()
    .single();

  if (error) {
    console.error('Error al crear promoción:', error);
    throw error;
  }
  return data as Promocion;
}

export async function updatePromocion(id: number, promocion: PromocionUpdate) {
  const { data, error } = await supabase
    .from('promociones')
    .update(promocion)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar promoción:', error);
    throw error;
  }
  return data as Promocion;
}

export async function deletePromocion(id: number) {
  // Soft delete: cambiar estado a inactivo
  const { error } = await supabase
    .from('promociones')
    .update({ estado_id: ESTADO_INACTIVO })
    .eq('id', id);

  if (error) {
    console.error('Error al inactivar promoción:', error);
    throw error;
  }
  return true;
}

// Helper para obtener opciones de select
export async function fetchPromocionesOptions() {
  const promociones = await fetchPromociones();
  return promociones.map(promo => ({
    value: promo.id,
    label: promo.nombre
  }));
}
