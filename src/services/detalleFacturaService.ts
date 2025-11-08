import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type DetalleFactura = Database['public']['Tables']['detallefactura']['Row'];
type DetalleFacturaInsert = Database['public']['Tables']['detallefactura']['Insert'];
type DetalleFacturaUpdate = Database['public']['Tables']['detallefactura']['Update'];

export async function fetchDetallesFactura(facturaId: number) {
  const { data, error } = await supabase
    .from('detallefactura')
    .select('*')
    .eq('factura_id', facturaId);

  if (error) {
    console.error('Error al obtener detalles de factura:', error);
    throw error;
  }

  return data as DetalleFactura[];
}

export async function createDetalleFactura(detalle: DetalleFacturaInsert) {
  const { data, error } = await supabase
    .from('detallefactura')
    .insert([detalle])
    .select()
    .single();

  if (error) throw error;
  return data as DetalleFactura;
}

export async function updateDetalleFactura(id: number, detalle: DetalleFacturaUpdate) {
  const { data, error } = await supabase
    .from('detallefactura')
    .update(detalle)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DetalleFactura;
}

export async function deleteDetalleFactura(id: number) {
  const { error } = await supabase
    .from('detallefactura')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
