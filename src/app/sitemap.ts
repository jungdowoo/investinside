import type { MetadataRoute } from "next";
import { learnPosts } from "@/content/learn/posts";
import { getInvestors, getLatestHoldings } from "@/lib/data/public";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [investors, latest] = await Promise.all([getInvestors(), getLatestHoldings()]);
  const paths = ["", "/investors", "/overlap", "/stocks", "/learn", "/about", "/methodology", "/editorial-policy", "/contact", "/terms", "/privacy", "/disclaimer"];
  const tickers = [...new Set(latest.holdings.map((item) => item.ticker?.toLowerCase()).filter((item): item is string => Boolean(item)))];
  return [
    ...paths.map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : .7 })),
    ...investors.map((investor) => ({ url: `${siteConfig.url}/investors/${investor.slug}`, changeFrequency: "weekly" as const, priority: .85 })),
    ...tickers.map((ticker) => ({ url: `${siteConfig.url}/stocks/${ticker}`, changeFrequency: "monthly" as const, priority: .7 })),
    ...learnPosts.map((post) => ({ url: `${siteConfig.url}/learn/${post.slug}`, changeFrequency: "monthly" as const, priority: .65 })),
  ];
}
