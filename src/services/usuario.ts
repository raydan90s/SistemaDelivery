import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Usuario = Database['public']['Tables']['usuarios']['Row'];
type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert'];
type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update'];

export type UsuarioConRelaciones = Usuario & {
  rol?: {
    nombre: string;
    descripcion: string | null;
  };
  estados_generales?: {
    descripcion: string;
  };
};

const selectQuery = `
  *,
  rol:rol_id ( nombre, descripcion ),
  estados_generales:estado_id ( descripcion )
`;

export async function fetchUsuarioByAuthId(authUserId: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select(selectQuery)
    .eq('auth_user_id', authUserId)
    .single();

  if (error) {
    console.error('Error al obtener usuario por auth_user_id:', error);
    throw error;
  }
  return data as UsuarioConRelaciones;
}

export async function createUsuario(usuario: UsuarioInsert) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([usuario])
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
  return data as UsuarioConRelaciones;
}

export async function updateUsuario(id: number, usuario: UsuarioUpdate) {
  const { data, error } = await supabase
    .from('usuarios')
    .update(usuario)
    .eq('id', id)
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
  return data as UsuarioConRelaciones;
}