export function TickerHelp() {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-sm leading-7 text-amber-900">
    <strong>‘ticker 미확인’은 무엇인가요?</strong>
    <p className="mt-1">13F 원문은 종목 코드(ticker)가 아니라 CUSIP을 기본 식별자로 사용합니다. Investinfo가 해당 CUSIP과 거래소 ticker의 대응 관계를 충분히 검증하지 못한 경우 임의로 추측하지 않고 이렇게 표시합니다. 상장폐지나 잘못된 증권이라는 뜻은 아니며, 채권·우선주·옵션·합병 전후 증권처럼 보통주 ticker 하나로 연결하기 어려운 경우도 있습니다.</p>
  </div>;
}
