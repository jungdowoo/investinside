import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Investinfo | 워런 버핏·국민연금 포트폴리오와 미국주식 정보", template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ["워런 버핏 포트폴리오", "국민연금 포트폴리오", "레이 달리오 포트폴리오", "마이클 버리 포트폴리오", "13F", "미국주식", "기관투자자 보유종목", "주식 재무제표", "SEC 공시"],
  openGraph: { type: "website", locale: "ko_KR", siteName: siteConfig.name, title: "Investinfo | 세계 투자자 포트폴리오", description: siteConfig.description, url: siteConfig.url },
  twitter: { card: "summary_large_image", title: "Investinfo | 세계 투자자 포트폴리오", description: siteConfig.description },
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, url: siteConfig.url, description: siteConfig.description, inLanguage: "ko-KR", potentialAction: { "@type": "SearchAction", target: `${siteConfig.url}/stocks?q={search_term_string}`, "query-input": "required name=search_term_string" } };
  return <html lang="ko"><body className="flex min-h-screen flex-col"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /></body></html>;
}
