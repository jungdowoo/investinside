import type { Holding } from "@/types/domain";
import { formatPercent } from "@/lib/format";
import { formatStockLabel } from "@/lib/stock-labels";

const COLORS = [
  "#059669",
  "#0d9488",
  "#0891b2",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#c026d3",
  "#db2777",
  "#ea580c",
  "#ca8a04",
];

type Slice = { key: string; label: string; weight: number; color: string };

export function PortfolioDonutChart({ holdings }: { holdings: Holding[] }) {
  const grouped = new Map<string, { label: string; weight: number }>();
  for (const holding of holdings) {
    const key = holding.ticker ?? holding.cusip;
    const current = grouped.get(key);
    grouped.set(key, {
      label: formatStockLabel(holding.ticker, holding.issuer_name),
      weight: (current?.weight ?? 0) + Number(holding.portfolio_weight),
    });
  }

  const sorted = [...grouped.entries()]
    .map(([key, item]) => ({ key, ...item }))
    .sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, 10);
  const otherWeight = sorted.slice(10).reduce((sum, item) => sum + item.weight, 0);
  const slices: Slice[] = top.map((item, index) => ({ ...item, color: COLORS[index] }));
  if (otherWeight > 0.005) slices.push({ key: "other", label: "기타 종목", weight: otherWeight, color: "#cbd5e1" });
  const chartSlices = slices.map((slice, index) => ({
    ...slice,
    start: slices.slice(0, index).reduce((sum, item) => sum + item.weight, 0),
  }));
  return <div className="mt-6 grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(240px,.8fr)_1.2fr]">
    <div className="mx-auto w-full max-w-[320px]">
      <svg viewBox="0 0 200 200" role="img" aria-labelledby="portfolio-chart-title portfolio-chart-desc" className="h-auto w-full">
        <title id="portfolio-chart-title">13F 보고 가치 기준 포트폴리오 구성</title>
        <desc id="portfolio-chart-desc">상위 10개 보유 종목과 나머지 종목의 보고 가치 비중을 나타낸 도넛 차트</desc>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" strokeWidth="30" />
        {chartSlices.map((slice) => {
          const visibleWeight = Math.max(0, slice.weight - 0.45);
          return <circle
            key={slice.key}
            cx="100"
            cy="100"
            r="70"
            fill="none"
            pathLength="100"
            stroke={slice.color}
            strokeWidth="30"
            strokeDasharray={`${visibleWeight} ${100 - visibleWeight}`}
            strokeDashoffset={-slice.start}
            transform="rotate(-90 100 100)"
          />;
        })}
        <text x="100" y="94" textAnchor="middle" className="fill-slate-950 text-[18px] font-black">{sorted.length}</text>
        <text x="100" y="113" textAnchor="middle" className="fill-slate-500 text-[9px] font-bold">보고 종목</text>
      </svg>
    </div>
    <ol className="grid gap-x-6 gap-y-3 sm:grid-cols-2" aria-label="포트폴리오 구성 범례">
      {slices.map((slice, index) => <li key={slice.key} className="flex min-w-0 items-center gap-3 text-sm">
        <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
        <span className="min-w-0 flex-1 truncate font-bold"><span className="mr-1 text-slate-400">{slice.key === "other" ? "" : `${index + 1}.`}</span>{slice.label}</span>
        <span className="shrink-0 font-mono text-xs text-slate-500">{formatPercent(slice.weight)}</span>
      </li>)}
    </ol>
  </div>;
}
