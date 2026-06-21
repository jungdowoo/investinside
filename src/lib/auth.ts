import "server-only";
import { redirect } from "next/navigation";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!hasSupabasePublicEnv()) redirect("/admin/login?error=config");
  const db = await createSupabaseServerClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: role } = await db.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!role) redirect("/admin/login?error=unauthorized");
  return user;
}
