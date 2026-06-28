import Link from "next/link";
import { BarChart3, Menu } from "lucide-react";

const links = [["투자자", "/investors"], ["종목", "/stocks"], ["공통 보유", "/overlap"], ["투자 가이드", "/learn"], ["서비스 소개", "/about"]] as const;

export function SiteHeader() {
  return <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold text-zinc-900"><span className="grid size-8 place-items-center rounded-md bg-zinc-900 text-amber-400"><BarChart3 className="size-4" /></span>Invest<span className="text-amber-600">info</span></Link>
      <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">{links.map(([label, href]) => <Link key={href} href={href} className="px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900">{label}</Link>)}</nav>
      <details className="relative md:hidden"><summary className="list-none rounded-md border border-zinc-200 bg-white p-2.5 text-zinc-600"><Menu className="size-5" /><span className="sr-only">메뉴 열기</span></summary><nav className="absolute right-0 mt-2 w-52 rounded-md border border-zinc-200 bg-white p-2 shadow-xl">{links.map(([label, href]) => <Link key={href} href={href} className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-zinc-50">{label}</Link>)}</nav></details>
    </div>
  </header>;
}
