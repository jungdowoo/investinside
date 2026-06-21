import { writeFile } from "node:fs/promises";

async function main() {
  const response = await fetch("https://www.federalreserve.gov/releases/h10/hist/dat00_ko.htm", { headers: { "User-Agent": process.env.SEC_USER_AGENT ?? "Investinfo/1.0" } });
  if (!response.ok) throw new Error(`Federal Reserve exchange-rate request failed (${response.status})`);
  const html = await response.text();
  const rows = [...html.matchAll(/(\d{1,2})-([A-Z]{3})-(\d{2})<\/th>\s*<td[^>]*>\s*([\d.]+)\s*<\/td>/gi)];
  const latest = rows.at(-1);
  if (!latest) throw new Error("Federal Reserve USD/KRW rate was not found");
  const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].indexOf(latest[2].toUpperCase()) + 1;
  const date = `20${latest[3]}-${String(month).padStart(2, "0")}-${latest[1].padStart(2, "0")}`;
  const payload = { base: "USD", quote: "KRW", rate: Number(latest[4]), date, source: "미국 연방준비제도 H.10" };
  await writeFile("src/data/exchange-rate.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`USD/KRW ${payload.rate.toFixed(2)} (${date})`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
