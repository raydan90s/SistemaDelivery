import { supabase } from './supabase';

import type { TipoEntrega } from '../types/tipoEntregaTypes';

// Obtener todos los tipos de entrega
export const obtenerTiposEntrega = async (): Promise<TipoEntrega[]> => {
  const { data, error } = await supabase
    .from('tipoentrega') // Nombre de la tabla en minúsculas
    .select('*');

  if (error) {
    console.error('Error al obtener los tipos de entrega:', error.message);
    return [];
  }
  return data; // Retorna la lista de tipos de entrega
};