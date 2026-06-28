import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 py-12 duration-700 sm:py-20">
      {eyebrow && <p className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">{eyebrow}</p>}
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl sm:leading-[1.1]">{title}</h1>
      <p className="mt-6 text-lg leading-8 text-zinc-500 dark:text-zinc-400 sm:text-xl">{description}</p>
    </div>
  );
}

export function SectionTitle({ title, description, href, linkLabel = "전체 보기" }: { title: string; description?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:text-base">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
          {linkLabel} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      </div>
      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}

export function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "red" | "blue" | "amber" }) {
  const colors = {
    slate: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    green: "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
    red: "bg-rose-100/80 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400",
    blue: "bg-sky-100/80 text-sky-800 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-100/80 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-colors ${colors[tone]}`}>{children}</span>;
}
