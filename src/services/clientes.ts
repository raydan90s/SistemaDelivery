import { supabase, supabaseAdmin } from '@services/supabase';
import type { Database } from '@models/supabase';
import { fetchEstadosGenerales } from '@services/estadosGenerales';
import { createUsuario, updateUsuario } from '@services/usuario';

type Cliente = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];
type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert'];
type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update'];

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
    id: number;
    nombre: string;
    apellido: string | null;
    celular: string | null;
    auth_user_id: string | null;
  };
};

const selectQuery = `
  *,
  tipo_cliente:tipo_cliente_id ( descripcion ),
  tipo_documento:tipo_documento_id ( descripcion ),
  estados_generales:estado_id ( descripcion ),
  usuario:usuario_id ( id, nombre, apellido, celular, auth_user_id )
`;

export async function fetchClientes() {
  const estados = await fetchEstadosGenerales();
  const estadoActivo = estados.find(e => e.descripcion.toLowerCase() === 'activo');
  
  let query = supabase
    .from('clientes')
    .select(selectQuery)
    .order('id', { ascending: true });

  if (estadoActivo) {
    query = query.eq('estado_id', estadoActivo.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
  
  return (data || []) as ClienteConRelaciones[];
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

export async function createCliente(clienteData: ClienteInsert & { 
  nombre: string;
  apellido?: string;
  celular?: string;
  email: string;
  password: string;
}) {
  if (!clienteData.email) {
    throw new Error('El email es requerido para crear un cliente');
  }

  if (!clienteData.password) {
    throw new Error('La contraseña es requerida para crear un cliente');
  }

  const estados = await fetchEstadosGenerales();
  const estadoActivo = estados.find(e => e.descripcion.toLowerCase() === 'activo');
  
  if (!supabaseAdmin) {
    throw new Error('Service Role Key no configurada. No se puede crear usuario de autenticación.');
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: clienteData.email,
    password: clienteData.password,
    email_confirm: true,
  });

  if (authError) {
    console.error('Error al crear usuario de autenticación:', authError);
    throw new Error(`Error al crear usuario de autenticación: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error('No se pudo crear el usuario en el sistema de autenticación.');
  }

  try {
    const usuarioData: UsuarioInsert = {
      nombre: clienteData.nombre,
      apellido: clienteData.apellido || null,
      celular: clienteData.celular || null,
      auth_user_id: authData.user.id,
      rol_id: 5,
      estado_id: estadoActivo?.id || null
    };

    const usuario = await createUsuario(usuarioData);

    const clienteInsert: ClienteInsert = {
      usuario_id: usuario.id,
      numero_documento: clienteData.numero_documento || null,
      tipo_cliente_id: clienteData.tipo_cliente_id || null,
      tipo_documento_id: clienteData.tipo_documento_id || null,
      estado_id: estadoActivo?.id || null
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([clienteInsert])
      .select(selectQuery)
      .single();

    if (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }

    return data as ClienteConRelaciones;
  } catch (error) {
    if (authData.user && supabaseAdmin) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error('Error al eliminar usuario de autenticación:', deleteError);
      }
    }
    throw error;
  }
}

export async function updateCliente(id: number, clienteData: ClienteUpdate & {
  nombre?: string;
  apellido?: string;
  celular?: string;
}) {
  const clienteActual = await fetchClienteById(id);
  
  if (clienteActual.usuario_id && (clienteData.nombre || clienteData.apellido !== undefined || clienteData.celular !== undefined)) {
    const usuarioUpdate: UsuarioUpdate = {};
    if (clienteData.nombre) usuarioUpdate.nombre = clienteData.nombre;
    if (clienteData.apellido !== undefined) usuarioUpdate.apellido = clienteData.apellido || null;
    if (clienteData.celular !== undefined) usuarioUpdate.celular = clienteData.celular || null;
    
    await updateUsuario(clienteActual.usuario_id, usuarioUpdate);
  }

  const clienteUpdate: ClienteUpdate = {
    numero_documento: clienteData.numero_documento,
    tipo_cliente_id: clienteData.tipo_cliente_id,
    tipo_documento_id: clienteData.tipo_documento_id
  };

  const { data, error } = await supabase
    .from('clientes')
    .update(clienteUpdate)
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
  const estados = await fetchEstadosGenerales();
  const estadoInactivo = estados.find(e => e.descripcion.toLowerCase() === 'inactivo');

  if (!estadoInactivo) {
    throw new Error('No se encontró el estado Inactivo');
  }

  const cliente = await fetchClienteById(id);
  
  const { data: clienteData, error: clienteError } = await supabase
    .from('clientes')
    .update({ estado_id: estadoInactivo.id })
    .eq('id', id)
    .select(selectQuery)
    .single();

  if (clienteError) {
    console.error('Error al eliminar cliente:', clienteError);
    throw clienteError;
  }

  if (cliente.usuario_id) {
    await updateUsuario(cliente.usuario_id, { estado_id: estadoInactivo.id });
  }

  return clienteData as ClienteConRelaciones;
}


