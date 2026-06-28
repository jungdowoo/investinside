import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "데이터 방법론", description: "Investinfo의 SEC 13F 및 companyfacts 수집·계산 방법" };

export default function MethodologyPage() {
  return <Container className="pb-16">
    <PageHeader eyebrow="Methodology" title="데이터 방법론" description="어떤 원문을 사용하고 무엇을 계산하는지 투명하게 설명합니다." />
    <article className="prose-fi max-w-4xl rounded-md border border-zinc-200 bg-white p-6 sm:p-10">
      <h2>원천 자료</h2><p>포트폴리오는 SEC submissions JSON에서 13F-HR 및 13F-HR/A 제출을 확인하고 각 filing의 Information Table XML을 직접 파싱합니다. 기업 정보와 재무 항목은 SEC XBRL companyfacts JSON을 사용합니다. 다른 포트폴리오 집계 사이트의 표나 유료 금융 API를 복제하지 않습니다.</p>
      <h2>보고 가치와 원화 환산</h2><p>13F 정보표의 보고 가치는 천 달러 단위이므로 달러로 환산합니다. 각 행의 포트폴리오 비중은 동일 filing에 포함된 보고 가치 합계를 분모로 계산합니다. 이 비중은 기관 전체 순자산 비중이 아닙니다. 원화는 미국 연방준비제도 H.10의 원/달러 일일 환율을 적용한 참고값이며, 화면에 적용 기준일을 함께 표시합니다.</p>
      <h2>분기 변화와 보고서 제외</h2><p>CUSIP, 증권 종류와 put/call 구분을 중심으로 두 보고 분기를 비교합니다. 이전 분기에 없고 현재 분기에 있으면 신규 편입, 이전에 있고 현재에 없으면 ‘보고서 제외(전량 매도 추정)’로 표시합니다. 실제 거래일·가격이나 매도 완료를 확정할 수 없고, 수정 공시나 식별자 변경의 가능성도 있습니다.</p>
      <h2>CUSIP, ticker와 한글명</h2><p>CUSIP은 북미 증권을 구분하는 9자리 식별번호입니다. 13F 원문에는 ticker가 필수로 제공되지 않으므로 CUSIP과 ticker의 대응 관계를 검증한 내부 별칭만 연결합니다. 미확인 표시는 상장폐지를 의미하지 않으며, 불명확한 채권·우선주·옵션 등은 추측하지 않습니다. 한글 종목명은 탐색 편의를 위한 번역이고 SEC 원문 발행사명과 CUSIP을 함께 보존합니다.</p>
      <h2>재무제표와 배당</h2><p>재무 탭은 10-K·10-Q XBRL의 매출, 영업이익, 순이익, 자산, 부채, 자본, 희석 EPS, 영업현금흐름 및 제공되는 배당 공시값을 보여줍니다. 배당 값은 과거 공시 기간의 값으로 예상 연간 배당이나 배당수익률이 아닙니다. 값이 없다고 무배당을 단정하지 않습니다. PER은 현재 주가 데이터가 필요하므로 상업 이용 조건이 검증된 시세 공급원이 연결되기 전까지 제공하지 않습니다.</p>
      <h2>갱신과 정정</h2><p>로컬 수집기가 새 accession number를 확인해 중복 없이 저장합니다. 수정 공시나 식별자 오류를 발견하면 문의 페이지를 통해 SEC 원문 URL과 함께 정정을 요청할 수 있습니다.</p>
    </article>
  </Container>;
}
