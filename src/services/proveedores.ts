import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Proveedor = Database['public']['Tables']['proveedores']['Row'];
type ProveedorInsert = Database['public']['Tables']['proveedores']['Insert'];
type ProveedorUpdate = Database['public']['Tables']['proveedores']['Update'];


export async function fetchProveedores() {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
  return data as Proveedor[];
}


export async function fetchProveedorById(id: number) {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener proveedor:', error);
    throw error;
  }
  return data as Proveedor;
}


export async function createProveedor(proveedor: ProveedorInsert) {
  const { data, error } = await supabase
    .from('proveedores')
    .insert([proveedor])
    .select()
    .single();

  if (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
  return data as Proveedor;
}


export async function updateProveedor(id: number, proveedor: ProveedorUpdate) {
  const { data, error } = await supabase
    .from('proveedores')
    .update(proveedor)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
  return data as Proveedor;
}


export async function deleteProveedor(id: number) {
  const { error } = await supabase
    .from('proveedores')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar proveedor:', error);
    throw error;
  }
  return true;
}