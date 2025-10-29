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
