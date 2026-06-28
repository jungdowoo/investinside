import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { Container, PageHeader, Pill } from "@/components/ui";
import { learnPosts } from "@/content/learn/posts";

export const metadata: Metadata = { title: "투자 용어", description: "13F 공시와 ETF, 포트폴리오를 올바르게 읽기 위한 기초 교육 콘텐츠" };

export default function LearnPage() {
  return <Container className="pb-16"><PageHeader eyebrow="Learn" title="숫자보다 먼저, 의미를 읽습니다" description="공시 표 한 줄을 매매 신호로 오해하지 않도록 13F의 구조와 투자 용어를 차근차근 설명합니다." />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{learnPosts.map((post) => <Link key={post.slug} href={`/learn/${post.slug}`} className="group rounded-lg border border-stone-200 bg-white/75 p-6 shadow-sm hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white hover:shadow-md"><div className="flex items-center justify-between"><Pill tone="green">{post.category}</Pill><span className="flex items-center gap-1 text-xs text-stone-400"><Clock className="size-3.5" /> {post.readingMinutes}분</span></div><BookOpen className="mt-8 size-6 text-teal-700" /><h2 className="mt-3 text-lg font-black leading-7 text-stone-950 group-hover:text-teal-800">{post.title}</h2><p className="mt-3 text-sm leading-6 text-stone-500">{post.description}</p></Link>)}</div>
  </Container>;
}
