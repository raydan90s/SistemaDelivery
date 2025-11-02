export type Cliente = {
  celular: string | null;
  direccionescliente?: DireccionCliente[] | null;  // ← AGREGAR ESTA LÍNEA
};

export type DireccionCliente = {
  direccion: string | null;
};

export interface Pedido {
  id: number;  // Clave primaria
  cliente_id: number | null;  // Clave foránea con la tabla clientes
  fecha: string;  // Timestamp
  total: number;  // Total del pedido
  estado_pedido_id: number | null;  // Clave foránea con la tabla estadospedido
  tipo_entrega_id: number | null;  // Clave foránea con la tabla tipoentrega
  repartidor_id: number | null;  // Clave foránea con la tabla repartidores
  estado_id: number | null;  // Clave foránea con la tabla estados_generales
  clientes?: Cliente;
  direccioncliente?: DireccionCliente;
  estadospedido?: { descripcion: string | null } | null;  // ← agregar
  tipoentrega?: { descripcion: string | null } | null; 
}