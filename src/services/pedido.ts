import { supabase } from './supabase'; 
import type { Pedido, PedidoConRelaciones } from '../types/pedidosTypes'; // Tipo de pedido

// Crear un nuevo pedido
export const crearPedido = async (pedidoData: Pedido) => {
  const { data, error } = await supabase
    .from('pedidos') 
    .insert([pedidoData])
    .select();

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
    `)
    .neq('estado_id', 2 )
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener los pedidos:', error.message);
    throw error;
  }
  return (data || []) as PedidoConRelaciones[];
};
// Obtener un pedido por su ID
export const obtenerPedidoPorId = async (id: number): Promise<PedidoConRelaciones> => {
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
      tipoentrega(descripcion),
      detallepedido(
        id,
        cantidad,
        precio,
        subtotal,
        productos(
          nombre,
          descripcion,
          imagen_url
          )
        )
      `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener el pedido por ID:', error.message);
    throw error;
  }
  return data as PedidoConRelaciones; // Retorna el pedido encontrado por su ID
};


// Actualizar los datos del pedido
export const actualizarPedido = async (id: number, updatedData: {

  estado_pedido_id?: number;
  tipo_entrega_id?: number;
 }):Promise<PedidoConRelaciones> => {
  const { data, error } = await supabase
    .from('pedidos') 
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar el pedido:', error.message);
    throw error;
  }
  return data as PedidoConRelaciones;  
};

// Eliminar un pedido
export const eliminarPedido = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('pedidos') 
    .update({ estado_id: 2 })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error al eliminar el pedido:', error); 
    throw error;  
  }
  return true; 
};