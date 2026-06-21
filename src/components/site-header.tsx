import Link from "next/link";
import { BarChart3, Menu } from "lucide-react";

const links = [["투자자", "/investors"], ["종목", "/stocks"], ["공통 보유", "/overlap"], ["투자 가이드", "/learn"], ["서비스 소개", "/about"]] as const;

export function SiteHeader() {
  return <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5 text-xl font-black tracking-[-.04em] text-slate-950"><span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-emerald-300 shadow-sm"><BarChart3 className="size-5" /></span>Invest<span className="text-emerald-600">info</span></Link>
      <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-xl px-3.5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950">{label}</Link>)}</nav>
      <details className="relative md:hidden"><summary className="list-none rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700"><Menu className="size-5" /><span className="sr-only">메뉴 열기</span></summary><nav className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">{links.map(([label, href]) => <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-slate-50">{label}</Link>)}</nav></details>
    </div>
  </header>;
}
