import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "./env";

export async function createSupabaseServerClient() {
  const { url, key } = getPublicEnv();
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Component에서는 쿠키 쓰기가 허용되지 않는다. Route/Action에서 갱신된다.
        }
      },
    },
  });
}
