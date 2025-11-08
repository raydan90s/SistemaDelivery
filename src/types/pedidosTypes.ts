import type { Database } from './supabase';

export type Pedido = Database['public']['Tables']['pedidos']['Row'];
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert'];
export type PedidoUpdate = Database['public']['Tables']['pedidos']['Update'];

export type Cliente = {
  nombre: string | null;
  apellido: string | null;
  celular: string | null;
  direccionescliente?: DireccionCliente[] | null;  
};

export type DireccionCliente = {
  direccion: string | null;
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

  clientes?: Cliente;
  estadospedido?: EstadoPedido;
  tipoentrega?: TipoEntrega;
  detallepedido?: DetallePedido[];
}