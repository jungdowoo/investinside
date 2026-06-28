"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Holding } from "@/types/domain";
import { formatPercent } from "@/lib/format";
import { formatStockLabel } from "@/lib/stock-labels";

const COLORS = ["#b45309", "#0369a1", "#4338ca", "#7e22ce", "#be185d", "#c2410c", "#0f766e", "#4d7c0f", "#a16207", "#64748b"];
type Slice = { key: string; ticker: string | null; label: string; weight: number; color: string; start: number };

export function PortfolioDonutChart({ holdings }: { holdings: Holding[] }) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const grouped = new Map<string, { ticker: string | null; label: string; weight: number }>();
  for (const holding of holdings) {
    const key = holding.ticker ?? holding.cusip;
    const current = grouped.get(key);
    grouped.set(key, { ticker: holding.ticker, label: formatStockLabel(holding.ticker, holding.issuer_name), weight: (current?.weight ?? 0) + Number(holding.portfolio_weight) });
  }
  const sorted = [...grouped.entries()].map(([key, item]) => ({ key, ...item })).sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, 10);
  const otherWeight = sorted.slice(10).reduce((sum, item) => sum + item.weight, 0);
  const base = top.map((item, index) => ({ ...item, color: COLORS[index] }));
  if (otherWeight > 0.005) base.push({ key: "other", ticker: null, label: "기타 종목", weight: otherWeight, color: "#d4d4d8" });
  const slices: Slice[] = base.map((slice, index) => ({ ...slice, start: base.slice(0, index).reduce((sum, item) => sum + item.weight, 0) }));
  const active = slices.find((slice) => slice.key === hovered) ?? null;

  return <div className="mt-6 grid items-center gap-8 rounded-md border border-zinc-200 bg-white p-5 sm:p-7 lg:grid-cols-[minmax(260px,.8fr)_1.2fr]">
    <div className="relative mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 200 200" role="img" aria-labelledby="portfolio-chart-title portfolio-chart-desc" className="h-auto w-full">
        <title id="portfolio-chart-title">13F 보고 가치 기준 포트폴리오 구성</title><desc id="portfolio-chart-desc">조각에 마우스를 올리면 종목명과 비중을 확인하고, 클릭하면 종목 상세 페이지로 이동할 수 있습니다.</desc>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#f4f4f5" strokeWidth="31" />
        {slices.map((slice) => { const visibleWeight = Math.max(0, slice.weight - 0.45); const interactive = Boolean(slice.ticker); return <circle key={slice.key} cx="100" cy="100" r="70" fill="none" pathLength="100" stroke={slice.color} strokeWidth={hovered === slice.key ? 35 : 30} strokeDasharray={`${visibleWeight} ${100 - visibleWeight}`} strokeDashoffset={-slice.start} transform="rotate(-90 100 100)" className={`outline-none transition-all duration-150 ${interactive ? "cursor-pointer" : ""}`} tabIndex={interactive ? 0 : -1} role={interactive ? "link" : undefined} aria-label={`${slice.label} ${formatPercent(slice.weight)}`} onMouseEnter={() => setHovered(slice.key)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(slice.key)} onBlur={() => setHovered(null)} onClick={() => slice.ticker && router.push(`/stocks/${slice.ticker.toLowerCase()}`)} onKeyDown={(event) => { if (slice.ticker && (event.key === "Enter" || event.key === " ")) router.push(`/stocks/${slice.ticker.toLowerCase()}`); }} />; })}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div className="max-w-32"><p className="line-clamp-2 text-sm font-bold leading-5 text-zinc-900">{active?.label ?? `${sorted.length}개 종목`}</p><p className="mt-1 text-xs font-medium text-amber-700">{active ? formatPercent(active.weight) : "마우스를 올려보세요"}</p></div></div>
    </div>
    <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2" aria-label="포트폴리오 구성 범례">{slices.map((slice, index) => <li key={slice.key} onMouseEnter={() => setHovered(slice.key)} onMouseLeave={() => setHovered(null)}>{slice.ticker ? <Link href={`/stocks/${slice.ticker.toLowerCase()}`} className="flex min-w-0 items-center gap-3 rounded px-2 py-2 text-sm hover:bg-zinc-50"><Legend slice={slice} index={index} /></Link> : <div className="flex min-w-0 items-center gap-3 px-2 py-2 text-sm"><Legend slice={slice} index={index} /></div>}</li>)}</ol>
  </div>;
}

function Legend({ slice, index }: { slice: Slice; index: number }) { return <><span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} /><span className="min-w-0 flex-1 truncate font-medium"><span className="mr-1 text-zinc-400">{slice.key === "other" ? "" : `${index + 1}.`}</span>{slice.label}</span><span className="shrink-0 font-mono text-xs text-zinc-500">{formatPercent(slice.weight)}</span></>; }
