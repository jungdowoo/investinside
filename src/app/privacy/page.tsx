import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "개인정보처리방침", description: "Investinfo 개인정보 처리, 쿠키 및 광고 정책" };

export default function PrivacyPage() {
  return (
    <Container className="pb-16">
      <PageHeader eyebrow="Privacy" title="개인정보처리방침" description="서비스 이용 과정에서 처리될 수 있는 정보와 이용자의 권리를 안내합니다." />
      <article className="prose-fi max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
        <p className="!mt-0 text-sm font-medium">시행일: 2026년 6월 28일</p>

        <h2>수집하는 정보</h2>
        <p>Investinfo의 공개 페이지는 회원가입 없이 이용할 수 있습니다. 서버와 호스팅 사업자는 보안과 장애 대응을 위해 접속 시각, IP 주소, 브라우저 종류, 요청 URL 같은 접속 기록을 제한적으로 처리할 수 있습니다.</p>

        <h2>관리자 인증</h2>
        <p>관리자 계정의 이메일과 인증 정보는 Supabase Auth가 처리합니다. 비밀번호 원문은 Investinfo 데이터베이스에 저장하지 않습니다.</p>

        <h2>쿠키와 Google 광고 (AdSense)</h2>
        <p>본 사이트는 서비스 운영, 트래픽 분석 및 <strong>Google AdSense</strong>를 통한 맞춤형 광고 제공을 위해 쿠키를 사용합니다.</p>
        <ul>
          <li>Google을 포함한 제3자 공급업체는 쿠키를 사용하여 사용자가 귀하의 웹사이트 또는 다른 웹사이트를 이전에 방문한 내역을 기반으로 광고를 게재합니다.</li>
          <li>Google의 <strong>DoubleClick DART 쿠키</strong> 사용을 통해 Google과 그 파트너는 인터넷 웹사이트 방문 내역을 기반으로 사용자에게 적절한 광고를 게재할 수 있습니다.</li>
          <li>사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-600 underline dark:text-amber-500">광고 설정</a>을 방문하여 맞춤 광고를 위한 DART 쿠키의 사용을 거부할 수 있습니다. 또는 <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-600 underline dark:text-amber-500">aboutads.info</a>로 이동하여 제3자 공급업체의 맞춤 광고 쿠키 사용을 거부할 수 있습니다.</li>
        </ul>

        <h2>제3자 처리</h2>
        <p>서비스 인프라를 위해 Vercel과 Supabase가 각자의 약관 및 개인정보 정책에 따라 데이터를 처리할 수 있습니다. 화면에 표시되는 광고와 관련하여 Google 및 인증된 제3자 광고 네트워크가 데이터를 수집할 수 있습니다.</p>

        <h2>보유 기간과 권리</h2>
        <p>접속 기록은 보안과 법적 의무에 필요한 기간만 보유하고 목적 달성 후 삭제합니다. 개인정보 열람, 정정, 삭제 또는 처리 제한 요청은 문의 페이지의 이메일로 접수할 수 있습니다.</p>
      </article>
    </Container>
  );
}
