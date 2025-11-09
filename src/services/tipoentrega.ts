import { supabase } from './supabase';

import type { TipoEntrega } from '../types/tipoEntregaTypes';

// Obtener todos los tipos de entrega
export const obtenerTiposEntrega = async (): Promise<TipoEntrega[]> => {
  const { data, error } = await supabase
    .from('tipoentrega') 
    .select('*')
    .neq('id', 2 ); // Excluir el tipo con id 2 (eliminado)

  if (error) {
    console.error('Error al obtener los tipos de entrega:', error.message);
    return [];
  }
  return data; // Retorna la lista de tipos de entrega
};


export const obtenerTiposEntregaParaSelect = async () => {
  const tipos = await obtenerTiposEntrega();
  return tipos.map(tipo => ({
    value: tipo.id,
    label: tipo.descripcion || 'Sin descripción'
  }));
};