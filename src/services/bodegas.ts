import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';


export type Bodega = Database['public']['Tables']['bodegas']['Row'];
export type BodegaInsert = Database['public']['Tables']['bodegas']['Insert'];
export type BodegaUpdate = Database['public']['Tables']['bodegas']['Update'];


export async function fetchBodegas() {
const { data, error } = await supabase
.from('bodegas')
.select('*')
.order('nombre', { ascending: true });


if (error) {
console.error('Error al obtener bodegas:', error);
throw error;
}


return data as Bodega[];
}

export async function seedBodegas() {
  const { data, error } = await supabase
    .from("bodegas")
    .insert([
      { nombre: "Bodega Suoreste", ubicacion: "Guayaquil", estado_id: 1},
    ]);

  if (error) {
    console.error("Error al insertar datos quemados:", error);
  } else {
    console.log("Datos quemados insertados:", data);
  }
}

export async function fetchBodegaById(id: number) {
const { data, error } = await supabase
.from('bodegas')
.select('*')
.eq('id', id)
.single();


if (error) {
console.error('Error al obtener bodega:', error);
throw error;
}


return data as Bodega;
}


export async function createBodega(bodega: BodegaInsert) {
const { data, error } = await supabase
.from('bodegas')
.insert([bodega])
.select()
.single();


if (error) {
console.error('Error al crear bodega:', error);
throw error;
}


return data as Bodega;
}


export async function updateBodega(id: number, bodega: BodegaUpdate) {
const { data, error } = await supabase
.from('bodegas')
.update(bodega)
.eq('id', id)
.select()
.single();


if (error) {
console.error('Error al actualizar bodega:', error);
throw error;
}


return data as Bodega;
}


export async function deleteBodega(id: number) {
const { error } = await supabase
.from('bodegas')
.delete()
.eq('id', id);


if (error) {
console.error('Error al eliminar bodega:', error);
throw error;
}


return true;
}