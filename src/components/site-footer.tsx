import Link from "next/link";

const service = [["투자자", "/investors"], ["종목", "/stocks"], ["공통 보유", "/overlap"], ["투자 가이드", "/learn"]] as const;
const trust = [["서비스 소개", "/about"], ["데이터 방법론", "/methodology"], ["편집 원칙", "/editorial-policy"], ["문의", "/contact"]] as const;
const legal = [["이용약관", "/terms"], ["개인정보처리방침", "/privacy"], ["면책고지", "/disclaimer"]] as const;

export function SiteFooter() {
  return <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
      <div><p className="text-xl font-black tracking-tight text-white">Invest<span className="text-emerald-400">info</span></p><p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">SEC EDGAR 공개 공시를 바탕으로 투자자 포트폴리오와 기업 재무 정보를 이해하기 쉽게 정리합니다. 투자 권유나 실시간 시세 서비스가 아닙니다.</p></div>
      <FooterLinks title="서비스" links={service} /><FooterLinks title="운영 정보" links={trust} /><FooterLinks title="정책" links={legal} />
    </div>
    <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Investinfo. SEC 공개 공시 기반 정보·교육 서비스.</div>
  </footer>;
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) { return <nav><p className="mb-4 text-sm font-black text-white">{title}</p><div className="space-y-3">{links.map(([label, href]) => <Link key={href} href={href} className="block text-sm text-slate-400 hover:text-white">{label}</Link>)}</div></nav>; }
