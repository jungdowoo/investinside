export type StockResearch = {
  securityType: string;
  summary: string;
  revenueDrivers: string[];
  futureThemes: string[];
  risks: string[];
};

const curated: Record<string, StockResearch> = {
  GOOG: alphabet("Class C 보통주(의결권 없음)"),
  GOOGL: alphabet("Class A 보통주(1주당 1표 의결권)"),
  AAPL: {
    securityType: "미국 대형 기술주 · 보통주",
    summary: "애플은 아이폰을 중심으로 하드웨어와 운영체제, 서비스 생태계를 함께 운영하는 소비자 기술 기업입니다. 기기 판매뿐 아니라 설치 기반에서 반복적으로 발생하는 서비스 매출의 질이 중요한 종목입니다.",
    revenueDrivers: ["아이폰·맥·아이패드·웨어러블 등 기기 판매", "App Store, 광고, iCloud, Apple Music·TV+ 등 서비스", "고가 제품 믹스와 서비스 총이익률"],
    futureThemes: ["온디바이스 AI와 Apple Intelligence 확산", "서비스·구독 매출의 성장", "공간 컴퓨팅, 헬스케어와 자체 반도체"],
    risks: ["아이폰 교체 수요와 중국 시장 의존", "앱스토어 수수료·반독점 규제", "공급망 집중과 환율 변동"],
  },
  MSFT: {
    securityType: "미국 대형 기술주 · 보통주",
    summary: "마이크로소프트는 기업용 소프트웨어와 클라우드 인프라를 중심으로 반복 구독 매출을 만드는 기업입니다. Azure 성장률과 AI 투자 대비 수익화 속도가 핵심 관찰 포인트입니다.",
    revenueDrivers: ["Azure 클라우드와 서버 제품", "Microsoft 365·Dynamics 기업용 구독", "Windows, Xbox·게임 및 LinkedIn"],
    futureThemes: ["Copilot 기반 생성형 AI 구독", "AI 데이터센터와 Azure 소비 증가", "보안·데이터 플랫폼 통합 판매"],
    risks: ["AI 인프라 자본지출 부담", "클라우드 경쟁과 가격 압력", "반독점·사이버보안 리스크"],
  },
  NVDA: {
    securityType: "미국 반도체 성장주 · 보통주",
    summary: "엔비디아는 GPU와 네트워킹, CUDA 소프트웨어를 묶어 AI 데이터센터의 컴퓨팅 플랫폼을 공급합니다. 데이터센터 매출과 차세대 칩 전환 속도가 실적을 크게 좌우합니다.",
    revenueDrivers: ["AI 가속기와 데이터센터 GPU", "네트워킹 장비·시스템", "게이밍 GPU와 소프트웨어"],
    futureThemes: ["생성형 AI 학습·추론 수요", "Blackwell 이후 차세대 아키텍처", "자동차·로보틱스·소버린 AI"],
    risks: ["고객 자체칩과 경쟁사 추격", "수출 규제와 공급망 제약", "높은 기대치와 수요 변동성"],
  },
  AMZN: {
    securityType: "미국 대형 소비·클라우드주 · 보통주",
    summary: "아마존은 온라인 유통의 큰 매출 기반 위에 AWS와 광고 같은 고마진 사업을 운영합니다. 전체 이익은 AWS 성장과 물류 효율 개선에 특히 민감합니다.",
    revenueDrivers: ["온라인·오프라인 상품 판매와 제3자 판매 수수료", "AWS 클라우드", "광고와 Prime 구독"],
    futureThemes: ["생성형 AI 클라우드 서비스", "물류 자동화와 배송 밀도 개선", "광고·헬스케어 확장"],
    risks: ["대규모 설비투자와 낮은 유통 마진", "규제·노동 비용", "클라우드 경쟁"],
  },
  META: {
    securityType: "미국 인터넷·광고주 · Class A 보통주",
    summary: "메타는 Facebook, Instagram, WhatsApp의 이용자 활동을 기반으로 디지털 광고 매출을 창출합니다. 광고 효율과 AI 추천 시스템, 장기적인 Reality Labs 투자가 핵심입니다.",
    revenueDrivers: ["Facebook·Instagram 광고", "메시징 비즈니스 도구", "기기·기타 매출"],
    futureThemes: ["AI 추천·광고 자동화", "비즈니스 메시징", "AR·VR과 차세대 컴퓨팅 플랫폼"],
    risks: ["개인정보·플랫폼 규제", "광고 경기 민감도", "Reality Labs의 장기 손실"],
  },
  TSM: {
    securityType: "대만 반도체 파운드리 · 미국예탁증서(ADR)",
    summary: "TSMC는 고객이 설계한 반도체를 생산하는 세계적인 파운드리입니다. 최첨단 공정 가동률과 가격, 대형 고객의 제품 사이클이 수익성을 좌우합니다.",
    revenueDrivers: ["최첨단·성숙 공정 웨이퍼 제조", "고성능 컴퓨팅과 스마트폰 고객", "첨단 패키징 서비스"],
    futureThemes: ["AI 가속기 생산과 첨단 패키징", "2나노 이하 공정", "미국·일본·유럽 생산기지 다변화"],
    risks: ["지정학·대만 집중", "막대한 설비투자", "반도체 업황 순환과 고객 집중"],
  },
  V: simple("글로벌 결제 네트워크주 · Class A 보통주", "비자는 카드 대출을 직접 제공하기보다 결제 승인·정산 네트워크에서 수수료를 받습니다.", ["결제 처리 수수료", "국경 간 결제", "부가가치·데이터 서비스"], ["현금 없는 결제", "실시간 송금과 B2B 결제", "토큰화·보안 서비스"], ["결제 규제와 수수료 압력", "경기 둔화에 따른 거래액 감소", "대체 결제망 경쟁"]),
  KO: simple("미국 필수소비재·배당주 · 보통주", "코카콜라는 브랜드와 농축액, 완제품 음료를 판매하는 글로벌 음료 기업입니다.", ["탄산음료 농축액", "생수·스포츠·커피 등 비탄산 음료", "보틀링 파트너 판매"], ["무설탕 제품", "신흥시장 소비 증가", "프리미엄·에너지 음료"], ["원재료·환율", "건강 규제", "소비 취향 변화"]),
};

function alphabet(securityType: string): StockResearch {
  return {
    securityType: `미국 대형 기술주 · ${securityType}`,
    summary: "알파벳은 Google 검색, YouTube, Android를 중심으로 디지털 광고와 클라우드 서비스를 운영하는 지주회사입니다. 현재 이익의 중심은 광고지만, Google Cloud와 AI 제품이 사업 구조를 넓히고 있습니다. GOOG와 GOOGL은 같은 회사의 서로 다른 주식 종류이며 경제적 권리는 대체로 유사하지만 의결권이 다릅니다.",
    revenueDrivers: ["Google 검색·기타 광고: 검색 결과 등에 노출되는 광고", "YouTube 광고와 YouTube Premium·TV 등 구독", "Google Cloud: 인프라, 데이터·AI 플랫폼, Workspace", "Google Play, Pixel·Nest 기기 및 기타 서비스"],
    futureThemes: ["Gemini 기반 생성형 AI가 검색·Workspace·Cloud에 만드는 신규 수요", "AI 학습·추론용 데이터센터와 자체 TPU", "Waymo 자율주행 상용화", "YouTube 커넥티드TV와 구독 확대"],
    risks: ["AI 답변 확산이 기존 검색 광고 경제성에 미치는 영향", "미국·유럽의 반독점 및 개인정보 규제", "대규모 AI 설비투자 대비 수익화 지연", "Meta·Microsoft·Amazon 등과의 광고·클라우드 경쟁"],
  };
}

function simple(securityType: string, summary: string, revenueDrivers: string[], futureThemes: string[], risks: string[]): StockResearch {
  return { securityType, summary, revenueDrivers, futureThemes, risks };
}

export function getStockResearch(ticker: string, entityName: string, sicDescription?: string, securityClasses: string[] = []): StockResearch {
  const normalized = ticker.toUpperCase();
  if (curated[normalized]) return curated[normalized];
  const sic = sicDescription?.toLowerCase() ?? "";
  const classes = securityClasses.join(" · ").toLowerCase();
  const securityType = ["SPY", "IVV", "RSP", "XLE"].includes(normalized) ? "상장지수펀드(ETF)" : classes.includes("adr") || ["BABA", "SE", "STM", "YPF"].includes(normalized) ? "미국예탁증서(ADR)" : `보통주${securityClasses.length ? ` · 공시 종류 ${securityClasses.join(", ")}` : ""}`;
  if (/semiconductor|electronic component/.test(sic)) return simple(securityType, `${entityName}은 SEC 산업분류상 반도체·전자부품 기업입니다. 개별 제품 구성과 고객 비중은 최근 10-K 원문에서 추가 확인해야 합니다.`, ["반도체·전자부품 판매", "제품 믹스와 평균판매가격", "주요 고객의 재고·수요"], ["AI·데이터센터", "고성능·저전력 반도체", "첨단 패키징"], ["반도체 업황 순환", "고객 집중", "수출 규제·공급망"]);
  if (/software|services-prepackaged|computer programming/.test(sic)) return simple(securityType, `${entityName}은 SEC 산업분류상 소프트웨어·IT 서비스 기업입니다. 반복 구독 매출과 고객 유지율이 중요한 유형입니다.`, ["소프트웨어 구독·라이선스", "클라우드·서비스", "기업 고객 계약"], ["생성형 AI", "클라우드 전환", "보안·데이터 분석"], ["경쟁 심화", "기술 변화", "고객 IT 지출 둔화"]);
  if (/pharmaceutical|biological|medical/.test(sic)) return simple(securityType, `${entityName}은 SEC 산업분류상 제약·바이오·의료 기업입니다. 승인 제품과 연구개발 파이프라인의 성과가 기업 가치에 큰 영향을 줄 수 있습니다.`, ["승인 의약품·의료제품 판매", "라이선스·협업", "보험 급여와 가격"], ["신약 파이프라인", "정밀의료", "신규 적응증"], ["임상·허가 실패", "특허 만료", "약가 규제"]);
  if (/bank|finance|insurance|investment/.test(sic)) return simple(securityType, `${entityName}은 SEC 산업분류상 금융 기업입니다. 금리, 신용비용, 거래·수수료 수익을 함께 살펴야 합니다.`, ["순이자이익", "수수료·거래 수익", "보험·자산관리"], ["디지털 금융", "자산관리 성장", "결제·데이터 서비스"], ["신용손실", "금리·유동성", "금융 규제"]);
  if (/oil|gas|petroleum|energy/.test(sic)) return simple(securityType, `${entityName}은 SEC 산업분류상 에너지 기업입니다. 원유·가스 가격과 생산량, 정제 마진 또는 운송 계약이 실적의 핵심 변수입니다.`, ["원유·가스 생산 또는 정제", "에너지 운송·판매", "원자재 가격"], ["LNG와 에너지 안보", "탄소 포집", "저탄소 전환 투자"], ["유가 변동", "환경 규제", "대규모 프로젝트 집행"]);
  return simple(securityType, `${entityName}은 SEC에서 ‘${sicDescription ?? "산업분류 미제공"}’ 업종으로 분류됩니다. 아래 내용은 업종 공통 관찰 항목이며, 구체적인 매출 구성은 최근 10-K 사업 부문과 주석을 함께 확인해야 합니다.`, ["핵심 제품·서비스 판매", "가격과 판매량", "지역·고객별 매출 구성"], ["산업의 구조적 성장", "신제품·신시장", "운영 효율과 자본 배분"], ["경기와 경쟁", "규제·공급망", "기업별 실행 위험"]);
}
