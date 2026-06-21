import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Filing, Holding, Investor } from "@/types/domain";
import { fetchInformationTable } from "./information-table";
import { fetchSubmissions, filingDocumentUrl, find13FFilings, type SecFilingSummary } from "./submissions";
import { compareHoldings } from "@/lib/holdings/compare";

export type SyncResult = { investorId: string; investor: string; processed: number; skipped: number; errors: string[] };

export async function syncAllInvestors(investorId?: string): Promise<SyncResult[]> {
  const db = createAdminClient();
  let query = db.from("investors").select("*").eq("is_active", true);
  if (investorId) query = query.eq("id", investorId);
  const { data, error } = await query;
  if (error) throw error;
  const results: SyncResult[] = [];
  for (const investor of (data ?? []) as Investor[]) results.push(await syncInvestor(investor));
  return results;
}

export async function syncInvestor(investor: Investor): Promise<SyncResult> {
  const db = createAdminClient();
  const result: SyncResult = { investorId: investor.id, investor: investor.display_name, processed: 0, skipped: 0, errors: [] };
  try {
    const submissions = await fetchSubmissions(investor.cik);
    const filings = find13FFilings(submissions);
    const { data: knownRows } = await db.from("filings").select("accession_number").eq("investor_id", investor.id);
    const known = new Set((knownRows ?? []).map((row) => row.accession_number as string));
    // 최초 동기화도 과도한 SEC 요청을 피하도록 최근 8개 분기까지만 적재한다.
    for (const filing of filings.slice(0, 8).reverse()) {
      if (known.has(filing.accessionNumber)) { result.skipped += 1; continue; }
      try { await ingestFiling(investor, filing); result.processed += 1; }
      catch (error) { result.errors.push(error instanceof Error ? error.message : String(error)); }
    }
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
  }
  await db.from("admin_logs").insert({ action: result.errors.length ? "SYNC_13F_PARTIAL" : "SYNC_13F_COMPLETE", details: result });
  return result;
}

async function ingestFiling(investor: Investor, summary: SecFilingSummary) {
  const db = createAdminClient();
  const info = await fetchInformationTable(investor.cik, summary);
  const secUrl = filingDocumentUrl(investor.cik, summary);
  const { data: inserted, error } = await db.from("filings").insert({
    investor_id: investor.id, accession_number: summary.accessionNumber, form_type: summary.form,
    filing_date: summary.filingDate, report_date: summary.reportDate, sec_url: secUrl,
    information_table_url: info.url, raw_submission: { cik: investor.cik, name: investor.firm_name, filing: summary, source: "SEC EDGAR" },
  }).select("*").single();
  if (error) throw error;
  const filing = inserted as Filing;
  try {
    const total = info.holdings.reduce((sum, item) => sum + item.value_usd, 0);
    const tickerByCusip = new Map<string, string>();
    const cusips = [...new Set(info.holdings.map((item) => item.cusip).filter(Boolean))];
    // 큰 13F 정보표는 URL 길이와 PostgREST 필터 제한을 넘을 수 있어 나눠 조회한다.
    for (let index = 0; index < cusips.length; index += 300) {
      const { data: aliases, error: aliasError } = await db
        .from("stock_aliases")
        .select("cusip,ticker")
        .in("cusip", cusips.slice(index, index + 300));
      if (aliasError) throw aliasError;
      for (const alias of aliases ?? []) {
        if (alias.ticker) tickerByCusip.set(String(alias.cusip).toUpperCase(), String(alias.ticker).toUpperCase());
      }
    }
    const holdings: Holding[] = info.holdings.map((item) => ({ ...item, filing_id: filing.id, investor_id: investor.id, report_date: summary.reportDate, ticker: tickerByCusip.get(item.cusip) ?? null, portfolio_weight: total ? item.value_usd / total * 100 : 0 }));
    for (let index = 0; index < holdings.length; index += 500) {
      const { error: holdingError } = await db.from("holdings").insert(holdings.slice(index, index + 500));
      if (holdingError) throw holdingError;
    }
    const { data: previousRows } = await db.from("filings").select("*").eq("investor_id", investor.id).lt("report_date", summary.reportDate).order("report_date", { ascending: false }).limit(1);
    const previousFiling = (previousRows?.[0] ?? null) as Filing | null;
    let previous: Holding[] = [];
    if (previousFiling) {
      const { data } = await db.from("holdings").select("*").eq("filing_id", previousFiling.id);
      previous = (data ?? []) as Holding[];
    }
    const changes = compareHoldings({ investorId: investor.id, currentFilingId: filing.id, previousFilingId: previousFiling?.id ?? null, reportDate: summary.reportDate, current: holdings, previous });
    for (let index = 0; index < changes.length; index += 500) {
      const { error: changeError } = await db.from("holding_changes").insert(changes.slice(index, index + 500));
      if (changeError) throw changeError;
    }
  } catch (error) {
    await db.from("filings").delete().eq("id", filing.id);
    throw error;
  }
}
