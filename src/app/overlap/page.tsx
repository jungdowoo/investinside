import type { Metadata } from "next";
import { DataNotice } from "@/components/data-notice";
import { OverlapExplorer } from "@/components/overlap-explorer";
import { Container, PageHeader } from "@/components/ui";
import { getInvestors, getOverlap } from "@/lib/data/public";

export const metadata: Metadata = { title: "겹치는 종목", description: "여러 13F 제출 기관이 공통 보유한 종목을 CUSIP 기준으로 비교" };
export default async function OverlapPage() { const [investors, items] = await Promise.all([getInvestors(), getOverlap()]); return <Container className="pb-16"><PageHeader eyebrow="Overlap" title="여러 기관이 함께 보유한 종목" description="각 기관의 최신 13F 정보표를 CUSIP과 증권 종류 기준으로 묶습니다. ticker가 없어도 SEC 원본 식별자로 비교합니다." /><DataNotice /><div className="mt-6"><OverlapExplorer investors={investors} items={items} /></div><section className="mt-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-6"><h2 className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">겹친다고 같은 생각은 아닙니다</h2><p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">같은 종목을 보유해도 매입 시점, 가격, 투자 기간, 헤지와 포트폴리오 목적은 기관마다 다릅니다. 이 화면의 비중은 각 기관의 전체 자산이 아니라 해당 13F 정보표 보고 가치 합계 안에서 계산됩니다.</p></section></Container>; }
