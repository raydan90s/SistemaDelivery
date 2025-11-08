import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';

type TipoCliente = Database['public']['Tables']['tipocliente']['Row'];

export async function fetchTipoClientes() {
  const { data, error } = await supabase
    .from('tipocliente')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }
  return data as TipoCliente[];
}

