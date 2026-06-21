import "server-only";
import { filingDirectoryUrl, secJson, submissionsUrl } from "./client";

type RecentFilings = {
  accessionNumber?: string[];
  filingDate?: string[];
  reportDate?: string[];
  form?: string[];
  primaryDocument?: string[];
  primaryDocDescription?: string[];
};

export type SecFilingSummary = {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
};

export type SecSubmissions = {
  cik: string;
  name: string;
  filings: { recent: RecentFilings; files?: Array<{ name: string; filingCount: number; filingFrom: string; filingTo: string }> };
};

export async function fetchSubmissions(cik: string) {
  return secJson<SecSubmissions>(submissionsUrl(cik));
}

export function find13FFilings(submissions: SecSubmissions): SecFilingSummary[] {
  const recent = submissions.filings.recent;
  return (recent.accessionNumber ?? []).map((accessionNumber, index) => ({
    accessionNumber,
    filingDate: recent.filingDate?.[index] ?? "",
    reportDate: recent.reportDate?.[index] ?? "",
    form: recent.form?.[index] ?? "",
    primaryDocument: recent.primaryDocument?.[index] ?? "",
    primaryDocDescription: recent.primaryDocDescription?.[index] ?? "",
  })).filter((filing) => filing.form === "13F-HR" || filing.form === "13F-HR/A");
}

export function filingDocumentUrl(cik: string, filing: SecFilingSummary) {
  return `${filingDirectoryUrl(cik, filing.accessionNumber)}/${filing.primaryDocument}`;
}
