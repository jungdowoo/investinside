import Link from "next/link";
import { BarChart3, Menu } from "lucide-react";

const links = [["투자자", "/investors"], ["종목", "/stocks"], ["공통 보유", "/overlap"], ["투자 가이드", "/learn"], ["서비스 소개", "/about"]] as const;

export function SiteHeader() {
  return <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fffdf8]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5 text-xl font-black text-stone-950"><span className="grid size-9 place-items-center rounded-lg bg-stone-950 text-teal-200 shadow-sm"><BarChart3 className="size-5" /></span>Invest<span className="text-teal-700">info</span></Link>
      <nav className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white/70 p-1 shadow-sm md:flex" aria-label="주요 메뉴">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-full px-3.5 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100 hover:text-stone-950">{label}</Link>)}</nav>
      <details className="relative md:hidden"><summary className="list-none rounded-lg border border-stone-200 bg-white p-2.5 text-stone-700 shadow-sm"><Menu className="size-5" /><span className="sr-only">메뉴 열기</span></summary><nav className="absolute right-0 mt-2 w-52 rounded-lg border border-stone-200 bg-[#fffdf8] p-2 shadow-2xl">{links.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-stone-100">{label}</Link>)}</nav></details>
    </div>
  </header>;
}
