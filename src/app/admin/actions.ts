"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { normalizeCik } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncAllInvestors } from "@/lib/sec/sync";

const investorSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), display_name: z.string().min(2), investor_name: z.string().min(2),
  firm_name: z.string().min(2), cik: z.string().regex(/^\d{10}$/), description: z.string().optional(), style: z.string().optional(), is_active: z.boolean(),
});

export async function saveInvestorAction(id: string | null, formData: FormData) {
  const user = await requireAdmin();
  const parsed = investorSchema.safeParse({ slug: String(formData.get("slug") ?? "").trim(), display_name: String(formData.get("display_name") ?? "").trim(), investor_name: String(formData.get("investor_name") ?? "").trim(), firm_name: String(formData.get("firm_name") ?? "").trim(), cik: normalizeCik(String(formData.get("cik") ?? "")), description: String(formData.get("description") ?? "").trim(), style: String(formData.get("style") ?? "").trim(), is_active: formData.get("is_active") === "on" });
  if (!parsed.success) throw new Error("입력값을 확인하세요. CIK는 숫자 10자리, slug는 영문 소문자와 하이픈만 허용합니다.");
  const db = createAdminClient();
  const mutation = id ? db.from("investors").update(parsed.data).eq("id", id) : db.from("investors").insert(parsed.data);
  const { error } = await mutation; if (error) throw error;
  await db.from("admin_logs").insert({ action: id ? "INVESTOR_UPDATED" : "INVESTOR_CREATED", details: { actor: user.email, investor_id: id, slug: parsed.data.slug } });
  revalidatePath("/"); revalidatePath("/investors"); redirect("/admin/investors");
}

export async function toggleInvestorAction(id: string, active: boolean) {
  const user = await requireAdmin(); const db = createAdminClient();
  const { error } = await db.from("investors").update({ is_active: active }).eq("id", id); if (error) throw error;
  await db.from("admin_logs").insert({ action: "INVESTOR_STATUS_CHANGED", details: { actor: user.email, investor_id: id, is_active: active } });
  revalidatePath("/"); revalidatePath("/investors"); revalidatePath("/admin/investors");
}

export async function syncInvestorAction(id: string) {
  const user = await requireAdmin(); const results = await syncAllInvestors(id); const db = createAdminClient();
  await db.from("admin_logs").insert({ action: "MANUAL_SYNC", details: { actor: user.email, results } });
  revalidatePath("/"); revalidatePath("/investors"); revalidatePath("/admin/sync-logs");
}

export async function syncAllAction() {
  const user = await requireAdmin(); const results = await syncAllInvestors(); const db = createAdminClient();
  await db.from("admin_logs").insert({ action: "MANUAL_SYNC_ALL", details: { actor: user.email, results } });
  revalidatePath("/"); revalidatePath("/investors"); revalidatePath("/overlap"); revalidatePath("/admin/sync-logs");
}

export async function recollectLatestAction(id: string) {
  const user = await requireAdmin(); const db = createAdminClient();
  const { data: latest } = await db
    .from("filings")
    .select("id,accession_number")
    .eq("investor_id", id)
    .order("report_date", { ascending: false })
    .order("filing_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latest) throw new Error("재수집할 filing이 없습니다.");
  const { error } = await db.from("filings").delete().eq("id", latest.id); if (error) throw error;
  const results = await syncAllInvestors(id);
  await db.from("admin_logs").insert({ action: "LATEST_FILING_RECOLLECTED", details: { actor: user.email, investor_id: id, accession_number: latest.accession_number, results } });
  revalidatePath("/"); revalidatePath("/investors"); revalidatePath("/admin/sync-logs");
}

export async function signOutAction() { await requireAdmin(); const db = await createSupabaseServerClient(); await db.auth.signOut(); redirect("/admin/login"); }
