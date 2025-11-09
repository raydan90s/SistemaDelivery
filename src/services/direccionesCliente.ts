import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';
import { fetchEstadosGenerales } from '@services/estadosGenerales';

type DireccionCliente = Database['public']['Tables']['direccionescliente']['Row'];
type DireccionClienteInsert = Database['public']['Tables']['direccionescliente']['Insert'];
type DireccionClienteUpdate = Database['public']['Tables']['direccionescliente']['Update'];

export type DireccionClienteCompleta = DireccionCliente & {
  provincias?: {
    nombre: string;
  };
  ciudades?: {
    nombre: string;
  };
};

export async function fetchDireccionesCliente(clienteId: number) {
  const estados = await fetchEstadosGenerales();
  const estadoActivo = estados.find(e => e.descripcion.toLowerCase() === 'activo');

  let query = supabase
    .from('direccionescliente')
    .select(`
      *,
      provincias (
        nombre
      ),
      ciudades (
        nombre
      )
    `)
    .eq('cliente_id', clienteId)
    .order('id', { ascending: false });

  if (estadoActivo) {
    query = query.eq('estado_id', estadoActivo.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error al obtener direcciones:', error);
    throw error;
  }
  return (data || []) as DireccionClienteCompleta[];
}

export async function createDireccionCliente(direccion: DireccionClienteInsert) {
  const estados = await fetchEstadosGenerales();
  const estadoActivo = estados.find(e => e.descripcion.toLowerCase() === 'activo');

  const direccionConEstado = {
    ...direccion,
    estado_id: estadoActivo?.id || null
  };

  const { data, error } = await supabase
    .from('direccionescliente')
    .insert([direccionConEstado])
    .select(`
      *,
      provincias (
        nombre
      ),
      ciudades (
        nombre
      )
    `)
    .single();

  if (error) {
    console.error('Error al crear dirección:', error);
    throw error;
  }
  return data as DireccionClienteCompleta;
}

export async function updateDireccionCliente(id: number, direccion: DireccionClienteUpdate) {
  const { data, error } = await supabase
    .from('direccionescliente')
    .update(direccion)
    .eq('id', id)
    .select(`
      *,
      provincias (
        nombre
      ),
      ciudades (
        nombre
      )
    `)
    .single();

  if (error) {
    console.error('Error al actualizar dirección:', error);
    throw error;
  }
  return data as DireccionClienteCompleta;
}

export async function deleteDireccionCliente(id: number) {
  const estados = await fetchEstadosGenerales();
  const estadoInactivo = estados.find(e => e.descripcion.toLowerCase() === 'inactivo');

  if (!estadoInactivo) {
    throw new Error('No se encontró el estado Inactivo');
  }

  const { data, error } = await supabase
    .from('direccionescliente')
    .update({ estado_id: estadoInactivo.id })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al eliminar dirección:', error);
    throw error;
  }
  return data as DireccionCliente;
}

