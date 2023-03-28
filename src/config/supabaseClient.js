import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.REACT_APP_SUPABASE,
  process.env.REACT_APP_SBKEY
);

export default supabaseClient;
