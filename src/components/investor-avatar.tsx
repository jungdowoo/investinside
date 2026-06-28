import { INVESTOR_PROFILES } from "@/lib/investor-profiles";

export function InvestorAvatar({ slug, name, className = "size-20" }: { slug: string; name: string; className?: string }) {
  const profile = INVESTOR_PROFILES[slug];
  if (!profile) return <div className={`${className} grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-zinc-100 text-xl font-bold text-amber-700`}>{name.slice(0, 1)}</div>;
  const x = profile.sprite.column * 50;
  const y = profile.sprite.row * 50;
  return <div role="img" aria-label={`${name} 편집 일러스트`} className={`${className} shrink-0 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 bg-no-repeat ring-1 ring-zinc-200`} style={{ backgroundImage: "url('/images/investor-portraits.webp')", backgroundSize: "300% 300%", backgroundPosition: `${x}% ${y}%` }} />;
}
