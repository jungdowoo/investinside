"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { EmptyState, Pill } from "@/components/ui";
import { formatPercent } from "@/lib/format";
import { formatStockLabel } from "@/lib/stock-labels";
import type { Investor, OverlapItem } from "@/types/domain";

export function OverlapExplorer({ investors, items }: { investors: Investor[]; items: OverlapItem[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const visible = useMemo(() => selected.length < 2 ? items : items.filter((item) => selected.every((id) => item.owners.some((owner) => owner.investorId === id))), [items, selected]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <>
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5"><div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100"><Filter className="size-5 text-amber-600" /> 투자자 선택 필터</div><p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">2명 이상 선택하면 선택한 기관이 모두 보유한 종목만 표시합니다.</p><div className="mt-4 flex flex-wrap gap-2">{investors.map((investor) => <button key={investor.id} type="button" onClick={() => toggle(investor.id)} className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-colors ${selected.includes(investor.id) ? "border-zinc-900 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:bg-zinc-800/50"}`}>{investor.display_name}</button>)}</div>{selected.length === 1 && <p className="mt-3 text-xs font-medium text-amber-700">공통 보유를 계산하려면 한 명을 더 선택하세요.</p>}</div>
    {visible.length ? <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500 dark:text-zinc-400"><tr><th className="px-4 py-3">종목 / 발행사</th><th className="px-4 py-3">CUSIP</th><th className="px-4 py-3 text-center">기관 수</th><th className="px-4 py-3">보유 기관과 13F 내 비중</th></tr></thead><tbody>{visible.map((item) => <tr key={item.key} className="border-t border-zinc-100 dark:border-zinc-800/50 align-top"><td className="px-4 py-4"><p className="font-semibold">{item.ticker ? <Link href={`/stocks/${item.ticker.toLowerCase()}`} className="text-zinc-900 dark:text-zinc-100 hover:text-amber-700 hover:underline">{formatStockLabel(item.ticker, item.issuerName)}</Link> : <span className="text-zinc-600 dark:text-zinc-400">{item.issuerName}</span>}</p>{!item.ticker && <p className="mt-1 text-xs text-zinc-400">ticker 미확인</p>}</td><td className="px-4 py-4 font-mono text-xs text-zinc-400">{item.cusip}</td><td className="px-4 py-4 text-center"><Pill tone="blue">{item.owners.length}</Pill></td><td className="px-4 py-4"><div className="flex flex-wrap gap-2">{item.owners.map((owner) => <Link key={owner.investorId} href={`/investors/${owner.investorSlug}`} className="rounded bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 hover:text-amber-800">{owner.displayName} · {formatPercent(owner.weight)}</Link>)}</div></td></tr>)}</tbody></table></div> : <div className="mt-6"><EmptyState title="조건에 맞는 공통 보유 종목이 없습니다" description="선택을 줄이거나 더 많은 기관의 최신 13F를 동기화한 뒤 다시 확인하세요." /></div>}
  </>;
}
