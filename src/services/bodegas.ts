import { supabase } from '@services/supabase' 

export async function fetchBodegas() {
  const { data, error } = await supabase
    .from("bodegas")
    .select("*");

  if (error) {
    console.error("Error al obtener bodegas:", error);
  } else {
    console.log("Datos de bodegas:", data);
  }
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
