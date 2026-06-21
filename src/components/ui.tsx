import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div className="max-w-3xl py-10 sm:py-14">{eyebrow && <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>}<h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1><p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p></div>;
}

export function SectionTitle({ title, description, href, linkLabel = "전체 보기" }: { title: string; description?: string; href?: string; linkLabel?: string }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{href && <Link href={href} className="shrink-0 text-sm font-bold text-emerald-700 hover:text-emerald-800">{linkLabel} →</Link>}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center"><p className="font-bold text-slate-800">{title}</p><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p></div>;
}

export function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "red" | "blue" | "amber" }) {
  const colors = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-100 text-emerald-800", red: "bg-rose-100 text-rose-800", blue: "bg-blue-100 text-blue-800", amber: "bg-amber-100 text-amber-900" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>;
}
