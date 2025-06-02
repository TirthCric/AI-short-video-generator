import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // For frontend (limited permissions)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // For backend (admin privileges, use with caution)

export const supabase = createClient(supabaseUrl, supabaseKey);

// For server-side operations (e.g., in API routes):
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
