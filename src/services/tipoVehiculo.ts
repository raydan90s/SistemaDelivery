import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type TipoVehiculo = Database['public']['Tables']['tipovehiculo']['Row'];
type TipoVehiculoInsert = Database['public']['Tables']['tipovehiculo']['Insert'];
type TipoVehiculoUpdate = Database['public']['Tables']['tipovehiculo']['Update'];

export async function fetchTipoVehiculos(): Promise<TipoVehiculo[]> {
  const { data, error } = await supabase
    .from('tipovehiculo')
    .select(`
      *,
      estados_generales:estado_id(id, descripcion)
    `)
    .order('descripcion');

  if (error) {
    console.error('Error al obtener tipos de vehículo:', error);
    throw new Error(`Error al cargar tipos de vehículo: ${error.message}`);
  }

  return data || [];
}

export async function createTipoVehiculo(tipoVehiculo: TipoVehiculoInsert): Promise<TipoVehiculo> {
  const { data, error } = await supabase
    .from('tipovehiculo')
    .insert(tipoVehiculo)
    .select(`
      *,
      estados_generales:estado_id(id, descripcion)
    `)
    .single();

  if (error) {
    console.error('Error al crear tipo de vehículo:', error);
    throw new Error(`Error al crear tipo de vehículo: ${error.message}`);
  }

  return data;
}

export async function updateTipoVehiculo(id: number, tipoVehiculo: TipoVehiculoUpdate): Promise<TipoVehiculo> {
  const { data, error } = await supabase
    .from('tipovehiculo')
    .update(tipoVehiculo)
    .eq('id', id)
    .select(`
      *,
      estados_generales:estado_id(id, descripcion)
    `)
    .single();

  if (error) {
    console.error('Error al actualizar tipo de vehículo:', error);
    throw new Error(`Error al actualizar tipo de vehículo: ${error.message}`);
  }

  return data;
}

export async function deleteTipoVehiculo(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('tipovehiculo')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar tipo de vehículo:', error);
    throw new Error(`Error al eliminar tipo de vehículo: ${error.message}`);
  }

  return true;
}

export async function fetchTipoVehiculosActivos(): Promise<Array<{ value: number; label: string }>> {
  const { data, error } = await supabase
    .from('tipovehiculo')
    .select('id, descripcion')
    .eq('estado_id', 1) // Assuming 1 is 'Active' status
    .order('descripcion');

  if (error) {
    console.error('Error al obtener tipos de vehículo activos:', error);
    throw new Error(`Error al cargar tipos de vehículo: ${error.message}`);
  }

  return (data || []).map(item => ({
    value: item.id,
    label: item.descripcion
  }));
}

export async function seedTipoVehiculos() {
  const { data, error } = await supabase
    .from('tipovehiculo')
    .insert([
      { descripcion: 'Motocicleta', estado_id: 1 },
      { descripcion: 'Bicicleta', estado_id: 1 },
      { descripcion: 'Automóvil', estado_id: 1 },
      { descripcion: 'Camioneta', estado_id: 1 },
      { descripcion: 'A pie', estado_id: 1 }
    ]);

  if (error) {
    console.error('Error al insertar tipos de vehículo:', error);
  } else {
    console.log('Tipos de vehículo insertados:', data);
  }
}
