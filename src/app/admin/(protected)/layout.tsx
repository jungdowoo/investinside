import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) { const user = await requireAdmin(); return <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8"><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4"><p className="px-3 text-xs font-bold text-slate-400">ADMIN</p><p className="mt-1 truncate px-3 text-sm font-bold">{user.email}</p><nav className="mt-5 space-y-1">{[["대시보드","/admin"],["투자자 관리","/admin/investors"],["수집 로그","/admin/sync-logs"]].map(([label,href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">{label}</Link>)}</nav><form action={signOutAction} className="mt-5 border-t border-slate-100 pt-4"><button className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">로그아웃</button></form></aside><div className="min-w-0">{children}</div></div>; }
