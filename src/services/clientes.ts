import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';
import { fetchEstadosGenerales } from '@services/estadosGenerales';

type Cliente = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

export async function fetchClientes() {
  const estados = await fetchEstadosGenerales();
  const estadoActivo = estados.find(e => e.descripcion.toLowerCase() === 'activo');
  
  let query = supabase
    .from('clientes')
    .select('*')
    .order('id', { ascending: true });

  if (estadoActivo) {
    query = query.eq('estado_id', estadoActivo.id);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }
  
  return (data || []) as Cliente[];
}

export async function fetchClienteById(id: number) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data as Cliente;
}

export async function createCliente(cliente: ClienteInsert) {
  const estados = await fetchEstadosGenerales();
  const estadoActivo = estados.find(e => e.descripcion.toLowerCase() === 'activo');
  
  const clienteConEstado = {
    ...cliente,
    estado_id: estadoActivo?.id || null
  };

  const { data, error } = await supabase
    .from('clientes')
    .insert([clienteConEstado])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Cliente;
}

export async function updateCliente(id: number, cliente: ClienteUpdate) {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Cliente;
}

export async function deleteCliente(id: number) {
  const estados = await fetchEstadosGenerales();
  const estadoInactivo = estados.find(e => e.descripcion.toLowerCase() === 'inactivo');

  if (!estadoInactivo) {
    throw new Error('No se encontró el estado Inactivo');
  }

  const { data, error } = await supabase
    .from('clientes')
    .update({ estado_id: estadoInactivo.id })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Cliente;
}


