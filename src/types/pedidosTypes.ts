export type Cliente = {
  nombre: string | null;
  apellido: string | null;
  celular: string | null;
  direccionescliente?: DireccionCliente[] | null;  
};

export type DireccionCliente = {
  direccion: string | null;
};

export interface Pedido {
  id: number;  
  cliente_id: number | null;  
  fecha: string; 
  total: number;  
  estado_pedido_id: number | null;  
  tipo_entrega_id: number | null;  
  repartidor_id: number | null;  
  estado_id: number | null;  
  clientes?: Cliente;
  direccioncliente?: DireccionCliente;
  estadospedido?: { descripcion: string | null } | null;  
  tipoentrega?: { descripcion: string | null } | null; 
}