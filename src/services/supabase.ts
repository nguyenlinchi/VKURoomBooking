import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nznwewmshnjksgpenvqf.supabase.co";

const supabaseKey = "sb_publishable_-jY3SIYVcaq0OwU83e9Cnw_evuehWRd";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);