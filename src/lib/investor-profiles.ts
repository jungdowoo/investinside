export type InvestorProfile = {
  title: string;
  summary: string;
  highlights: string[];
  sprite: { column: number; row: number };
};

export const INVESTOR_PROFILES: Record<string, InvestorProfile> = {
  "warren-buffett-berkshire-hathaway": { title: "버크셔 해서웨이 회장", summary: "장기적인 기업 가치와 자본 배분을 중시하는 투자자로 널리 알려져 있습니다. 화면의 보유 내역은 버크셔 해서웨이가 제출한 13F 범위입니다.", highlights: ["장기 가치투자", "기업 경쟁력 중시", "버크셔 해서웨이 13F"], sprite: { column: 0, row: 0 } },
  "ray-dalio-bridgewater-associates": { title: "브리지워터 창립자", summary: "글로벌 거시경제와 체계적 투자 접근으로 알려진 투자자입니다. 현재 화면은 Bridgewater Associates의 공개 13F를 정리합니다.", highlights: ["글로벌 매크로", "체계적 투자", "브리지워터 13F"], sprite: { column: 1, row: 0 } },
  "michael-burry-scion-asset-management": { title: "사이언 자산운용 설립자", summary: "기업과 시장의 비대칭 위험을 분석하는 집중 투자로 알려져 있습니다. 표시 자료는 Scion Asset Management의 13F 공시입니다.", highlights: ["집중 투자", "가치 분석", "사이언 13F"], sprite: { column: 2, row: 0 } },
  "bill-ackman-pershing-square": { title: "퍼싱스퀘어 창립자", summary: "소수 기업에 대한 집중적인 분석과 장기 보유 전략으로 알려져 있습니다. 실제 공시 주체는 Pershing Square Capital Management입니다.", highlights: ["집중 포트폴리오", "주주 관여", "퍼싱스퀘어 13F"], sprite: { column: 0, row: 1 } },
  "stanley-druckenmiller-duquesne-family-office": { title: "듀케인 패밀리 오피스", summary: "거시 환경과 기업 성장성을 함께 살피는 투자자로 알려져 있습니다. 화면은 Duquesne Family Office가 제출한 13F 기준입니다.", highlights: ["거시 분석", "성장 기업", "듀케인 13F"], sprite: { column: 1, row: 1 } },
  "david-tepper-appaloosa": { title: "아팔루사 창립자", summary: "시장 사이클과 기업 가치의 변화에 주목하는 투자자로 알려져 있습니다. 표시 자료는 Appaloosa가 공개한 13F 범위입니다.", highlights: ["시장 사이클", "가치 기회", "아팔루사 13F"], sprite: { column: 2, row: 1 } },
  "george-soros-soros-fund-management": { title: "소로스 펀드 매니지먼트 창립자", summary: "글로벌 금융시장과 거시 변화에 대한 투자로 알려져 있습니다. 현재 데이터는 Soros Fund Management의 공개 13F입니다.", highlights: ["글로벌 매크로", "시장 변화", "소로스 펀드 13F"], sprite: { column: 0, row: 2 } },
  "seth-klarman-baupost-group": { title: "바우포스트 그룹 창립자", summary: "안전마진을 중시하는 가치투자로 알려져 있습니다. 화면의 종목은 Baupost Group이 제출한 13F 정보표 기준입니다.", highlights: ["안전마진", "가치투자", "바우포스트 13F"], sprite: { column: 1, row: 2 } },
  "national-pension-service-korea": { title: "대한민국 공적 연기금", summary: "국민연금공단이 미국 SEC에 제출한 13F 공시 중 보고 대상 미국 상장 증권만 정리합니다. 국내외 전체 운용자산을 의미하지 않습니다.", highlights: ["공적 연기금", "장기 분산투자", "국민연금 13F"], sprite: { column: 2, row: 2 } },
};
