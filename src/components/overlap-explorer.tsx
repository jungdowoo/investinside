"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { EmptyState, Pill } from "@/components/ui";
import { formatPercent } from "@/lib/format";
import type { Investor, OverlapItem } from "@/types/domain";

export function OverlapExplorer({ investors, items }: { investors: Investor[]; items: OverlapItem[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const visible = useMemo(() => selected.length < 2 ? items : items.filter((item) => selected.every((id) => item.owners.some((owner) => owner.investorId === id))), [items, selected]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <><div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 font-black"><Filter className="size-5 text-emerald-600" /> 투자자 선택 필터</div><p className="mt-1 text-sm text-slate-500">2명 이상 선택하면 선택한 기관이 모두 보유한 종목만 표시합니다.</p><div className="mt-4 flex flex-wrap gap-2">{investors.map((investor) => <button key={investor.id} type="button" onClick={() => toggle(investor.id)} className={`rounded-full border px-3 py-2 text-sm font-bold ${selected.includes(investor.id) ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400"}`}>{investor.display_name}</button>)}</div>{selected.length === 1 && <p className="mt-3 text-xs font-semibold text-amber-700">공통 보유를 계산하려면 한 명을 더 선택하세요.</p>}</div>
    {visible.length ? <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3">종목 / 발행사</th><th className="px-4 py-3">CUSIP</th><th className="px-4 py-3 text-center">기관 수</th><th className="px-4 py-3">보유 기관과 13F 내 비중</th></tr></thead><tbody>{visible.map((item) => <tr key={item.key} className="border-t border-slate-100 align-top"><td className="px-4 py-4"><p className="font-black">{item.ticker ? <Link href={`/stocks/${item.ticker.toLowerCase()}`} className="text-emerald-700 hover:underline">{item.ticker}</Link> : <span className="text-slate-400">ticker_unknown</span>}</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{item.issuerName}</p></td><td className="px-4 py-4 font-mono text-xs text-slate-500">{item.cusip}</td><td className="px-4 py-4 text-center"><Pill tone="blue">{item.owners.length}</Pill></td><td className="px-4 py-4"><div className="flex flex-wrap gap-2">{item.owners.map((owner) => <Link key={owner.investorId} href={`/investors/${owner.investorSlug}`} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">{owner.displayName} · {formatPercent(owner.weight)}</Link>)}</div></td></tr>)}</tbody></table></div> : <div className="mt-6"><EmptyState title="조건에 맞는 공통 보유 종목이 없습니다" description="선택을 줄이거나, 더 많은 기관의 최신 13F를 동기화한 뒤 다시 확인하세요." /></div>}</>;
}
