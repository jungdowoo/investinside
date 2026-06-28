import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div className="max-w-3xl py-10 sm:py-14">{eyebrow && <p className="mb-3 text-xs font-black uppercase text-teal-700">{eyebrow}</p>}<h1 className="text-3xl font-black leading-tight text-stone-950 sm:text-5xl">{title}</h1><p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">{description}</p></div>;
}

export function SectionTitle({ title, description, href, linkLabel = "전체 보기" }: { title: string; description?: string; href?: string; linkLabel?: string }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-black leading-tight text-stone-950 sm:text-2xl">{title}</h2>{description && <p className="mt-1 text-sm leading-6 text-stone-500">{description}</p>}</div>{href && <Link href={href} className="shrink-0 rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 text-sm font-bold text-teal-800 shadow-sm hover:border-teal-200 hover:bg-teal-50">{linkLabel} →</Link>}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-lg border border-dashed border-stone-300 bg-white/55 px-5 py-10 text-center shadow-sm"><p className="font-bold text-stone-800">{title}</p><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-500">{description}</p></div>;
}

export function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "red" | "blue" | "amber" }) {
  const colors = { slate: "border-stone-200 bg-stone-50 text-stone-700", green: "border-teal-200 bg-teal-50 text-teal-800", red: "border-rose-200 bg-rose-50 text-rose-800", blue: "border-sky-200 bg-sky-50 text-sky-800", amber: "border-amber-200 bg-amber-50 text-amber-900" };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>;
}
