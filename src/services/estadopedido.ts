// /services/estadosPedidoService.ts
import { supabase } from './supabase';
import type { EstadoPedido } from '../types/estadopedidoTypes';

// Obtener todos los estados de los pedidos
export const obtenerEstadosPedido = async (): Promise<EstadoPedido[]> => {
  const { data, error } = await supabase
    .from('estadospedido') 
    .select('*');

  if (error) {
    console.error('Error al obtener los estados de los pedidos:', error.message);
    return [];
  }
  return data; // Retorna la lista de estados
};

