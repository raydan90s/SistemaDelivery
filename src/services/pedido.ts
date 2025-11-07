import { supabase } from './supabase'; 
import type { Pedido } from '../types/pedidosTypes'; // Tipo de pedido

// Crear un nuevo pedido
export const crearPedido = async (pedidoData: Pedido) => {
  const { data, error } = await supabase
    .from('pedidos') 
    .insert([pedidoData]);

  if (error) {
    console.error('Error al crear el pedido:', error.message);
    return null;
  }
  return data; 
};

// Obtener todos los pedidos
export const obtenerPedidos = async () => {
  const { data, error } = await supabase
    .from('pedidos') 
    .select(`
      *,
      clientes(
        nombre,
        apellido,
        celular,
        direccionescliente(direccion)
      ),
      estadospedido(descripcion),
      tipoentrega(descripcion)
    `);

  if (error) {
    console.error('Error al obtener los pedidos:', error.message);
    return [];
  }
  return data || [];
};
// Obtener un pedido por su ID
export const obtenerPedidoPorId = async (id: number): Promise<Pedido | null> => {
  const { data, error } = await supabase
    .from('pedidos') 
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener el pedido por ID:', error.message);
    return null;
  }
  return data; // Retorna el pedido encontrado por su ID
};

// Actualizar el estado del pedido
export const actualizarEstadoPedido = async (id: number, estadoId: number) => {
  const { data, error } = await supabase
    .from('pedidos') 
    .update({ estado_pedido_id: estadoId })
    .match({ id });

  if (error) {
    console.error('Error al actualizar el estado del pedido:', error.message);
    return null;
  }
  return data; // Retorna el pedido actualizado
};

// Actualizar los datos del pedido
export const actualizarPedido = async (id: number, updatedData: Partial<Pedido>) => {
  const { data, error } = await supabase
    .from('pedidos') 
    .update(updatedData)
    .match({ id });

  if (error) {
    console.error('Error al actualizar el pedido:', error.message);
    return null;
  }
  return data; 
};

// Eliminar un pedido
export const eliminarPedido = async (id: number) => {
  const { data, error } = await supabase
    .from('pedidos') 
    .delete()
    .eq('id', id);  

  if (error) {
    console.error('Error al eliminar el pedido:', error); 
    throw error;  
  }
  return data; 
};