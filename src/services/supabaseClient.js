import { createClient } from "@supabase/supabase-js";

// =========================================
// SUPABASE CONFIGURATION
// =========================================

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

const supabasePublishableKey =
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

// =========================================
// VALIDATE ENVIRONMENT VARIABLES
// =========================================

if (!supabaseUrl) {
    throw new Error(
        "Missing REACT_APP_SUPABASE_URL in .env"
    );
}

if (!supabasePublishableKey) {
    throw new Error(
        "Missing REACT_APP_SUPABASE_PUBLISHABLE_KEY in .env"
    );
}

// =========================================
// CREATE SUPABASE CLIENT
// =========================================

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
);
