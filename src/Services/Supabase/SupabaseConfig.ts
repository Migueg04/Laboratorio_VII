import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://zawbaevzsigwjcjoxuda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inphd2JhZXZ6c2lnd2pjam94dWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODAyMTQsImV4cCI6MjA2NDU1NjIxNH0.JVNb5hAolSS97gGnDkrIGOfVMbO_NSk55NXoe6LFz-c';

export const supabase = createClient(supabaseUrl, supabaseKey);