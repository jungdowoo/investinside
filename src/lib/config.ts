export const siteConfig = {
  name: "FolioInside",
  description: "SEC Form 13F 공개 공시로 살펴보는 기관투자자 포트폴리오",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  disclaimer:
    "본 사이트는 SEC EDGAR 및 Form 13F 공개 공시 자료를 기반으로 한 정보 제공 사이트입니다. 본 자료는 투자 추천, 매수·매도 권유, 금융 자문이 아닙니다. 13F 공시는 분기별 지연 공개 자료이며, 현재 보유 현황과 다를 수 있습니다. SEC 13F 데이터는 제출자가 제공한 자료를 기반으로 하며 정확성이 보장되지 않을 수 있습니다. 투자 판단과 책임은 이용자 본인에게 있습니다.",
} as const;

export const DATA_NOTICES = [
  "데이터 기준: SEC Form 13F 공개 공시",
  "실시간 보유 현황 아님",
  "투자 추천 아님",
  "보고 기준일과 제출일을 반드시 확인하세요.",
] as const;

export const BERKSHIRE_SEED: Investor = {
  id: "00000000-0000-0000-0000-000000000001",
  slug: "warren-buffett-berkshire-hathaway",
  display_name: "워런 버핏 (Warren Buffett)",
  investor_name: "Warren Buffett",
  firm_name: "BERKSHIRE HATHAWAY INC",
  cik: "0001067983",
  description:
    "Warren Buffett과 관련된 BERKSHIRE HATHAWAY INC의 SEC Form 13F 공시를 기준으로 정리합니다. 개인 계좌 전체를 의미하지 않습니다.",
  style: "장기 가치투자로 알려진 운용사",
  is_active: true,
};

import type { Investor } from "@/types/domain";
