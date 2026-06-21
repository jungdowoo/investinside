import type { Holding, Investor, OverlapItem } from "@/types/domain";

export function holdingIdentity(holding: Pick<Holding, "cusip" | "put_call" | "title_of_class">) {
  return [holding.cusip.trim().toUpperCase(), holding.put_call?.trim().toUpperCase() ?? "", holding.title_of_class?.trim().toUpperCase() ?? ""].join("|");
}

export function calculateOverlap(investors: Investor[], holdings: Holding[]): OverlapItem[] {
  const investorMap = new Map(investors.map((item) => [item.id, item]));
  const grouped = new Map<string, OverlapItem>();
  for (const holding of holdings) {
    const investor = investorMap.get(holding.investor_id);
    if (!investor) continue;
    const key = holdingIdentity(holding);
    const current = grouped.get(key) ?? { key, ticker: holding.ticker, cusip: holding.cusip, issuerName: holding.issuer_name, owners: [] };
    const owner = current.owners.find((item) => item.investorId === investor.id);
    if (owner) owner.weight += Number(holding.portfolio_weight ?? 0);
    else current.owners.push({ investorId: investor.id, investorSlug: investor.slug, displayName: investor.display_name, weight: Number(holding.portfolio_weight ?? 0) });
    grouped.set(key, current);
  }
  return [...grouped.values()].filter((item) => item.owners.length >= 2).sort((a, b) => b.owners.length - a.owners.length || a.issuerName.localeCompare(b.issuerName));
}
