import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and public API key
const SUPABASE_URL = 'https://bmlpihgcqfxipefhatgf.supabase.co';
const SUPABASE_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHBpaGdjcWZ4aXBlZmhhdGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5MDE2MTEsImV4cCI6MjAzNzQ3NzYxMX0.X7R0bSfT9LhrACF3K0khFn6eQnZ0ikGWb5eHPNqNf4o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);