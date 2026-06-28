import Link from "next/link";
import { BarChart3 } from "lucide-react";

const service = [["투자자", "/investors"], ["종목", "/stocks"], ["공통 보유", "/overlap"], ["투자 가이드", "/learn"]] as const;
const trust = [["서비스 소개", "/about"], ["데이터 방법론", "/methodology"], ["편집 원칙", "/editorial-policy"], ["문의", "/contact"]] as const;
const legal = [["이용약관", "/terms"], ["개인정보처리방침", "/privacy"], ["면책고지", "/disclaimer"]] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            <BarChart3 className="size-5 text-amber-500" strokeWidth={2.5} />
            Invest<span className="text-amber-500">info</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            SEC EDGAR 공개 공시를 바탕으로 투자자 포트폴리오와 기업 재무 정보를 이해하기 쉽게 정리합니다. 투자 권유나 실시간 시세 서비스가 아닙니다.
          </p>
        </div>
        <FooterLinks title="서비스" links={service} />
        <FooterLinks title="운영 정보" links={trust} />
        <FooterLinks title="정책" links={legal} />
      </div>
      <div className="border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} Investinfo. SEC 공개 공시 기반 정보·교육 서비스.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300">개인정보처리방침</Link>
            <Link href="/terms" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <nav>
      <p className="mb-5 text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100">{title}</p>
      <div className="space-y-3.5">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block text-sm font-medium text-zinc-500 transition-colors hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-500">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
