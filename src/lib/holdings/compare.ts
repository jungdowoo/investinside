import type { Holding, HoldingChange } from "@/types/domain";
import { holdingIdentity } from "./overlap";

type Comparable = Pick<Holding, "cusip" | "ticker" | "issuer_name" | "title_of_class" | "put_call" | "shares" | "value_usd">;

function aggregate(rows: Comparable[]) {
  const map = new Map<string, Comparable>();
  for (const row of rows) {
    const key = holdingIdentity(row);
    const current = map.get(key);
    if (current) { current.shares += Number(row.shares); current.value_usd += Number(row.value_usd); }
    else map.set(key, { ...row, shares: Number(row.shares), value_usd: Number(row.value_usd) });
  }
  return map;
}

export function compareHoldings({ investorId, currentFilingId, previousFilingId, reportDate, current, previous }: {
  investorId: string; currentFilingId: string; previousFilingId: string | null; reportDate: string; current: Comparable[]; previous: Comparable[];
}): HoldingChange[] {
  const currentMap = aggregate(current);
  const previousMap = aggregate(previous);
  const keys = new Set([...currentMap.keys(), ...previousMap.keys()]);
  return [...keys].map((key) => {
    const now = currentMap.get(key);
    const before = previousMap.get(key);
    const previousShares = before?.shares ?? 0;
    const currentShares = now?.shares ?? 0;
    const shareChange = currentShares - previousShares;
    const changeType = !before ? "NEW" : !now ? "EXIT" : shareChange > 0 ? "INCREASE" : shareChange < 0 ? "DECREASE" : "UNCHANGED";
    return {
      investor_id: investorId,
      current_filing_id: currentFilingId,
      previous_filing_id: previousFilingId,
      ticker: now?.ticker ?? before?.ticker ?? null,
      cusip: now?.cusip ?? before?.cusip ?? "",
      issuer_name: now?.issuer_name ?? before?.issuer_name ?? "",
      change_type: changeType,
      previous_shares: previousShares,
      current_shares: currentShares,
      share_change: shareChange,
      share_change_percent: previousShares === 0 ? null : (shareChange / previousShares) * 100,
      previous_value_usd: before?.value_usd ?? 0,
      current_value_usd: now?.value_usd ?? 0,
      value_change_usd: (now?.value_usd ?? 0) - (before?.value_usd ?? 0),
      report_date: reportDate,
    } satisfies HoldingChange;
  });
}
