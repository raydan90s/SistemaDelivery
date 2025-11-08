import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://onhnqnvjbbepptzrzhei.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaG5xbnZqYmJlcHB0enJ6aGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MjM1NTEsImV4cCI6MjA3NzE5OTU1MX0.oT3PE6UnbWebRmEywSiHu36ihUShm_Fo0_8xYRTXi_4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
