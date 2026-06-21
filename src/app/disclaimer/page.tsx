import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Container, PageHeader } from "@/components/ui";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "면책고지", description: "SEC 13F 데이터의 한계와 투자 관련 면책 안내" };
export default function DisclaimerPage() { return <Container className="pb-16"><PageHeader eyebrow="Disclaimer" title="면책고지" description="FolioInside의 모든 표와 설명을 이용하기 전에 아래 범위를 확인하세요." /><article className="max-w-3xl rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-10"><AlertTriangle className="size-8 text-amber-600" /><p className="mt-6 whitespace-pre-line text-lg font-bold leading-9 text-slate-900">{siteConfig.disclaimer}</p><div className="prose-fi"><h2>지연 공개 자료</h2><p>Form 13F는 분기 말 기준의 보유 내역을 나중에 공개합니다. 제출일과 보고 기준일 사이뿐 아니라 이용자가 열람하는 시점까지 보유 수량이 달라졌을 수 있습니다.</p><h2>공시 범위의 한계</h2><p>13F는 제출 기관의 모든 자산과 부채, 현금, 공매도, 파생상품 위험, 비공개 투자나 모든 해외 자산을 완전하게 보여주지 않습니다. 보고 가치와 비중은 전체 순자산 비중과 다릅니다.</p><h2>정확성과 책임</h2><p>데이터는 제출자가 작성한 SEC 공개 자료에 의존하며 제출 오류, 수정 공시, 파싱 또는 식별자 매핑 오류가 있을 수 있습니다. 중요한 판단 전에는 SEC 원문과 자격 있는 전문가의 조언을 별도로 확인하세요.</p></div></article></Container>; }
