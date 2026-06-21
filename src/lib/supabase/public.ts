import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "./env";

export function createPublicClient() {
  const { url, key } = getPublicEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 900 } }) },
  });
}
