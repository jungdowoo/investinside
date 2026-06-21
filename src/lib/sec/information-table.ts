import "server-only";
import { filingDirectoryUrl, secJson, secText } from "./client";
import type { SecFilingSummary } from "./submissions";
import { isInformationTableXml, parseInformationTable } from "./parser";

type FilingIndex = { directory?: { item?: Array<{ name: string; type?: string; size?: string }> } };

export async function fetchInformationTable(cik: string, filing: SecFilingSummary) {
  const directory = filingDirectoryUrl(cik, filing.accessionNumber);
  const index = await secJson<FilingIndex>(`${directory}/index.json`);
  const items = index.directory?.item ?? [];
  const xmlNames = items
    .map((item) => item.name)
    .filter((name) => name.toLowerCase().endsWith(".xml"))
    .sort((a, b) => score(b, filing.primaryDocument) - score(a, filing.primaryDocument));

  // 일부 제출은 primary document 자체가 information table XML이다.
  if (filing.primaryDocument.toLowerCase().endsWith(".xml") && !xmlNames.includes(filing.primaryDocument)) xmlNames.unshift(filing.primaryDocument);

  for (const name of xmlNames) {
    const url = `${directory}/${name}`;
    const xml = await secText(url);
    if (isInformationTableXml(xml)) return { url, holdings: parseInformationTable(xml) };
  }
  throw new Error(`Information Table XML을 찾지 못했습니다: ${filing.accessionNumber}`);
}

function score(name: string, primaryDocument: string) {
  const lower = name.toLowerCase();
  let result = name === primaryDocument ? 1 : 0;
  if (/infotable|informationtable|form13f/i.test(lower)) result += 8;
  if (/primary_doc|submission|header/i.test(lower)) result -= 4;
  return result;
}
