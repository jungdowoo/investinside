import { INVESTOR_PROFILES } from "@/lib/investor-profiles";

export function InvestorAvatar({ slug, name, className = "size-20" }: { slug: string; name: string; className?: string }) {
  const profile = INVESTOR_PROFILES[slug];
  if (!profile) return <div className={`${className} grid shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-100 to-stone-100 text-xl font-black text-teal-800`}>{name.slice(0, 1)}</div>;
  const x = profile.sprite.column * 50;
  const y = profile.sprite.row * 50;
  return <div role="img" aria-label={`${name} 편집 일러스트`} className={`${className} shrink-0 overflow-hidden rounded-lg bg-stone-100 bg-no-repeat shadow-sm ring-1 ring-stone-200`} style={{ backgroundImage: "url('/images/investor-portraits.webp')", backgroundSize: "300% 300%", backgroundPosition: `${x}% ${y}%` }} />;
}
