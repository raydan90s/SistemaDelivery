import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';
import { fetchEstadosGenerales } from '@services/estadosGenerales';

type TipoEmpleado = Database['public']['Tables']['tipoempleado']['Row'];
type TipoEmpleadoInsert = Database['public']['Tables']['tipoempleado']['Insert'];
type TipoEmpleadoUpdate = Database['public']['Tables']['tipoempleado']['Update'];

export type TipoEmpleadoConRelaciones = TipoEmpleado & {
  estados_generales?: {
    descripcion: string;
  };
};

const selectQuery = `
  *,
  estados_generales:estado_id ( descripcion )
`;

export async function fetchTiposEmpleado() {
  const { data, error } = await supabase
    .from('tipoempleado')
    .select(selectQuery)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener tipos de empleado:', error);
    throw error;
  }
  return data as TipoEmpleadoConRelaciones[];
}

export async function fetchTipoEmpleadoById(id: number) {
  const { data, error } = await supabase
    .from('tipoempleado')
    .select(selectQuery)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener tipo de empleado:', error);
    throw error;
  }
  return data as TipoEmpleadoConRelaciones;
}

export async function createTipoEmpleado(tipoEmpleado: TipoEmpleadoInsert) {
  const { data, error } = await supabase
    .from('tipoempleado')
    .insert([tipoEmpleado])
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al crear tipo de empleado:', error);
    throw error;
  }
  return data as TipoEmpleadoConRelaciones;
}

export async function updateTipoEmpleado(id: number, tipoEmpleado: TipoEmpleadoUpdate) {
  const { data, error } = await supabase
    .from('tipoempleado')
    .update(tipoEmpleado)
    .eq('id', id)
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al actualizar tipo de empleado:', error);
    throw error;
  }
  return data as TipoEmpleadoConRelaciones;
}

export async function deleteTipoEmpleado(id: number) {
  
  const estados = await fetchEstadosGenerales();
    const estadoInactivo = estados.find(e => e.descripcion.toLowerCase() === 'inactivo');
  
    if (!estadoInactivo) {
      throw new Error('No se encontró el estado Inactivo');
    }
  
    const { data, error } = await supabase
      .from('tipoempleado')
      .update({ estado_id: estadoInactivo.id })
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      throw error;
    }
    return true;
  
}