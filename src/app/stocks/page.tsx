import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { formatMoneyDual } from "@/lib/exchange-rate";
import { searchStocks } from "@/lib/data/public";
import { formatStockLabel } from "@/lib/stock-labels";

export const metadata: Metadata = { title: "종목", description: "최신 SEC 13F 정보표에 나타난 종목 검색" };

export default async function StocksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const stocks = await searchStocks(q);
  return <Container className="pb-16">
    <PageHeader eyebrow="Stocks" title="13F 보유 종목 찾기" description="실시간 시세 검색이 아닙니다. 현재 서비스에 수집된 최신 SEC 13F 정보표의 ticker, 발행사명, CUSIP을 검색합니다." />
    <form className="relative max-w-2xl"><Search className="absolute left-4 top-3.5 size-5 text-zinc-400" /><input name="q" defaultValue={q} placeholder="예: 애플, AAPL, CUSIP" className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-3 pl-12 pr-28 text-zinc-800 dark:text-zinc-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /><button className="absolute right-2 top-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">검색</button></form>
    <div className="mt-6">{stocks.length ? <div className="grid gap-3 md:grid-cols-2">{stocks.map((stock) => stock.ticker ? <Link key={`${stock.ticker}-${stock.cusip}`} href={`/stocks/${stock.ticker.toLowerCase()}`} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5 hover:border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:bg-zinc-800/50"><div className="flex justify-between gap-4"><div><p className="text-lg font-bold text-amber-700">{formatStockLabel(stock.ticker, stock.issuer_name)}</p><p className="mt-2 font-mono text-xs text-zinc-400">CUSIP {stock.cusip}</p></div><p className="text-right text-sm font-medium text-zinc-500 dark:text-zinc-400">{formatMoneyDual(Number(stock.value_usd))}</p></div></Link> : <div key={`cusip-${stock.cusip}`} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5"><p className="font-bold text-zinc-800 dark:text-zinc-200">{stock.issuer_name}</p><p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">ticker 미확인 · CUSIP {stock.cusip}</p></div>)}</div> : <EmptyState title={q ? "검색 결과가 없습니다" : "수집된 종목이 아직 없습니다"} description="ticker는 13F 원문에 기본 제공되지 않습니다. 검증된 ticker 별칭이 있는 종목은 상세 페이지로 연결됩니다." />}</div>
  </Container>;
}
