import Link from "next/link";
import { BarChart3, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [["투자자", "/investors"], ["종목", "/stocks"], ["공통 보유", "/overlap"], ["투자 가이드", "/learn"], ["서비스 소개", "/about"]] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-zinc-900 transition-transform hover:scale-105 dark:text-zinc-50">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-amber-400 shadow-md dark:from-zinc-100 dark:to-zinc-300 dark:text-amber-600">
            <BarChart3 className="size-4.5" strokeWidth={2.5} />
          </span>
          Invest<span className="text-amber-600 dark:text-amber-500">info</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <details className="relative md:hidden group">
              <summary className="list-none flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                <Menu className="size-4.5" />
                <span className="sr-only">메뉴 열기</span>
              </summary>
              <nav className="absolute right-0 top-full mt-3 w-56 origin-top-right rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95">
                {links.map(([label, href]) => (
                  <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
