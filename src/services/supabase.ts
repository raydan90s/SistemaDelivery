import { createClient } from '@supabase/supabase-js'
import type { Database } from '@models/supabase'

export const supabase = createClient<Database>(
  import.meta.env.VITE_URL_API,
  import.meta.env.VITE_ANON_KEY
);

