import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type Empleado = Database['public']['Tables']['empleados']['Row'];
type EmpleadoInsert = Database['public']['Tables']['empleados']['Insert'];
type EmpleadoUpdate = Database['public']['Tables']['empleados']['Update'];

export type EmpleadoConRelaciones = Empleado & {
  tipo_empleado?: {
    descripcion: string;
  };
  estados_generales?: { 
    descripcion: string;
  };
};

const selectQuery = `
  *,
  tipo_empleado:tipo_empleado_id ( descripcion ),
  estados_generales:estado_id ( descripcion )
`;

export async function fetchEmpleados() {
  const { data, error } = await supabase
    .from('empleados')
    .select(selectQuery)
    .order('id', { ascending: true });

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

export async function createEmpleado(empleado: EmpleadoInsert) {
  const { data, error } = await supabase
    .from('empleados')
    .insert([empleado])
    .select(selectQuery)
    .single();

  if (error) {
    console.error('Error al crear empleado:', error);
    throw error;
  }
  return data as EmpleadoConRelaciones;
}

export async function updateEmpleado(id: number, empleado: EmpleadoUpdate) {
  const { data, error } = await supabase
    .from('empleados')
    .update(empleado)
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
  return data as EmpleadoConRelaciones;
}