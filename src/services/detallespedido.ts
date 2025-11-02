import { supabase } from './supabase';
import type { DetallePedido } from '../types/detallePedidoTypes';

// Crear un nuevo detalle de pedido
export const crearDetallePedido = async (detalle: DetallePedido) => {
  const { data, error } = await supabase
    .from('detallepedido') 
    .insert([detalle]);

  if (error) {
    console.error('Error al crear el detalle del pedido:', error.message);
    return null;
  }
  return data; 
};

// Obtener todos los detalles de un pedido
export const obtenerDetallePedido = async (pedidoId: number): Promise<DetallePedido[]> => {
  const { data, error } = await supabase
    .from('detallepedido')
    .select('*')
    .eq('pedido_id', pedidoId);

  if (error) {
    console.error('Error al obtener los detalles del pedido:', error.message);
    return [];
  }
  return data; // Retorna los detalles del pedido
};