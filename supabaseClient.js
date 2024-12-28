
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sdbtmvllsjmqvqqbrrgr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnRtdmxsc2ptcXZxcWJycmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjg4NjgsImV4cCI6MjA1MDkwNDg2OH0.4mH-9lkCEbu27yl5VbLFeOe3ei5nBLRnbfPlgyF-dc4'
const supabase = createClient(supabaseUrl, supabaseKey)