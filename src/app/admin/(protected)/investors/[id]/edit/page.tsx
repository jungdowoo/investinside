import { notFound } from "next/navigation";
import { InvestorForm } from "@/components/admin/investor-form";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Investor } from "@/types/domain";
export default async function EditInvestorPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { data } = await createAdminClient().from("investors").select("*").eq("id", id).maybeSingle(); if (!data) notFound(); return <><h1 className="text-3xl font-black">투자자 수정</h1><p className="mt-2 mb-6 text-sm text-slate-500">CIK를 바꾸면 이후 동기화 대상이 달라집니다. 기존 filing은 자동 삭제되지 않습니다.</p><InvestorForm investor={data as Investor} /></>; }
