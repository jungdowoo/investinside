import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Building2, CalendarDays } from "lucide-react";
import { DataNotice } from "@/components/data-notice";
import { PortfolioDonutChart } from "@/components/portfolio-donut-chart";
import { InvestorAvatar } from "@/components/investor-avatar";
import { StockLabelLink } from "@/components/stock-label-link";
import { CurrencyNotice } from "@/components/currency-notice";
import { CusipHelp } from "@/components/cusip-help";
import { TickerHelp } from "@/components/ticker-help";
import { Container, EmptyState, Pill } from "@/components/ui";
import { formatDate, formatNumber, formatPercent } from "@/lib/format";
import { formatMoneyDual } from "@/lib/exchange-rate";
import { getInvestorSnapshot } from "@/lib/data/public";
import { formatStockLabel } from "@/lib/stock-labels";
import { INVESTOR_PROFILES } from "@/lib/investor-profiles";
import type { ChangeType } from "@/types/domain";

const labels: Record<ChangeType, string> = { NEW: "신규 편입", EXIT: "보고서 제외", INCREASE: "수량 증가", DECREASE: "수량 감소", UNCHANGED: "변동 없음" };
const tones: Record<ChangeType, "green" | "red" | "blue" | "amber" | "slate"> = { NEW: "green", EXIT: "red", INCREASE: "blue", DECREASE: "amber", UNCHANGED: "slate" };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getInvestorSnapshot(slug);
  return data ? { title: `${data.investor.display_name} 포트폴리오·보유종목`, description: `${data.investor.firm_name}의 SEC Form 13F 공개 공시 기반 포트폴리오, 상위 보유종목과 분기별 변화를 확인하세요.`, keywords: [`${data.investor.investor_name} 포트폴리오`, `${data.investor.display_name} 보유종목`, `${data.investor.firm_name} 13F`, "13F 포트폴리오"], alternates: { canonical: `/investors/${data.investor.slug}` }, openGraph: { title: `${data.investor.display_name} 포트폴리오`, description: `${data.investor.firm_name} SEC 13F 보유종목`, type: "article" } } : {};
}

export default async function InvestorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getInvestorSnapshot(slug);
  if (!data) notFound();
  const { investor, filing, holdings, changes } = data;
  const profile = INVESTOR_PROFILES[investor.slug];
  const totalValue = holdings.reduce((sum, item) => sum + Number(item.value_usd), 0);
  const top = holdings.slice(0, 10);
  const maxWeight = Math.max(...top.map((item) => Number(item.portfolio_weight)), 1);
  const grouped = Object.fromEntries((Object.keys(labels) as ChangeType[]).map((type) => [type, changes.filter((item) => item.change_type === type)])) as Record<ChangeType, typeof changes>;
  const exits = [...grouped.EXIT].sort((a, b) => Number(b.previous_value_usd) - Number(a.previous_value_usd));

  return <Container className="py-10 sm:py-14">
    <div className="rounded-md border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start"><InvestorAvatar slug={investor.slug} name={investor.display_name} className="size-32 rounded-md sm:size-40" /><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-start"><div><div className="flex items-center gap-2 text-sm font-medium text-amber-700"><Building2 className="size-4" /> {profile?.title ?? "관련 운용사 13F 공시"}</div><h1 className="mt-3 text-3xl font-extrabold leading-tight text-zinc-900 sm:text-5xl">{investor.display_name}</h1><p className="mt-3 text-base font-medium text-zinc-500">{investor.firm_name}</p><p className="mt-2 font-mono text-xs text-zinc-400">CIK {investor.cik}</p></div>{filing && <a href={filing.sec_url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium hover:border-zinc-300 hover:bg-zinc-50">SEC 원문 <ArrowUpRight className="size-4" /></a>}</div><p className="mt-6 max-w-4xl text-sm leading-7 text-zinc-500">{profile?.summary ?? investor.description}</p>{profile && <div className="mt-4 flex flex-wrap gap-2">{profile.highlights.map((item) => <Pill key={item}>{item}</Pill>)}</div>}</div></div>
    </div>
    <div className="my-6"><DataNotice compact /></div>
    {filing ? <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="최근 보고 분기" value={formatDate(filing.report_date)} icon={<CalendarDays className="size-5" />} /><Stat label="SEC 제출일" value={formatDate(filing.filing_date)} /><Stat label="보고 종목 수" value={`${holdings.length}개`} /><Stat label="총 보고 가치" value={formatMoneyDual(totalValue)} /></section>
      <div className="mt-3"><CurrencyNotice /></div>
      <section className="mt-10"><h2 className="text-2xl font-extrabold text-zinc-900">포트폴리오 구성</h2><p className="mt-1 text-sm text-zinc-500">13F 정보표의 보고 가치 기준 상위 10개 종목과 기타 종목 비중</p><PortfolioDonutChart holdings={holdings} /></section>
      <section className="mt-10 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <div><h2 className="text-2xl font-extrabold text-zinc-900">상위 보유 종목 TOP 10</h2><p className="mt-1 text-sm text-zinc-500">13F 정보표 보고 가치 합계 기준</p><div className="mt-5 space-y-4">{top.map((holding, index) => <div key={`${holding.cusip}-${index}`}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="truncate font-bold">{index + 1}. <StockLabelLink ticker={holding.ticker} issuerName={holding.issuer_name} /></span><span className="font-mono text-zinc-500">{formatPercent(Number(holding.portfolio_weight))}</span></div><div className="h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-amber-600" style={{ width: `${Math.max(2, Number(holding.portfolio_weight) / maxWeight * 100)}%` }} /></div></div>)}</div></div>
        <div><h2 className="text-2xl font-extrabold text-zinc-900">이전 분기 대비 변화</h2><p className="mt-1 text-sm text-zinc-500">동일 CUSIP·증권 종류의 보고 수량 비교</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{(Object.keys(labels) as ChangeType[]).map((type) => <div key={type} className="rounded-md border border-zinc-200 bg-white p-4"><Pill tone={tones[type]}>{labels[type]}</Pill><p className="mt-3 text-2xl font-extrabold text-zinc-900">{grouped[type].length}</p><p className="text-xs text-zinc-400">종목</p></div>)}</div><div className="mt-4 max-h-72 overflow-auto rounded-md border border-zinc-200 bg-white"><div>{changes.slice(0, 30).map((change) => <div key={`${change.cusip}-${change.change_type}`} className="flex items-center justify-between gap-4 border-b border-zinc-100 p-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-bold"><StockLabelLink ticker={change.ticker} issuerName={change.issuer_name} /></p><p className="mt-0.5 text-xs text-zinc-400">{formatNumber(Number(change.previous_shares))} → {formatNumber(Number(change.current_shares))}</p></div><Pill tone={tones[change.change_type]}>{labels[change.change_type]}</Pill></div>)}</div></div></div>
      </section>
      <section className="mt-12"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-extrabold text-zinc-900">이번 분기 보고서에서 제외된 종목</h2><p className="mt-1 text-sm text-zinc-500">이전 분기에는 있었지만 최신 13F 정보표에는 나타나지 않은 종목</p></div><Pill tone="red">전량 매도 추정 {exits.length}개</Pill></div>{exits.length ? <div className="mt-5 overflow-x-auto rounded-md border border-zinc-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-zinc-50 text-xs text-zinc-500"><tr><Th>종목 / 발행사</Th><Th>CUSIP</Th><Th align="right">이전 수량</Th><Th align="right">이전 보고 가치</Th></tr></thead><tbody>{exits.map((change) => <tr key={`${change.cusip}-${change.issuer_name}`} className="border-t border-zinc-100"><td className="px-4 py-4 font-bold"><StockLabelLink ticker={change.ticker} issuerName={change.issuer_name} /></td><td className="px-4 py-4 font-mono text-xs text-zinc-500">{change.cusip ?? "—"}</td><td className="px-4 py-4 text-right font-mono">{formatNumber(Number(change.previous_shares))}</td><td className="px-4 py-4 text-right font-mono">{formatMoneyDual(Number(change.previous_value_usd))}</td></tr>)}</tbody></table></div> : <EmptyState title="이번 비교에서 제외된 종목이 없습니다" description="비교 가능한 이전 분기와 최신 분기 사이에 완전히 사라진 CUSIP이 없습니다." />}<p className="mt-3 text-xs leading-6 text-zinc-400">‘전량 매도 추정’은 두 공시 스냅숏의 차이를 뜻합니다. 실제 매도 완료를 확정하지 않으며, 수정 공시·보고 범위 변경·증권 식별자 변경 등의 가능성이 있습니다.</p></section>
      <section className="mt-12"><div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-extrabold text-zinc-900">전체 보유 종목</h2><CusipHelp /></div><p className="mt-1 text-sm text-zinc-500">ticker는 SEC 원문에 기본 제공되지 않으며 내부에서 검증된 별칭만 표시합니다.</p><div className="mt-4"><TickerHelp /></div><div className="mt-5 overflow-x-auto rounded-md border border-zinc-200 bg-white"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><Th>종목 / 발행사</Th><Th>CUSIP</Th><Th>종류</Th><Th align="right">보고 가치</Th><Th align="right">수량</Th><Th align="right">비중</Th></tr></thead><tbody>{holdings.map((holding, index) => <tr key={`${holding.cusip}-${holding.title_of_class}-${holding.put_call}-${index}`} className="border-t border-zinc-100"><td className="px-4 py-3"><div className="font-bold">{holding.ticker ? <Link href={`/stocks/${holding.ticker.toLowerCase()}`} className="text-amber-700 hover:underline">{formatStockLabel(holding.ticker, holding.issuer_name)}</Link> : <span className="text-zinc-500">{holding.issuer_name}</span>}</div>{!holding.ticker && <div className="mt-1 text-xs text-zinc-400">ticker 미확인</div>}</td><td className="px-4 py-3 font-mono text-xs text-zinc-500">{holding.cusip}</td><td className="px-4 py-3 text-zinc-500">{holding.title_of_class ?? "—"}{holding.put_call ? ` · ${holding.put_call}` : ""}</td><td className="px-4 py-3 text-right font-mono">{formatMoneyDual(Number(holding.value_usd))}</td><td className="px-4 py-3 text-right font-mono">{formatNumber(Number(holding.shares))}</td><td className="px-4 py-3 text-right font-mono font-bold">{formatPercent(Number(holding.portfolio_weight))}</td></tr>)}</tbody></table></div></section>
      <section className="mt-10 rounded-md border border-zinc-200 bg-white p-6"><h2 className="font-bold text-zinc-900">이 자료를 해석할 때</h2><p className="mt-3 text-sm leading-7 text-zinc-500">{investor.display_name} 개인 계좌가 아니라 {investor.firm_name}이 제출한 13F 정보표입니다. 인물 이름은 관련 공시 운용사를 식별하기 위한 설명이며 해당 인물이나 기관의 제휴·승인·추천을 의미하지 않습니다. 13F는 보고 기준일 이후 지연 공개되며 현금, 공매도, 일부 해외 자산 등 제출 기관의 전체 위험 노출을 보여주지 않습니다. 분기 변화는 공개된 두 스냅숏의 차이일 뿐 실제 거래 날짜나 가격을 나타내지 않습니다.</p></section>
    </> : <EmptyState title="아직 수집된 13F 공시가 없습니다" description="관리자가 SEC 동기화를 실행하면 이 기관의 최신 filing, 보유 종목, 이전 분기 대비 변화가 표시됩니다. 공시가 없다는 뜻이 아니라 현재 서비스 DB에 아직 적재되지 않았다는 뜻입니다." />}
  </Container>;
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <div className="rounded-md border border-zinc-200 bg-white p-5"><div className="flex items-center gap-2 text-sm font-medium text-zinc-500">{icon}{label}</div><p className="mt-3 text-xl font-extrabold text-zinc-900">{value}</p></div>; }
function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) { return <th className={`px-4 py-3 font-bold ${align === "right" ? "text-right" : ""}`}>{children}</th>; }
