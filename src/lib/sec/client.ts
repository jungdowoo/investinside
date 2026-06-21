import "server-only";
import { normalizeCik } from "@/lib/format";

const SEC_DATA = "https://data.sec.gov";
const SEC_WWW = "https://www.sec.gov";
const MIN_INTERVAL_MS = 110;
let requestQueue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function rateLimitedFetch(url: string, attempt = 0): Promise<Response> {
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent) throw new Error("SEC_USER_AGENT 환경변수가 필요합니다. 연락 가능한 이메일을 포함하세요.");
  const run = async () => {
    const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt));
    if (wait) await sleep(wait);
    lastRequestAt = Date.now();
    return fetch(url, {
      headers: { "User-Agent": userAgent, Accept: "application/json, application/xml, text/xml, text/html;q=0.9" },
      cache: "no-store",
    });
  };
  const responsePromise = requestQueue.then(run, run);
  requestQueue = responsePromise.then(() => undefined, () => undefined);
  const response = await responsePromise;
  if ((response.status === 429 || response.status >= 500) && attempt < 4) {
    await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 150));
    return rateLimitedFetch(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`SEC 요청 실패 (${response.status}): ${url}`);
  return response;
}

export async function secJson<T>(url: string): Promise<T> {
  return (await rateLimitedFetch(url)).json() as Promise<T>;
}

export async function secText(url: string): Promise<string> {
  return (await rateLimitedFetch(url)).text();
}

export function submissionsUrl(cik: string) {
  return `${SEC_DATA}/submissions/CIK${normalizeCik(cik)}.json`;
}

export function filingDirectoryUrl(cik: string, accessionNumber: string) {
  const cikPath = String(Number(normalizeCik(cik)));
  return `${SEC_WWW}/Archives/edgar/data/${cikPath}/${accessionNumber.replace(/-/g, "")}`;
}

export function secCompanyUrl(cik: string) {
  return `${SEC_WWW}/edgar/browse/?CIK=${normalizeCik(cik)}&owner=exclude`;
}
