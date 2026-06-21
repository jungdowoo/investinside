import companyFacts from "@/data/sec-company-facts.json";

export type FinancialValue = { end: string; filed: string; form: string; fy?: number; fp?: string; val: number };
export type FinancialMetric = { label: string; unit: "USD" | "USD/shares"; values: FinancialValue[] };
export type CompanyFactsProfile = { ticker: string; cik: string; entityName: string; sic?: string; sicDescription?: string; stateOfIncorporation?: string; fiscalYearEnd?: string; metrics: Record<string, FinancialMetric> };

export function getCompanyFacts(ticker: string): CompanyFactsProfile | null {
  return (companyFacts as Record<string, CompanyFactsProfile>)[ticker.toUpperCase()] ?? null;
}
