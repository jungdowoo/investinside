# FolioInside

FolioInside는 SEC EDGAR와 Form 13F 공식 공개 공시를 직접 수집해 유명 투자자와 관련된 운용사의 분기별 보유 내역을 보여주는 한국어 교육형 정보 서비스입니다.

화면에 표시되는 인물 이름은 관련 운용사를 찾기 위한 표지입니다. 데이터의 실제 제출 주체는 각 기관이며, 개인의 전체 포트폴리오를 의미하지 않습니다. 실시간 시세, 목표주가, 수익률 예측, 매수·매도 추천은 제공하지 않습니다.

## 주요 기능

- SEC submissions API에서 활성 기관의 새 `13F-HR` 및 `13F-HR/A` 확인
- SEC 13F Information Table XML 직접 파싱
- CUSIP과 증권 종류를 기준으로 보유 내역 및 분기 변화 계산
- 투자자 상세, 공통 보유 종목, ticker 별칭 기반 종목 상세 화면
- 13F와 투자 용어를 설명하는 교육 콘텐츠 10개
- Supabase Auth 기반 관리자 로그인, 기관 관리, 수동 동기화 및 로그 조회
- 모바일 대응 UI, 법적 고지, 개인정보처리방침, 문의 및 데이터 출처 페이지

## 데이터 출처와 사용 원칙

사용하는 외부 데이터는 다음 SEC 공식 공개 자료뿐입니다.

1. `https://data.sec.gov/submissions/CIK##########.json`
2. SEC EDGAR의 `13F-HR` 및 `13F-HR/A` filing 문서
3. 각 filing에 포함된 13F Information Table XML

Yahoo Finance, ARK CSV, 유료 금융 API, 포트폴리오 집계 사이트 또는 다른 사이트의 표·차트·설명을 사용하거나 크롤링하지 않습니다. 상업용 데이터 라이선스 위험을 줄이기 위해 보유 종목 원본은 SEC 공식 공시에서만 가져옵니다.

13F는 ticker를 필수 필드로 제공하지 않습니다. 따라서 `cusip`과 `issuer_name`을 원본 식별 정보로 저장하고, 관리자가 검증해 `stock_aliases`에 등록한 ticker만 표시합니다. 매핑이 없으면 `ticker_unknown`으로 표시됩니다.

## 기술 구성

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- Supabase PostgreSQL, Auth, RLS
- Vercel 배포 및 Vercel Cron
- `fast-xml-parser` 기반 SEC XML 파서
- 서버 전용 SEC 요청 및 service role 데이터 적재

## 폴더 구조

```text
src/
  app/
    api/cron/sync-13f/      # CRON_SECRET으로 보호된 동기화 Route Handler
    admin/                   # 로그인, 기관 관리, 동기화 로그
    investors/              # 기관 목록 및 상세
    overlap/                # 공통 보유 종목
    stocks/                  # 수집 종목 검색 및 상세
    learn/                   # 교육 콘텐츠
    about|contact|privacy|disclaimer/
  components/               # 공통 UI와 겹침 필터
  content/learn/            # MVP 교육 콘텐츠
  lib/
    data/                    # 공개 페이지용 Supabase 조회
    holdings/                # 분기 비교와 겹침 계산
    sec/                     # SEC 요청, 탐색, XML 파싱, 적재
    supabase/                # public/server/admin 클라이언트
  types/
supabase/migrations/         # 스키마, 인덱스, RLS, seed
vercel.json                  # 주간 Cron 일정
```

## 환경변수

`.env.example`을 `.env.local`로 복사하고 값을 설정합니다.

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
SUPABASE_SECRET_KEY=sb_secret_your-key
CRON_SECRET=replace-with-a-long-random-secret
SEC_USER_AGENT=FolioInside/1.0 contact: your-email@example.com
```

- `SUPABASE_SECRET_KEY`와 `CRON_SECRET`은 클라이언트에 노출하면 안 됩니다.
- `SEC_USER_AGENT`에는 SEC가 연락할 수 있는 실제 운영자 이메일을 넣어야 합니다.
- 운영 환경의 `NEXT_PUBLIC_SITE_URL`, 연락처, 개인정보처리방침 내용은 실제 정보로 교체해야 합니다.

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/migrations/202606200001_initial_schema.sql`을 실행하거나 Supabase CLI로 migration을 적용합니다.
3. Authentication에서 관리자 사용자를 생성합니다.
4. 생성된 사용자의 UUID를 `admin_users`에 등록합니다.

```sql
insert into public.admin_users (user_id)
values ('AUTH_USER_UUID');
```

Migration은 다음을 포함합니다.

- `investors`, `filings`, `holdings`, `holding_changes`
- `stock_aliases`, `learn_posts`, `admin_logs`, `admin_users`
- holdings와 filing 조회용 인덱스
- 공개 읽기와 관리자 쓰기를 분리한 RLS 정책
- 검증된 초기 seed인 BERKSHIRE HATHAWAY INC, CIK `0001067983`

Ray Dalio, Michael Burry, Bill Ackman, Stanley Druckenmiller, David Tepper 관련 기관은 CIK를 SEC에서 직접 검증한 뒤 관리자 화면에서 추가해야 합니다. 검증 전 seed에는 포함하지 않습니다.

## 로컬 실행

Node.js와 pnpm을 준비한 뒤 다음 명령을 실행합니다.

```bash
pnpm install
pnpm dev
```

`http://localhost:3000`에서 사이트를 열 수 있습니다. Supabase 환경변수가 없을 때 공개 화면은 Berkshire seed와 빈 데이터 상태를 안전하게 보여주지만, 관리자 기능과 SEC 동기화는 동작하지 않습니다.

품질 검사는 다음과 같습니다.

```bash
pnpm lint
pnpm build
```

## SEC EDGAR 수집 방식

`/api/cron/sync-13f` 또는 관리자 수동 동기화는 다음 순서로 동작합니다.

1. 활성화된 기관의 CIK로 SEC submissions JSON 조회
2. 최근 `13F-HR` 또는 `13F-HR/A` 중 DB에 없는 accession number 선별
3. filing의 `index.json`에서 Information Table XML 탐색
4. SEC XML 원문의 발행사명, CUSIP, 보고 가치, 수량, 의결권 항목 파싱
5. 정보표의 천 달러 단위 보고 가치를 달러로 환산
6. filing 내 보고 가치 합계로 `portfolio_weight` 계산
7. 이전 보고 분기와 CUSIP·증권 종류 기준으로 `NEW`, `EXIT`, `INCREASE`, `DECREASE`, `UNCHANGED` 생성

SEC 요청에는 `SEC_USER_AGENT`를 반드시 포함합니다. 요청 큐는 110ms 이상의 간격을 두어 초당 10회 미만으로 제한하며, 429와 5xx 응답에는 exponential backoff를 적용합니다. 이미 저장된 accession number는 다시 요청하지 않습니다. 초기 동기화는 과도한 요청을 피하기 위해 최근 8개 filing까지만 처리합니다.

## 관리자 기능

`/admin/login`에서 Supabase Auth로 로그인합니다. `admin_users`에 등록된 계정만 다음 작업을 수행할 수 있습니다.

- 기관 추가, 수정, 활성화 및 비활성화
- CIK 등록
- 전체 또는 특정 기관의 새 13F 동기화
- 특정 기관의 최신 filing 삭제 후 재수집
- 최근 동기화 및 관리 로그 확인

모든 Server Action은 작업 직전에 관리자 권한을 다시 검증합니다. SEC 요청과 service role 사용은 서버에서만 수행됩니다.

## Vercel 배포와 Cron

1. 저장소를 Vercel 프로젝트에 연결합니다.
2. `.env.example`의 모든 환경변수를 Vercel Project Settings에 등록합니다.
3. Production 배포를 실행합니다.
4. `vercel.json`의 Cron 등록 여부를 확인합니다.

현재 일정은 매주 월요일 UTC 03:00입니다.

```json
{
  "crons": [
    { "path": "/api/cron/sync-13f", "schedule": "0 3 * * 1" }
  ]
}
```

Vercel Cron은 `CRON_SECRET`이 설정되면 `Authorization: Bearer <CRON_SECRET>` 헤더를 보냅니다. Route Handler는 timing-safe 비교로 이 값을 검증합니다. 수동 호출도 같은 Authorization 헤더가 필요합니다.

## 면책고지

> 본 사이트는 SEC EDGAR 및 Form 13F 공개 공시 자료를 기반으로 한 정보 제공 사이트입니다. 본 자료는 투자 추천, 매수·매도 권유, 금융 자문이 아닙니다. 13F 공시는 분기별 지연 공개 자료이며, 현재 보유 현황과 다를 수 있습니다. SEC 13F 데이터는 제출자가 제공한 자료를 기반으로 하며 정확성이 보장되지 않을 수 있습니다. 투자 판단과 책임은 이용자 본인에게 있습니다.

각 데이터 화면에는 보고 기준일과 제출일, SEC 원문 링크 및 데이터 한계가 함께 표시됩니다. 배포 전 운영 국가의 광고, 개인정보, 금융 정보 제공 관련 법률과 Google AdSense 정책을 별도로 검토해야 합니다.

## 향후 개선

- SEC에서 CIK를 검증한 추가 기관 활성화
- 관리자가 검증하는 CUSIP/ticker 별칭 도구 개선
- 교육 글 작성·수정 관리자 기능
- 콘텐츠 흐름을 방해하지 않는 AdSense 슬롯
- 다국어 지원
- 기업행동과 수정 공시 처리 고도화
