import Link from "next/link";
import { formatStockLabel } from "@/lib/stock-labels";

export function StockLabelLink({ ticker, issuerName, className = "" }: { ticker: string | null | undefined; issuerName: string; className?: string }) {
  const label = formatStockLabel(ticker, issuerName);
  return ticker ? <Link href={`/stocks/${ticker.toLowerCase()}`} className={`hover:text-teal-800 hover:underline ${className}`}>{label}</Link> : <span className={className}>{label}</span>;
}
