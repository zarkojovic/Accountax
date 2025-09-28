import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hncmkmlzgohbuntnjfzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY21rbWx6Z29oYnVudG5qZnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NzEyMjksImV4cCI6MjA1OTM0NzIyOX0.-JWl29HI2lmzrLbaRAhHKCW3B-T1HaHvH-hnPjmdtpY';

export const supabase = createClient(supabaseUrl, supabaseKey);
