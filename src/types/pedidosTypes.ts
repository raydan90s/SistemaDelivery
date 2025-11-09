import type { Database } from './supabase';

export type Pedido = Database['public']['Tables']['pedidos']['Row'];
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert'];
export type PedidoUpdate = Database['public']['Tables']['pedidos']['Update'];


export type Usuario = {
  nombre: string;
  apellido: string | null;
  celular: string | null;
};

export type DireccionCliente = {
  direccion: string;
};

export type Cliente = {
  id: number;
  numero_documento: string | null;
  usuario_id: number | null;
  usuarios?: Usuario | null; 
  direccionescliente?: DireccionCliente[] | null;
};

export type EstadoPedido = {
  descripcion: string | null;
};

export type TipoEntrega = {
  descripcion: string | null;
};

export type Producto = {
  nombre: string | null;
  descripcion: string | null;
  imagen_url: string | null;
}

export type DetallePedido = {
  id: number;
  cantidad: number;
  precio: number;
  subtotal: number;
  productos: Producto | null;
};


export interface PedidoConRelaciones extends Pedido {

  clientes?: Cliente | null;
  estadospedido?: EstadoPedido | null;
  tipoentrega?: TipoEntrega | null;
  detallepedido?: DetallePedido[] | null;
}