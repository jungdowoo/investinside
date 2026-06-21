"use server";

import { redirect } from "next/navigation";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  if (!hasSupabasePublicEnv()) redirect("/admin/login?error=config");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=invalid");
  const db = await createSupabaseServerClient();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect("/admin/login?error=invalid");
  const { data: role } = await db.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!role) { await db.auth.signOut(); redirect("/admin/login?error=unauthorized"); }
  redirect("/admin");
}
