import "server-only";
import { cache } from "react";
import { BERKSHIRE_SEED } from "@/lib/config";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Filing, Holding, HoldingChange, Investor, InvestorSnapshot, OverlapItem } from "@/types/domain";
import { calculateOverlap } from "@/lib/holdings/overlap";

function warn(error: unknown) {
  if (process.env.NODE_ENV !== "production") console.warn("FolioInside data query:", error);
}

type PublicClient = ReturnType<typeof createPublicClient>;
const PAGE_SIZE = 1000;

async function getHoldingsByFilingIds(db: PublicClient, filingIds: string[], orderByValue = false): Promise<Holding[]> {
  if (!filingIds.length) return [];
  const rows: Holding[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = db.from("holdings").select("*").in("filing_id", filingIds);
    query = orderByValue
      ? query.order("value_usd", { ascending: false }).order("id", { ascending: true })
      : query.order("id", { ascending: true });
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as Holding[]));
    if ((data?.length ?? 0) < PAGE_SIZE) break;
  }
  return rows;
}

async function getChangesByFilingId(db: PublicClient, filingId: string): Promise<HoldingChange[]> {
  const rows: HoldingChange[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await db
      .from("holding_changes")
      .select("*")
      .eq("current_filing_id", filingId)
      .order("current_value_usd", { ascending: false })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as HoldingChange[]));
    if ((data?.length ?? 0) < PAGE_SIZE) break;
  }
  return rows;
}

export const getInvestors = cache(async (): Promise<Investor[]> => {
  if (!hasSupabasePublicEnv()) return [BERKSHIRE_SEED];
  const { data, error } = await createPublicClient().from("investors").select("*").eq("is_active", true).order("display_name");
  if (error) { warn(error); return [BERKSHIRE_SEED]; }
  return (data ?? []) as Investor[];
});

export const getRecentFilings = cache(async (limit = 8): Promise<Array<Filing & { investor?: Pick<Investor, "display_name" | "slug" | "firm_name"> }>> => {
  if (!hasSupabasePublicEnv()) return [];
  const { data, error } = await createPublicClient().from("filings").select("*, investor:investors(display_name,slug,firm_name)").order("filing_date", { ascending: false }).limit(limit);
  if (error) { warn(error); return []; }
  return (data ?? []) as Array<Filing & { investor?: Pick<Investor, "display_name" | "slug" | "firm_name"> }>;
});

export const getInvestorSnapshot = cache(async (slug: string): Promise<InvestorSnapshot | null> => {
  const fallback = slug === BERKSHIRE_SEED.slug ? BERKSHIRE_SEED : null;
  if (!hasSupabasePublicEnv()) return fallback ? { investor: fallback, filing: null, previousFiling: null, holdings: [], changes: [] } : null;
  const db = createPublicClient();
  const { data: investorData, error } = await db.from("investors").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (error || !investorData) return fallback ? { investor: fallback, filing: null, previousFiling: null, holdings: [], changes: [] } : null;
  const investor = investorData as Investor;
  const { data: filingData } = await db
    .from("filings")
    .select("*")
    .eq("investor_id", investor.id)
    .order("report_date", { ascending: false })
    .order("filing_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(2);
  const filings = (filingData ?? []) as Filing[];
  const filing = filings[0] ?? null;
  if (!filing) return { investor, filing: null, previousFiling: null, holdings: [], changes: [] };
  const [holdings, changes] = await Promise.all([
    getHoldingsByFilingIds(db, [filing.id], true),
    getChangesByFilingId(db, filing.id),
  ]);
  return { investor, filing, previousFiling: filings[1] ?? null, holdings, changes };
});

export const getLatestHoldings = cache(async (): Promise<{ investors: Investor[]; filings: Filing[]; holdings: Holding[] }> => {
  const investors = await getInvestors();
  if (!hasSupabasePublicEnv() || investors.length === 0) return { investors, filings: [], holdings: [] };
  const db = createPublicClient();
  const ids = investors.map((item) => item.id);
  const { data: filingRows, error } = await db
    .from("filings")
    .select("*")
    .in("investor_id", ids)
    .order("report_date", { ascending: false })
    .order("filing_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) { warn(error); return { investors, filings: [], holdings: [] }; }
  const latest = new Map<string, Filing>();
  for (const filing of (filingRows ?? []) as Filing[]) if (!latest.has(filing.investor_id)) latest.set(filing.investor_id, filing);
  const filings = [...latest.values()];
  if (!filings.length) return { investors, filings, holdings: [] };
  try {
    const holdings = await getHoldingsByFilingIds(db, filings.map((item) => item.id));
    return { investors, filings, holdings };
  } catch (holdingsError) {
    warn(holdingsError);
    return { investors, filings, holdings: [] };
  }
});

export const getOverlap = cache(async (): Promise<OverlapItem[]> => {
  const { investors, holdings } = await getLatestHoldings();
  return calculateOverlap(investors, holdings);
});

export const getRecentNewPositions = cache(async (limit = 8): Promise<Array<HoldingChange & { investor?: Pick<Investor, "display_name" | "slug"> }>> => {
  if (!hasSupabasePublicEnv()) return [];
  const { data, error } = await createPublicClient().from("holding_changes").select("*, investor:investors(display_name,slug)").eq("change_type", "NEW").order("report_date", { ascending: false }).order("current_value_usd", { ascending: false }).limit(limit);
  if (error) { warn(error); return []; }
  return (data ?? []) as Array<HoldingChange & { investor?: Pick<Investor, "display_name" | "slug"> }>;
});

export const getStockSnapshot = cache(async (ticker: string) => {
  const normalized = ticker.toUpperCase();
  const latest = await getLatestHoldings();
  const holdings = latest.holdings.filter((item) => item.ticker?.toUpperCase() === normalized);
  if (!holdings.length) return null;
  const investorMap = new Map(latest.investors.map((item) => [item.id, item]));
  const filingMap = new Map(latest.filings.map((item) => [item.id, item]));
  const owners = holdings.map((holding) => ({ holding, investor: investorMap.get(holding.investor_id)!, filing: filingMap.get(holding.filing_id)! })).filter((item) => item.investor && item.filing);
  let history: Holding[] = [];
  if (hasSupabasePublicEnv()) {
    const { data } = await createPublicClient().from("holdings").select("*").ilike("ticker", normalized).order("report_date", { ascending: false }).limit(40);
    history = (data ?? []) as Holding[];
  }
  return { ticker: normalized, issuerName: holdings[0].issuer_name, cusip: holdings[0].cusip, owners, history };
});

export const searchStocks = cache(async (query = "") => {
  const { holdings } = await getLatestHoldings();
  const needle = query.trim().toLowerCase();
  const unique = new Map<string, Holding>();
  for (const holding of holdings) {
    if (needle && !holding.issuer_name.toLowerCase().includes(needle) && !holding.ticker?.toLowerCase().includes(needle) && !holding.cusip.toLowerCase().includes(needle)) continue;
    unique.set(holding.ticker ?? `cusip:${holding.cusip}`, holding);
  }
  return [...unique.values()].sort((a, b) => b.value_usd - a.value_usd).slice(0, 100);
});
