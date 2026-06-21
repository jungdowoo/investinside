import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <p className="font-bold text-white">FolioInside</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">SEC EDGAR와 Form 13F 공식 공개 공시만을 정리하는 교육·정보 서비스입니다. 시세 데이터나 외부 포트폴리오 데이터는 사용하지 않습니다.</p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm">
          <Link href="/disclaimer">면책고지</Link><Link href="/about#data-source">데이터 출처</Link>
          <Link href="/privacy">개인정보처리방침</Link><Link href="/contact">문의</Link>
          <Link href="/admin/login" className="text-slate-500">관리자</Link>
        </nav>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} FolioInside. 정보 제공 및 교육 목적.</div>
    </footer>
  );
}
