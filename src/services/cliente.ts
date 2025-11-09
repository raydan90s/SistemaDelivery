import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Cliente = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

export type ClienteConRelaciones = Cliente & {
  tipo_cliente?: {
    descripcion: string;
  };
  tipo_documento?: {
    descripcion: string;
  };
  estados_generales?: { 
    descripcion: string;
  };
  usuario?: {
    nombre: string;
    apellido: string | null;
    celular: string | null;
    auth_user_id: string | null;
  };
};

// ✅ Eliminado 'correo' del select, agregado 'auth_user_id'
const selectQuery = `
  *,
  tipo_cliente:tipo_cliente_id ( descripcion ),
  tipo_documento:tipo_documento_id ( descripcion ),
  estados_generales:estado_id ( descripcion ),
  usuario:usuario_id ( nombre, apellido, celular, auth_user_id )
`;

export async function fetchClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select(selectQuery)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
  return data as ClienteConRelaciones[];
}

export async function fetchClienteById(id: number) {
  const { data, error } = await supabase
    .from('clientes')
    .select(selectQuery)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener cliente:', error);
    throw error;
  }
  return data as ClienteConRelaciones;
}

export async function fetchClienteByUsuarioId(usuarioId: number) {
  const { data, error } = await supabase
    .from('clientes')
    .select(selectQuery)
    .eq('usuario_id', usuarioId)
    .single();

  if (error) {
    console.error('Error al obtener cliente por usuario_id:', error);
    throw error;
  }
  return data as ClienteConRelaciones;
}

export async function createCliente(cliente: ClienteInsert) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
  return data as ClienteConRelaciones;
}

export async function updateCliente(id: number, cliente: ClienteUpdate) {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al actualizar cliente:', error);
    throw error;
  }
  return data as ClienteConRelaciones;
}

export async function deleteCliente(id: number) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
  return true;
}