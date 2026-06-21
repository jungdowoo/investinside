import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { DataNotice } from "@/components/data-notice";
import { Container, Pill } from "@/components/ui";
import { getLearnPost, learnPosts } from "@/content/learn/posts";

export function generateStaticParams() { return learnPosts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getLearnPost(slug); return post ? { title: post.title, description: post.description, keywords: [post.title, post.category, "주식 용어", "투자 용어", "SEC 13F"], alternates: { canonical: `/learn/${post.slug}` }, openGraph: { type: "article", title: post.title, description: post.description } } : {}; }

export default async function LearnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getLearnPost(slug); if (!post) notFound();
  return <Container className="py-10 sm:py-14"><article className="mx-auto max-w-3xl"><Link href="/learn" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-700"><ArrowLeft className="size-4" /> 투자 용어 목록</Link><div className="mt-8 flex items-center gap-3"><Pill tone="green">{post.category}</Pill><span className="flex items-center gap-1 text-sm text-slate-400"><Clock className="size-4" /> 약 {post.readingMinutes}분</span></div><h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{post.description}</p><div className="my-8"><DataNotice compact /></div><div className="prose-fi">{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}</div><div className="mt-12 rounded-2xl bg-slate-100 p-6 text-sm leading-7 text-slate-600">이 글은 일반적인 개념을 설명하는 교육 자료이며 개인의 상황을 고려한 금융 자문이 아닙니다. 상품과 공시의 공식 문서를 직접 확인하세요.</div></article></Container>;
}
