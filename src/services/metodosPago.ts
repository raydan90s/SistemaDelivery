import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type MetodoPago = Database['public']['Tables']['metodopago']['Row'];
type MetodoPagoInsert = Database['public']['Tables']['metodopago']['Insert'];
type MetodoPagoUpdate = Database['public']['Tables']['metodopago']['Update'];

export type MetodoPagoConEstado = MetodoPago & {
  estados_generales?: {
    descripcion: string;
  };
};

export async function fetchMetodoPago() {
  const { data, error } = await supabase
    .from('metodopago')
    .select(`
      *,
      estados_generales (
        descripcion
      )
    `)
    .order('descripcion', { ascending: true });

  if (error) {
    console.error('Error al obtener los metodos de pago:', error);
    throw error;
  }
  return data as MetodoPagoConEstado[];
}

export async function fetchMetodoPagoById(id: number) {
  const { data, error } = await supabase
    .from('metodopago')
    .select(`
      *,
      estados_generales (
        descripcion
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener el metodo de pago', error);
    throw error;
  }
  return data as MetodoPagoConEstado;
}

export async function createMetodoPago(metodoPago: MetodoPagoInsert) {
  const { data, error } = await supabase
    .from('metodopago')
    .insert([metodoPago])
    .select(`
      *,
      estados_generales (
        descripcion
      )
    `)
    .single();

  if (error) {
    console.error('Error al crear el metodo de pago:', error);
    throw error;
  }
  return data as MetodoPagoConEstado;
}

export async function updateMetodoPago(id: number, metodoPago: MetodoPagoUpdate) {
  const { data, error } = await supabase
    .from('metodopago')
    .update(metodoPago)
    .eq('id', id)
    .select(`
      *,
      estados_generales (
        descripcion
      )
    `)
    .single();

  if (error) {
    console.error('Error al actualizar el metodo de pago:', error);
    throw error;
  }
  return data as MetodoPagoConEstado;
}

export async function deleteMetodoPago(id: number) {
  const { error } = await supabase
    .from('metodopago')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar el metodo de pago:', error);
    throw error;
  }
  return true;
}

export async function fetchMetodoPagoByEstado(estadoID: number) {
  const { data, error } = await supabase
    .from('metodopago')
    .select('*')
    .eq('estado_id', estadoID)
    .order('descripcion', { ascending: true });

  if (error) {
    console.error('Error al obtener metodo de pago por estado:', error);
    throw error;
  }
  return data as MetodoPago[];
}