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
      cliente:clientes (id, nombre, apellido, numero_documento),
      metodopago (id, descripcion),
      iva (id, porcentaje),
      pedidos (id),
      estados_generales (id, descripcion)
    `)
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }

  return data as any[];
}


export async function fetchFacturaById(id: number) {
  // Obtener la factura general
  const { data: factura, error: errorFactura } = await supabase
    .from('factura')
    .select('*')
    .eq('id', id)
    .single();

  if (errorFactura) {
    console.error('Error al obtener factura:', errorFactura);
    throw errorFactura;
  }

  // Obtener los detalles de esa factura
  const { data: detalles, error: errorDetalles } = await supabase
    .from('detallefactura')
    .select('*')
    .eq('factura_id', id);

  if (errorDetalles) {
    console.error('Error al obtener detalles de factura:', errorDetalles);
    throw errorDetalles;
  }

  // Obtener el cliente asociado
  let cliente = null;
  if (factura.cliente_id) {
    const { data: clienteData, error: errorCliente } = await supabase
      .from('clientes')
      .select('nombre, apellido, numero_documento')
      .eq('id', factura.cliente_id)
      .single();

    if (errorCliente) {
      console.warn('No se pudo obtener el cliente:', errorCliente);
    } else {
      cliente = clienteData;
    }
  }

  
  return { ...factura, cliente, detallefactura: detalles || [] };
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
  // Soft delete (estado inactivo)
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
