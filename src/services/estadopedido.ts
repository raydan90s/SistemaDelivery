
import { supabase } from './supabase';
import type { EstadoPedido } from '../types/estadoPedidoTypes';

// Obtener todos los estados de los pedidos
export const obtenerEstadosPedido = async (): Promise<EstadoPedido[]> => {
  const { data, error } = await supabase
    .from('estadospedido') 
    .select('*')
    .neq('id', 2 ); // Excluir el estado con id 2 (eliminado)

  if (error) {
    console.error('Error al obtener los estados de los pedidos:', error.message);
    return [];
  }
  return data; // Retorna la lista de estados
};

export const obtenerEstadosPedidoParaSelect = async () => {
  const estados = await obtenerEstadosPedido();
  return estados.map(estado => ({
    value: estado.id,
    label: estado.descripcion || 'Sin descripción'
  }));
};