import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';
import { createUsuario, updateUsuario } from '@services/usuario'; 

type Empleado = Database['public']['Tables']['empleados']['Row'];
type EmpleadoInsert = Database['public']['Tables']['empleados']['Insert'];
type EmpleadoUpdate = Database['public']['Tables']['empleados']['Update'];
type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert'];
type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update'];

export type EmpleadoForm = {
  nombre: string;
  apellido: string | null;
  celular: string | null;
  rol_id: number | null;
  tipo_empleado_id: number | null;
  estado_id: number | null;
  usuario_id?: number;
};

export type EmpleadoConRelaciones = Empleado & {
  tipo_empleado?: {
    descripcion: string;
  };
  estados_generales?: {
    descripcion: string;
  };
  usuarios?: {
    nombre: string;
    apellido: string | null;
    celular: string | null;
    rol_id: number | null;
  };
};

const selectQuery = `
  *,
  tipo_empleado:tipo_empleado_id ( descripcion ),
  estados_generales:estado_id ( descripcion ),
  usuarios:usuario_id ( nombre, apellido, celular, rol_id )
`;

export async function fetchEmpleados(searchQuery?: string) {
  let query = supabase
    .from('empleados')
    .select(selectQuery);
  if (searchQuery && searchQuery.trim() !== '') {
    const searchTerm = `%${searchQuery}%`;
    query = query.or(
      `usuarios.nombre.ilike.${searchTerm},usuarios.apellido.ilike.${searchTerm}`
    );
  }

  const { data, error } = await query.order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
  return data as EmpleadoConRelaciones[];
}

export async function fetchEmpleadoById(id: number) {
  const { data, error } = await supabase
    .from('empleados')
    .select(selectQuery)
    .eq('id', id)       
    .single();

  if (error) {
    console.error('Error al obtener empleado:', error);
    throw error;
  }
  return data as EmpleadoConRelaciones;
}

export async function createEmpleado(formData: EmpleadoForm) {
  const usuarioData = await createUsuario({
    nombre: formData.nombre,
    apellido: formData.apellido,
    celular: formData.celular,
    estado_id: formData.estado_id,
    rol_id: formData.rol_id,

  } as UsuarioInsert);

  const { data, error } = await supabase
    .from('empleados')
    .insert({
      usuario_id: usuarioData.id,
      tipo_empleado_id: formData.tipo_empleado_id,
      estado_id: formData.estado_id,
    } as EmpleadoInsert)
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al crear empleado (después de crear usuario):', error);

    throw error;
  }
  return data as EmpleadoConRelaciones;
}

export async function updateEmpleado(id: number, formData: EmpleadoForm) {
  if (!formData.usuario_id) {
    throw new Error('No se proporcionó usuario_id para la actualización.');
  }

  await updateUsuario(formData.usuario_id, {
    nombre: formData.nombre,
    apellido: formData.apellido,
    celular: formData.celular,
    estado_id: formData.estado_id,
    rol_id: formData.rol_id,
  } as UsuarioUpdate);

  const { data, error } = await supabase
    .from('empleados')
    .update({
      tipo_empleado_id: formData.tipo_empleado_id,
      estado_id: formData.estado_id,
    } as EmpleadoUpdate)
    .eq('id', id)
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al actualizar empleado:', error);
    throw error;
  }
  return data as EmpleadoConRelaciones;
}

export async function deleteEmpleado(id: number) {
 const { error } = await supabase
    .from('empleados')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar empleado:', error);
    throw error;
  }
  return true;
}

export async function fetchEmpleadoByUsuarioId(usuarioId: number) {
  const { data, error } = await supabase
    .from('empleados')
    .select(selectQuery)
    .eq('usuario_id', usuarioId)
    .single();

  if (error) {
    console.error('Error al obtener empleado por usuario_id:', error);
    throw error;
  }
  return true;
}