import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright-core";

const BROWSER_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

const candidates = [
  {
    cik: "0001350694",
    slug: "ray-dalio-bridgewater-associates",
    display_name: "레이 달리오 (Ray Dalio)",
    investor_name: "Ray Dalio",
    expectedName: "BRIDGEWATER ASSOCIATES",
    description: "Ray Dalio와 관련해 널리 알려진 Bridgewater Associates의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Bridgewater Associates 제출 13F 추적",
  },
  {
    cik: "0001649339",
    slug: "michael-burry-scion-asset-management",
    display_name: "마이클 버리 (Michael Burry)",
    investor_name: "Michael Burry",
    expectedName: "SCION ASSET MANAGEMENT",
    description: "Michael Burry와 관련해 알려진 Scion Asset Management의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Scion Asset Management 제출 13F 추적",
  },
  {
    cik: "0001336528",
    slug: "bill-ackman-pershing-square",
    display_name: "빌 애크먼 (Bill Ackman)",
    investor_name: "Bill Ackman",
    expectedName: "PERSHING SQUARE CAPITAL MANAGEMENT",
    description: "Bill Ackman과 관련해 알려진 Pershing Square Capital Management의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Pershing Square 제출 13F 추적",
  },
  {
    cik: "0001536411",
    slug: "stanley-druckenmiller-duquesne-family-office",
    display_name: "스탠리 드러켄밀러 (Stanley Druckenmiller)",
    investor_name: "Stanley Druckenmiller",
    expectedName: "DUQUESNE FAMILY OFFICE",
    description: "Stanley Druckenmiller와 관련해 알려진 Duquesne Family Office의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Duquesne Family Office 제출 13F 추적",
  },
  {
    cik: "0001656456",
    slug: "david-tepper-appaloosa",
    display_name: "데이비드 테퍼 (David Tepper)",
    investor_name: "David Tepper",
    expectedName: "APPALOOSA",
    description: "David Tepper와 관련해 알려진 Appaloosa의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Appaloosa 제출 13F 추적",
  },
  {
    cik: "0001029160",
    slug: "george-soros-soros-fund-management",
    display_name: "조지 소로스 (George Soros)",
    investor_name: "George Soros",
    expectedName: "SOROS FUND MANAGEMENT",
    description: "George Soros와 관련해 알려진 Soros Fund Management의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Soros Fund Management 제출 13F 추적",
  },
  {
    cik: "0001061768",
    slug: "seth-klarman-baupost-group",
    display_name: "세스 클라먼 (Seth Klarman)",
    investor_name: "Seth Klarman",
    expectedName: "BAUPOST GROUP",
    description: "Seth Klarman과 관련해 알려진 Baupost Group의 SEC Form 13F 공개 공시를 정리합니다. 개인 계좌나 전체 자산을 나타내지 않습니다.",
    style: "Baupost Group 제출 13F 추적",
  },
  {
    cik: "0001608046",
    slug: "national-pension-service-korea",
    display_name: "국민연금 (National Pension Service)",
    investor_name: "National Pension Service",
    expectedName: "NATIONAL PENSION SERVICE",
    description: "대한민국 국민연금공단이 미국 SEC에 제출한 Form 13F 공개 공시를 정리합니다. 국내 전체 운용자산이 아니라 13F 보고 대상 미국 상장 증권 범위만 나타냅니다.",
    style: "국민연금공단 제출 13F 추적",
  },
] as const;

type Submission = {
  name?: string;
  filings?: { recent?: { form?: string[] } };
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required in .env.local`);
  return value;
}

function browserPath() {
  const configured = process.env.SEC_BROWSER_PATH?.trim();
  if (configured && existsSync(configured)) return configured;
  const detected = BROWSER_PATHS.find((path) => existsSync(path));
  if (!detected) throw new Error("Microsoft Edge or Google Chrome was not found.");
  return detected;
}

async function main() {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requiredEnv("SUPABASE_SECRET_KEY");
  const contact = requiredEnv("SEC_USER_AGENT");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const browser = await chromium.launch({ executablePath: browserPath(), headless: false });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ from: contact, accept: "application/json" });
    const verified = [];

    for (const candidate of candidates) {
      const submissionUrl = `https://data.sec.gov/submissions/CIK${candidate.cik}.json`;
      const response = await page.goto(submissionUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
      if (!response?.ok()) throw new Error(`${candidate.display_name}: SEC submissions request failed (${response?.status() ?? "no response"})`);
      const submission = JSON.parse((await response.body()).toString("utf8")) as Submission;
      const officialName = submission.name?.trim() ?? "";
      if (!officialName.toUpperCase().includes(candidate.expectedName)) {
        throw new Error(`${candidate.display_name}: CIK name mismatch (${officialName})`);
      }
      const forms = submission.filings?.recent?.form ?? [];
      if (!forms.some((form) => form === "13F-HR" || form === "13F-HR/A")) {
        throw new Error(`${candidate.display_name}: no recent 13F-HR filing found`);
      }
      verified.push({
        cik: candidate.cik,
        slug: candidate.slug,
        display_name: candidate.display_name,
        investor_name: candidate.investor_name,
        firm_name: officialName,
        description: candidate.description,
        style: candidate.style,
        is_active: true,
      });
      console.log(`Verified ${candidate.display_name}: ${officialName} (CIK ${candidate.cik})`);
    }

    const { error } = await db.from("investors").upsert(verified, { onConflict: "slug" });
    if (error) throw error;
    const { error: berkshireError } = await db
      .from("investors")
      .update({ display_name: "워런 버핏 (Warren Buffett)" })
      .eq("slug", "warren-buffett-berkshire-hathaway");
    if (berkshireError) throw berkshireError;
    console.log(`Stored ${verified.length} verified SEC 13F managers.`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
