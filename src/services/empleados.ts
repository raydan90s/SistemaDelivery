import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

// 1. Definimos los tipos base para la tabla 'empleados'
type Empleado = Database['public']['Tables']['empleados']['Row'];
type EmpleadoInsert = Database['public']['Tables']['empleados']['Insert'];
type EmpleadoUpdate = Database['public']['Tables']['empleados']['Update'];

// 2. Creamos un tipo que incluye las relaciones
export type EmpleadoConRelaciones = Empleado & {
  tipo_empleado?: { // La tabla 'TipoEmpleado' a través de 'tipo_empleado_id'
    descripcion: string;
  };
  estados_generales?: { // La tabla 'Estados_Generales' a través de 'estado_id'
    descripcion: string;
  };
};

// 3. Definimos el string de la consulta con joins
const selectQuery = `
  *,
  tipo_empleado:tipo_empleado_id ( descripcion ),
  estados_generales:estado_id ( descripcion )
`;

export async function fetchEmpleados() {
  const { data, error } = await supabase
    .from('empleados')
    .select(selectQuery) // Usamos la consulta con joins
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
    .select(selectQuery) // Usamos la consulta con joins
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
    .select(selectQuery) // Devolvemos el objeto creado con sus relaciones
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
    .select(selectQuery) // Devolvemos el objeto actualizado con sus relaciones
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