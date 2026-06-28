import { usdKrwDate, usdKrwRate, usdKrwSource } from "@/lib/exchange-rate";

export function CurrencyNotice() {
  if (!usdKrwRate) return null;
  return <p className="text-xs leading-5 text-zinc-400">원화 환산은 {usdKrwSource} {usdKrwDate} 기준 1달러 ≈ {Math.round(usdKrwRate).toLocaleString("ko-KR")}원을 적용한 참고값입니다. 실제 환전 금액과 다를 수 있습니다.</p>;
}
