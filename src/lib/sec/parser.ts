import "server-only";
import { XMLParser } from "fast-xml-parser";
import type { Holding } from "@/types/domain";

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, trimValues: true, parseTagValue: false });

function arrayify<T>(value: T | T[] | undefined): T[] { return value == null ? [] : Array.isArray(value) ? value : [value]; }
function numberValue(value: unknown) {
  const normalized = String(value ?? "0").replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
function text(value: unknown) { return String(value ?? "").trim(); }
function ci(obj: Record<string, unknown> | undefined, key: string) {
  if (!obj) return undefined;
  const found = Object.keys(obj).find((item) => item.toLowerCase() === key.toLowerCase());
  return found ? obj[found] : undefined;
}

export function isInformationTableXml(xml: string) {
  return /<(?:\w+:)?informationTable[\s>]/i.test(xml) && /<(?:\w+:)?infoTable[\s>]/i.test(xml);
}

export function parseInformationTable(xml: string): Array<Omit<Holding, "filing_id" | "investor_id" | "report_date" | "portfolio_weight">> {
  if (!isInformationTableXml(xml)) throw new Error("13F Information Table XML 형식이 아닙니다.");
  const parsed = parser.parse(xml) as Record<string, unknown>;
  const root = (ci(parsed, "informationTable") ?? ci(ci(parsed, "edgarSubmission") as Record<string, unknown>, "informationTable")) as Record<string, unknown> | undefined;
  const rows = arrayify(ci(root, "infoTable") as Record<string, unknown> | Record<string, unknown>[] | undefined);
  return rows.map((row) => {
    const amount = ci(row, "shrsOrPrnAmt") as Record<string, unknown> | undefined;
    const voting = ci(row, "votingAuthority") as Record<string, unknown> | undefined;
    const putCall = text(ci(row, "putCall"));
    return {
      issuer_name: text(ci(row, "nameOfIssuer")) || "이름 미제공",
      title_of_class: text(ci(row, "titleOfClass")) || null,
      cusip: text(ci(row, "cusip")).toUpperCase(),
      ticker: null,
      // Form 13F information table의 value 단위는 천 달러다.
      value_usd: Math.round(numberValue(ci(row, "value")) * 1000),
      shares: numberValue(ci(amount, "sshPrnamt")),
      share_type: text(ci(amount, "sshPrnamtType")) || null,
      put_call: putCall || null,
      investment_discretion: text(ci(row, "investmentDiscretion")) || null,
      voting_sole: numberValue(ci(voting, "Sole")),
      voting_shared: numberValue(ci(voting, "Shared")),
      voting_none: numberValue(ci(voting, "None")),
    };
  }).filter((row) => row.cusip && row.issuer_name);
}
