import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
type FactRow = { val: number; end: string; filed: string; form: string; fy?: number; fp?: string };
type FactDefinition = { units?: Record<string, FactRow[]> };
const metricSpecs = {
  revenue: { label: "매출", unit: "USD", tags: ["RevenueFromContractWithCustomerExcludingAssessedTax", "Revenues", "SalesRevenueNet"] },
  operatingIncome: { label: "영업이익", unit: "USD", tags: ["OperatingIncomeLoss"] },
  netIncome: { label: "순이익", unit: "USD", tags: ["NetIncomeLoss"] },
  assets: { label: "총자산", unit: "USD", tags: ["Assets"] },
  liabilities: { label: "총부채", unit: "USD", tags: ["Liabilities"] },
  equity: { label: "자본", unit: "USD", tags: ["StockholdersEquity", "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"] },
  epsDiluted: { label: "희석 EPS", unit: "USD/shares", tags: ["EarningsPerShareDiluted"] },
  dividendPerShare: { label: "주당 배당금", unit: "USD/shares", tags: ["CommonStockDividendsPerShareDeclared", "CommonStockDividendsPerShareCashPaid"] },
  dividendsPaid: { label: "보통주 배당 지급액", unit: "USD", tags: ["PaymentsOfDividendsCommonStock", "PaymentsOfDividends"] },
  operatingCashFlow: { label: "영업현금흐름", unit: "USD", tags: ["NetCashProvidedByUsedInOperatingActivities"] },
} as const;

function env(name: string) { const value = process.env[name]?.trim(); if (!value) throw new Error(`${name} is required`); return value; }

async function main() {
  const existing = JSON.parse(await readFile("src/data/sec-company-facts.json", "utf8")) as Record<string, { cik: string }>;
  const tickers = Object.keys(existing).sort();
  const browser = await chromium.launch({ executablePath, headless: false });
  const output: Record<string, unknown> = { ...existing };
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ from: env("SEC_USER_AGENT"), accept: "application/json" });
    for (const ticker of tickers) {
      const cik = existing[ticker]?.cik;
      if (!cik) { console.log(`Skip ${ticker}: no stored SEC CIK`); continue; }
      try {
        const response = await page.goto(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, { waitUntil: "domcontentloaded", timeout: 60_000 });
        if (!response?.ok()) { console.log(`Skip ${ticker}: companyfacts ${response?.status()}`); continue; }
        const payload = JSON.parse((await response.body()).toString("utf8"));
        const metrics: Record<string, unknown> = {};
        for (const [key, spec] of Object.entries(metricSpecs)) {
          const metric = extractMetric(payload.facts?.["us-gaap"], spec);
          if (metric) metrics[key] = metric;
        }
        output[ticker] = { ticker, cik, entityName: payload.entityName, sic: payload.sic, sicDescription: payload.sicDescription, stateOfIncorporation: payload.stateOfIncorporation, fiscalYearEnd: payload.fiscalYearEnd, metrics };
        console.log(`Collected ${ticker}: ${Object.keys(metrics).length} metrics`);
      } catch (error) {
        console.log(`Skip ${ticker}: ${error instanceof Error ? error.message : error}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  } finally { await browser.close(); }
  await writeFile("src/data/sec-company-facts.json", `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Saved ${Object.keys(output).length} SEC company profiles.`);
}

function extractMetric(facts: Record<string, FactDefinition> | undefined, spec: { label: string; unit: string; tags: readonly string[] }) {
  const fact = spec.tags.map((tag) => facts?.[tag]).find(Boolean);
  const rows = fact?.units?.[spec.unit];
  if (!Array.isArray(rows)) return null;
  const filtered = rows.filter((row) => Number.isFinite(row.val) && row.end && row.filed && (row.form === "10-K" || row.form === "10-Q")).sort((a, b) => String(b.filed).localeCompare(String(a.filed)) || String(b.end).localeCompare(String(a.end)));
  const unique = new Map<string, FactRow>();
  for (const row of filtered) { const key = `${row.end}-${row.form}-${row.fp ?? ""}`; if (!unique.has(key)) unique.set(key, { end: row.end, filed: row.filed, form: row.form, fy: row.fy, fp: row.fp, val: row.val }); }
  const values = [...unique.values()].slice(0, 5);
  return values.length ? { label: spec.label, unit: spec.unit, values } : null;
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
