import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://razcwyevaudpyiepxodj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhemN3eWV2YXVkcHlpZXB4b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTg4OTAsImV4cCI6MjA4NjAzNDg5MH0.jh_SfbpXMRAk6OGZ6Ge7TB0A62aWHMqQHWdGgMi46jI";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
