import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { Container, PageHeader, Pill } from "@/components/ui";
import { getInvestors } from "@/lib/data/public";

export const metadata: Metadata = { title: "투자자", description: "SEC Form 13F 공시를 추적하는 투자자 관련 운용사 목록" };

export default async function InvestorsPage() {
  const investors = await getInvestors();
  return <Container className="pb-16">
    <PageHeader eyebrow="Investors" title="투자자 관련 운용사" description="한국어 이름과 영어 이름을 함께 표시합니다. 실제 수집과 비교는 SEC 제출 기관명과 CIK를 기준으로 합니다." />
    <div className="grid gap-5 md:grid-cols-2">{investors.map((investor) => <Link key={investor.id} href={`/investors/${investor.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300"><div className="flex items-start justify-between gap-4"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Building2 className="size-6" /></div><Pill tone="green">13F 추적</Pill></div><h2 className="mt-6 text-2xl font-black group-hover:text-emerald-700">{investor.display_name}</h2><p className="mt-2 font-semibold text-slate-600">{investor.firm_name}</p><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{investor.description}</p><div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs"><span className="font-mono text-slate-400">CIK {investor.cik}</span><span className="flex items-center gap-1 font-bold text-emerald-700">공시 보기 <ArrowRight className="size-4" /></span></div></Link>)}</div>
    <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6"><h2 className="font-black text-blue-950">표시 기준</h2><p className="mt-2 text-sm leading-6 text-blue-900/75">인물 이름은 관련 운용사를 찾기 위한 한국어(영어) 표기입니다. 실제 포트폴리오 데이터는 각 카드에 표시된 SEC 제출 기관의 공개 Form 13F를 기준으로 합니다.</p></div>
  </Container>;
}
