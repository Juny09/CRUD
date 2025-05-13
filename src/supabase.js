
// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://smfdzomhxhjmhpwxfcxx.supabase.co' // replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmR6b21oeGhqbWhwd3hmY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTEwOTEsImV4cCI6MjA2MjI2NzA5MX0.qzrk2Mj8d2MVDspfuMhPoIPFAK_OlyfJIcFyOI_QAlo' // replace with your anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey)
