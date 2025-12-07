import { createClient } from "@supabase/supabase-js";

// Debug logs (you can keep for verification)
console.log("SUPABASE_URL =>", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
    "SERVICE_ROLE_KEY_EXISTS =>",
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
if (!supabaseKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
