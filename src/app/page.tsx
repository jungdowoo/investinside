import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Layers3, Search, Sparkles } from "lucide-react";
import { InvestorAvatar } from "@/components/investor-avatar";
import { StockLabelLink } from "@/components/stock-label-link";
import { Container, EmptyState, Pill, SectionTitle } from "@/components/ui";
import { learnPosts } from "@/content/learn/posts";
import { getInvestors, getOverlap, getRecentFilings } from "@/lib/data/public";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const [investors, filings, overlap] = await Promise.all([getInvestors(), getRecentFilings(5), getOverlap()]);

  return (
    <>
      <section className="relative overflow-hidden bg-white dark:bg-[#09090b]">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-500/5" />

        <Container className="relative grid items-center gap-12 py-20 sm:py-32 lg:grid-cols-[1.1fr_.9fr] lg:py-32">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-50/50 px-4 py-1.5 text-xs font-bold text-amber-700 backdrop-blur-sm dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
              <Sparkles className="size-3.5" /> SEC 13F 공식 공시 기반
            </div>
            <h1 className="mt-8 max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl sm:leading-[1.1]">
              세계적인 투자자들의<br />
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-500">포트폴리오 리서치</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              워런 버핏부터 국민연금까지, 공개된 미국 주식 보유 내역과 분기별 변화를 트렌디하고 차분하게 분석해보세요.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/investors" className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-zinc-900/10 transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100">
                포트폴리오 보기
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/stocks" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <Search className="size-4" /> 종목 검색
              </Link>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-zinc-100 pt-8 dark:border-zinc-800/50">
              <div><p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{investors.length}곳</p><p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">추적 투자자·기관</p></div>
              <div><p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">분기별</p><p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">공시 변화 비교</p></div>
              <div><p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">100%</p><p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">SEC 원문 매칭</p></div>
            </div>
          </div>

          <div className={`grid gap-4 animate-in fade-in slide-in-from-right-8 duration-1000 delay-150 fill-mode-both ${investors.length > 1 ? "grid-cols-2" : "mx-auto w-full max-w-sm"}`}>
            {investors.slice(0, 4).map((investor) => (
              <Link key={investor.id} href={`/investors/${investor.slug}`} className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50 dark:hover:bg-zinc-800/80">
                <InvestorAvatar slug={investor.slug} name={investor.display_name} className="aspect-square w-full rounded-xl" />
                <p className="mt-5 line-clamp-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{investor.display_name}</p>
                <p className="mt-1 line-clamp-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{investor.firm_name}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <div className="bg-zinc-50 dark:bg-[#09090b]">
        <Container className="space-y-24 py-20 sm:py-28">
          <section>
            <SectionTitle title="주요 투자자 포트폴리오" description="미국 증권거래위원회(SEC)에 실제로 제출된 13F 공시 원본을 바탕으로 제공됩니다." href="/investors" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {investors.slice(0, 6).map((investor) => (
                <Link key={investor.id} href={`/investors/${investor.slug}`} className="group flex items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50">
                  <InvestorAvatar slug={investor.slug} name={investor.display_name} className="size-16 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-bold text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400">{investor.display_name}</h3>
                    <p className="mt-1 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">{investor.firm_name}</p>
                  </div>
                  <ArrowRight className="size-5 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-amber-500 dark:text-zinc-600" />
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionTitle title="최근 업데이트된 공시" description="가장 최근에 추가되거나 변경된 13F 문서" />
              {filings.length ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  {filings.map((filing) => (
                    <Link key={filing.id} href={`/investors/${filing.investor?.slug}`} className="flex items-center justify-between gap-4 border-b border-zinc-100 p-5 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{filing.investor?.display_name ?? "기관"}</p>
                        <p className="mt-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">보고 기준일 {formatDate(filing.report_date)}</p>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        <CalendarDays className="size-3.5" /> {formatDate(filing.filing_date)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : <EmptyState title="수집된 공시가 없습니다" description="최신 SEC 13F 수집 후 표시됩니다." />}
            </div>

            <div>
              <SectionTitle title="여러 기관이 공통 보유한 종목" description="2곳 이상의 주요 투자자가 동시에 투자한 종목" href="/overlap" />
              {overlap.length ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  {overlap.slice(0, 5).map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 border-b border-zinc-100 p-5 last:border-0 dark:border-zinc-800">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-zinc-900 dark:text-zinc-100"><StockLabelLink ticker={item.ticker} issuerName={item.issuerName} /></p>
                        <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.ticker ? `CUSIP ${item.cusip}` : "ticker 미확인"}</p>
                      </div>
                      <Pill tone="blue">{item.owners.length}곳 보유</Pill>
                    </div>
                  ))}
                </div>
              ) : <EmptyState title="겹치는 종목이 없습니다" description="2개 이상의 기관 데이터가 있을 때 계산됩니다." />}
            </div>
          </section>

          <section>
            <SectionTitle title="인사이트가 담긴 투자가이드" description="투자 전 반드시 알아야 할 13F 공시의 한계와 주의사항" href="/learn" />
            <div className="grid gap-6 md:grid-cols-3">
              {learnPosts.slice(0, 3).map((post, index) => (
                <Link key={post.slug} href={`/learn/${post.slug}`} className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50">
                  <div className="grid size-12 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500">
                    {index === 0 ? <BookOpen className="size-6" /> : <Layers3 className="size-6" />}
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">{post.category}</p>
                  <h3 className="mt-2.5 text-xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
