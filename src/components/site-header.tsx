import Link from "next/link";
import { Menu } from "lucide-react";

const links = [
  ["홈", "/"],
  ["투자자", "/investors"],
  ["겹치는 종목", "/overlap"],
  ["종목", "/stocks"],
  ["투자 용어", "/learn"],
  ["소개", "/about"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-950">
          <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-sm text-white">FI</span>
          FolioInside
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              {label}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary className="list-none rounded-lg border border-slate-200 p-2 text-slate-700"><Menu className="size-5" /><span className="sr-only">메뉴 열기</span></summary>
          <nav className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {links.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50">{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
