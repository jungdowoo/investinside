import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataNotice } from "@/components/data-notice";
import { Container, Pill } from "@/components/ui";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { getStockSnapshot } from "@/lib/data/public";
import { formatStockLabel } from "@/lib/stock-labels";

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  return { title: `${ticker.toUpperCase()} 13F 보유 현황`, description: `${ticker.toUpperCase()} 종목을 보유한 기관의 SEC 13F 공시 정보` };
}

export default async function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = await getStockSnapshot(ticker);
  if (!data) notFound();
  const label = formatStockLabel(data.ticker, data.issuerName);
  return <Container className="py-10 sm:py-14">
    <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-10"><Pill tone="green">SEC 13F 종목</Pill><h1 className="mt-4 text-4xl font-black sm:text-6xl">{label}</h1><p className="mt-3 text-lg text-slate-300">SEC 원문 발행사명: {data.issuerName}</p><p className="mt-2 font-mono text-xs text-slate-500">CUSIP {data.cusip}</p></div>
    <div className="my-6"><DataNotice /></div>
    <section><h2 className="text-2xl font-black">최신 공시 기준 보유 기관</h2><div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3">관련 투자자 / 제출 기관</th><th className="px-4 py-3">보고 기준일</th><th className="px-4 py-3 text-right">수량</th><th className="px-4 py-3 text-right">보고 가치</th><th className="px-4 py-3 text-right">13F 내 비중</th></tr></thead><tbody>{data.owners.map(({ holding, investor, filing }) => <tr key={holding.id ?? `${investor.id}-${holding.cusip}`} className="border-t border-slate-100"><td className="px-4 py-4"><Link href={`/investors/${investor.slug}`} className="font-black text-emerald-700 hover:underline">{investor.display_name}</Link><p className="mt-1 text-xs text-slate-500">{investor.firm_name}</p></td><td className="px-4 py-4 text-slate-600">{formatDate(filing.report_date)}</td><td className="px-4 py-4 text-right font-mono">{formatNumber(Number(holding.shares))}</td><td className="px-4 py-4 text-right font-mono">{formatMoney(Number(holding.value_usd))}</td><td className="px-4 py-4 text-right font-mono font-bold">{formatPercent(Number(holding.portfolio_weight))}</td></tr>)}</tbody></table></div></section>
    <section className="mt-10"><h2 className="text-2xl font-black">분기별 보고 수량</h2><p className="mt-2 text-sm text-slate-500">기관별 13F 스냅숏 기록이며 실제 거래 시점이나 현재 수량을 뜻하지 않습니다.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{data.history.map((holding, index) => { const owner = data.owners.find((item) => item.investor.id === holding.investor_id)?.investor; return <div key={`${holding.filing_id}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="font-bold">{owner?.display_name ?? "제출 기관"}</p><span className="text-xs text-slate-400">{formatDate(holding.report_date)}</span></div><p className="mt-3 text-lg font-black">{formatNumber(Number(holding.shares))} <span className="text-xs font-semibold text-slate-400">{holding.share_type}</span></p></div>; })}</div></section>
    <section className="mt-10 rounded-2xl bg-slate-100 p-6"><h2 className="font-black">종목 화면의 범위</h2><p className="mt-3 text-sm leading-7 text-slate-600">검증된 ticker 별칭과 동일한 SEC 13F 행을 모아 보여줍니다. ticker는 SEC 정보표의 필수 필드가 아니므로 CUSIP 원문도 함께 확인해야 합니다. 보유 기관 수가 많다는 사실은 종목의 우수성이나 향후 수익을 의미하지 않습니다.</p></section>
  </Container>;
}
