export type Producto = {
  nombre: string;
  descripcion: string; 
}


export interface DetallePedido {
  id: number;      
  pedido_id: number | null;  
  precio: number;     
  cantidad: number;   
  producto_id: number | null; 
  subtotal: number;   
}