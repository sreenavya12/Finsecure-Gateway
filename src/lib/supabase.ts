import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kjroxbhcxfmueqcrjazg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqcm94YmhjeGZtdWVxY3JqYXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMjEzMjYsImV4cCI6MjA4NzU5NzMyNn0.48LTVWEAt5ejqUcMW2oZySJeQMDEDHaAfho6ePMrrPY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)