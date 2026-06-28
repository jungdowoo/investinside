import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div className="max-w-3xl py-10 sm:py-14">{eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-700">{eyebrow}</p>}<h1 className="text-3xl font-extrabold leading-tight text-zinc-900 sm:text-5xl">{title}</h1><p className="mt-4 text-base leading-7 text-zinc-500 sm:text-lg">{description}</p></div>;
}

export function SectionTitle({ title, description, href, linkLabel = "전체 보기" }: { title: string; description?: string; href?: string; linkLabel?: string }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold leading-tight text-zinc-900 sm:text-2xl">{title}</h2>{description && <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>}</div>{href && <Link href={href} className="shrink-0 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50">{linkLabel} →</Link>}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-md border border-dashed border-zinc-300 bg-white px-5 py-10 text-center"><p className="font-semibold text-zinc-700">{title}</p><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">{description}</p></div>;
}

export function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "red" | "blue" | "amber" }) {
  const colors = { slate: "border-zinc-200 bg-zinc-50 text-zinc-600", green: "border-emerald-200 bg-emerald-50 text-emerald-700", red: "border-rose-200 bg-rose-50 text-rose-700", blue: "border-sky-200 bg-sky-50 text-sky-700", amber: "border-amber-200 bg-amber-50 text-amber-800" };
  return <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${colors[tone]}`}>{children}</span>;
}
