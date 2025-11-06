import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Factura = Database['public']['Tables']['factura']['Row'];
type FacturaInsert = Database['public']['Tables']['factura']['Insert'];
type FacturaUpdate = Database['public']['Tables']['factura']['Update'];

const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2;

export async function fetchFacturas() {
  const { data, error } = await supabase
    .from('factura')
    .select(`
      *,
      cliente:clientes(id, nombre, apellido, numero_documento),
      metodo_pago:metodopago(id, descripcion),
      iva:iva(id, porcentaje),
      pedido:pedidos(id),
      estado:estados_generales(id, descripcion)
    `)
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }

  return data as any[];
}

export async function fetchFacturaById(id: number) {
  const { data, error } = await supabase
    .from('factura')
    .select(`
      *,
      cliente:clientes(id, nombre, apellido, numero_documento),
      metodo_pago:metodopago(id, descripcion),
      iva:iva(id, porcentaje),
      pedido:pedidos(id),
      estado:estados_generales(id, descripcion)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener factura:', error);
    throw error;
  }

  return data;
}

export async function createFactura(factura: FacturaInsert) {
  const { data, error } = await supabase
    .from('factura')
    .insert([factura])
    .select()
    .single();

  if (error) {
    console.error('Error al crear factura:', error);
    throw error;
  }

  return data as Factura;
}

export async function updateFactura(id: number, factura: FacturaUpdate) {
  const { data, error } = await supabase
    .from('factura')
    .update(factura)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar factura:', error);
    throw error;
  }

  return data as Factura;
}

export async function deleteFactura(id: number) {
  const { error } = await supabase
    .from('factura')
    .update({ estado_id: ESTADO_INACTIVO })
    .eq('id', id);

  if (error) {
    console.error('Error al inactivar factura:', error);
    throw error;
  }

  return true;
}