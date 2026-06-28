import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHeader, Pill } from "@/components/ui";
import { InvestorAvatar } from "@/components/investor-avatar";
import { getInvestors } from "@/lib/data/public";

export const metadata: Metadata = { title: "투자자", description: "SEC Form 13F 공시를 추적하는 투자자 관련 운용사 목록" };

export default async function InvestorsPage() {
  const investors = await getInvestors();
  return <Container className="pb-16">
    <PageHeader eyebrow="Investors" title="투자자 관련 운용사" description="한국어 이름과 영어 이름을 함께 표시합니다. 실제 수집과 비교는 SEC 제출 기관명과 CIK를 기준으로 합니다." />
    <div className="grid gap-5 md:grid-cols-2">{investors.map((investor) => <Link key={investor.id} href={`/investors/${investor.slug}`} className="group rounded-lg border border-stone-200 bg-white/75 p-5 shadow-sm hover:border-teal-300 hover:bg-white hover:shadow-lg"><div className="flex items-start gap-4"><InvestorAvatar slug={investor.slug} name={investor.display_name} className="size-24 rounded-md" /><div className="min-w-0 flex-1"><div className="flex justify-end"><Pill tone="green">13F 추적</Pill></div><h2 className="mt-3 text-xl font-black text-stone-950 group-hover:text-teal-800">{investor.display_name}</h2><p className="mt-1 truncate text-sm font-semibold text-stone-600">{investor.firm_name}</p></div></div><p className="mt-5 line-clamp-2 text-sm leading-6 text-stone-500">{investor.description}</p><div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs"><span className="font-mono text-stone-400">CIK {investor.cik}</span><span className="flex items-center gap-1 font-bold text-teal-800">포트폴리오 보기 <ArrowRight className="size-4" /></span></div></Link>)}</div>
    <div className="mt-10 rounded-lg border border-sky-200 bg-sky-50 p-6"><h2 className="font-black text-sky-950">표시 기준</h2><p className="mt-2 text-sm leading-6 text-sky-900/75">인물 이름은 관련 운용사를 찾기 위한 한국어(영어) 표기입니다. 실제 포트폴리오 데이터는 각 카드에 표시된 SEC 제출 기관의 공개 Form 13F를 기준으로 합니다.</p></div>
  </Container>;
}
