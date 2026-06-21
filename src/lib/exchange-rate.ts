import exchangeRate from "@/data/exchange-rate.json";

export const usdKrwRate = exchangeRate.rate;
export const usdKrwDate = exchangeRate.date;
export const usdKrwSource = exchangeRate.source;

export function formatMoneyDual(value: number) {
  const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: value >= 1_000_000 ? "compact" : "standard", maximumFractionDigits: value >= 1_000_000 ? 1 : 0 }).format(value);
  if (!usdKrwRate) return usd;
  const krw = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", notation: "compact", maximumFractionDigits: 1 }).format(value * usdKrwRate);
  return `${usd} (약 ${krw})`;
}
