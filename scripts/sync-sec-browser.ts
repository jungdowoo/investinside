import { existsSync } from "node:fs";
import { chromium, type Browser, type Page } from "playwright-core";

const SEC_HOSTS = new Set(["data.sec.gov", "www.sec.gov"]);
const EDGE_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required in .env.local`);
  return value;
}

function browserPath() {
  const configured = process.env.SEC_BROWSER_PATH?.trim();
  if (configured && existsSync(configured)) return configured;
  const detected = EDGE_PATHS.find((path) => existsSync(path));
  if (!detected) throw new Error("Microsoft Edge or Google Chrome was not found.");
  return detected;
}

function secUrl(input: string | URL | Request) {
  const value = input instanceof Request ? input.url : String(input);
  const url = new URL(value);
  return SEC_HOSTS.has(url.hostname) ? url : null;
}

function requestHeaders(init: RequestInit | undefined, contact: string) {
  const headers = new Headers(init?.headers);
  headers.delete("user-agent");
  headers.set("from", contact);
  const result: Record<string, string> = {};
  headers.forEach((value, name) => { result[name] = value; });
  return result;
}

async function browserFetch(page: Page, input: string | URL | Request, init: RequestInit | undefined, contact: string) {
  const url = secUrl(input);
  if (!url) throw new Error("Only official SEC URLs may use the browser collector.");
  const method = init?.method ?? (input instanceof Request ? input.method : "GET");
  if (method.toUpperCase() !== "GET") throw new Error("The SEC browser collector only supports GET requests.");

  await page.setExtraHTTPHeaders(requestHeaders(init, contact));
  const response = await page.goto(url.toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (!response) throw new Error(`The browser did not receive a response from ${url}`);
  const body = await response.body();
  const responseHeaders = response.headers();
  return new Response(new Uint8Array(body), {
    status: response.status(),
    statusText: response.statusText(),
    headers: responseHeaders["content-type"]
      ? { "content-type": responseHeaders["content-type"] }
      : undefined,
  });
}

async function main() {
  requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  requiredEnv("SUPABASE_SECRET_KEY");
  const contact = requiredEnv("SEC_USER_AGENT");
  const executablePath = browserPath();
  let browser: Browser | undefined;
  const nativeFetch = globalThis.fetch;

  try {
    console.log(`Starting local SEC collector with ${executablePath}`);
    browser = await chromium.launch({ executablePath, headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
      if (secUrl(input)) return browserFetch(page, input, init, contact);
      return nativeFetch(input, init);
    }) as typeof fetch;

    const { syncAllInvestors } = await import("../src/lib/sec/sync");
    const results = await syncAllInvestors();
    const failures = results.flatMap((result) =>
      result.errors.map((error) => `${result.investor}: ${error}`),
    );
    const processed = results.reduce((total, result) => total + result.processed, 0);
    const skipped = results.reduce((total, result) => total + result.skipped, 0);
    console.log(`SEC sync finished: processed ${processed}, skipped ${skipped}`);
    if (failures.length > 0) throw new Error(failures.join("\n"));
  } finally {
    globalThis.fetch = nativeFetch;
    await browser?.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
